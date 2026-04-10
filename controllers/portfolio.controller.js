const { PortfolioMedia } = require('../models');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const mediaType = req.file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE';
    
    const media = await PortfolioMedia.create({
      user_id: req.user.id,
      media_url: '/uploads/' + req.file.filename,
      media_type: mediaType
    });

    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyPortfolio = async (req, res) => {
  try {
    const portfolio = await PortfolioMedia.findAll({
      where: { user_id: req.user.id }
    });
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await PortfolioMedia.findByPk(id);
    
    if (!media) return res.status(404).json({ message: 'Media not found' });
    if (media.user_id !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    await media.destroy();
    res.json({ message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
