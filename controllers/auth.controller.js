const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

exports.register = async (req, res) => {
  try {
    const { email, password, role, ig_username } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create
    user = await User.create({
      email,
      password: hashedPassword,
      role: role.toUpperCase(), // BRAND or BLOGGER
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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Sign token
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
    const { ig_username, avatar_url } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (ig_username) user.ig_username = ig_username;
    if (avatar_url) user.avatar_url = avatar_url;
    // bio field wasn't requested in schema but mentioned in TZ, omitting unless needed later
    
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
