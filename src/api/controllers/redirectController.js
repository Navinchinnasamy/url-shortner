async function redirect(req, res, next) {
  try {
    const { shortCode } = req.params;
    const originalUrl = await req.urlService.getOriginalUrl(shortCode);
    res.redirect(301, originalUrl);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

module.exports = { redirect };