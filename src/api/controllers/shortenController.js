const config = require('../../../config');

async function createShortUrl(req, res, next) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    const shortCode = await req.urlService.createShortUrl(url);
    const shortUrl = `${config.baseUrl}/${shortCode}`;
    res.status(201).json({ short_url: shortUrl });
  } catch (error) {
    next(error);
  }
}

module.exports = { createShortUrl };