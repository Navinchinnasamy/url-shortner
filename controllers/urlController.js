import UrlService from '../services/urlService.js';
import dotenv from 'dotenv';
import Url from '../models/urlModel.js';
import UrlUtils from '../utils/urlUtils.js';
import urlEmitter from '../utils/eventEmitter.js';
import { UserAgent } from 'express-useragent';

dotenv.config();

class UrlController {
  async shortenUrl(req, res) {
    const { fullUrl, expiryTime } = req.body;

    if (!fullUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    try {
      const normalizedUrl = UrlUtils.normalizeUrl(fullUrl);
      const expiryDate = expiryTime ? new Date(Date.now() + expiryTime * 1000) : null;

      const newUrl = await UrlService.shortenUrl(normalizedUrl, expiryDate);

      res.status(200).json({
        shortenedUrl: `${process.env.SHORT_URL_DOMAIN}/${newUrl.shortenedUrl}`,
        expiryDate,
      });
    } catch (error) {
      console.error('Error in shortenUrl:', error.message);
      res.status(500).json({ error: 'An error occurred while shortening the URL' });
    }
  }

  async bulkShortenUrls(req, res) {
    const { urls } = req.body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'A list of URLs is required' });
    }

    try {
      const shortenedUrls = await UrlService.bulkShortenUrls(urls);
      res.status(200).json({ shortenedUrls: shortenedUrls.map((u) => u.shortenedUrl) });
    } catch (error) {
      console.error('Error in bulkShortenUrls:', error.message);
      res.status(500).json({ error: 'An error occurred while shortening URLs in bulk' });
    }
  }

  async redirectUrl(req, res) {
    const { shortenedUrl } = req.params;

    try {
      const url = await Url.findOne({ shortenedUrl });
      if (url) {
        // Check if the URL has expired
        if (url.expiryDate && new Date() > url.expiryDate) {
          return res.status(410).json({ error: 'This shortened URL has expired' });
        }

        // Capture analytics
        const source = req.get('Referrer') || 'Direct';
        const userAgent = new UserAgent();
        const ua = userAgent.parse(req.headers['user-agent']);

        const analyticsData = {
          shortCode: shortenedUrl,
          ip: req.ip || req.connection.remoteAddress,
          browser: ua.browser,
          os: ua.os,
          platform: ua.platform,
          source,
          userAgent: req.headers['user-agent'],
        };

        // Emit event after updating the click count
        urlEmitter.emit('urlClicked', { shortenedUrl, clickCount: url.clickCount, analyticsData });

        // Redirect to the original URL
        return res.redirect(url.originalUrl, 301);
      }

      res.status(404).json({ error: 'Shortened URL not found' });
    } catch (error) {
      console.error('Error in redirectUrl:', error.message);
      res.status(500).json({ error: 'An error occurred while processing the redirection' });
    }
  }
}

export default new UrlController();
