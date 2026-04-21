const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

exports.register = async (req, res) => {
  try {
    const { email, password, role, ig_username } = req.body;
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
      ig_username
    });
    res.status(201).json({ message: 'Registered successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: payload });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const {
      ig_username, avatar_url, bio,
      followers_count, stories_views_percent, reels_views_percent,
      likes_percent, reach, impressions, engagement_rate
    } = req.body;
    const user = await User.findByPk(req.user.id);
    if (ig_username) user.ig_username = ig_username;
    if (avatar_url) user.avatar_url = avatar_url;
    if (bio !== undefined) user.bio = bio;

    // Instagram metrics (bloggers only)
    if (followers_count !== undefined) user.followers_count = followers_count;
    if (stories_views_percent !== undefined) user.stories_views_percent = stories_views_percent;
    if (reels_views_percent !== undefined) user.reels_views_percent = reels_views_percent;
    if (likes_percent !== undefined) user.likes_percent = likes_percent;
    if (reach !== undefined) user.reach = reach;
    if (impressions !== undefined) user.impressions = impressions;
    if (engagement_rate !== undefined) user.engagement_rate = engagement_rate;

    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findByPk(req.user.id);
    user.avatar_url = '/uploads/' + req.file.filename;
    await user.save();
    res.json({ message: 'Avatar updated', avatar_url: user.avatar_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePushToken = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findByPk(req.user.id);
    user.push_token = token;
    await user.save();
    res.json({ message: 'Push token updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};