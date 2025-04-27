import dotenv from 'dotenv';
import Url from '../models/urlModel.js';
import UrlUtils from '../utils/urlUtils.js';
import urlEmitter from '../utils/eventEmitter.js';

dotenv.config();

class UrlService {
  static async shortenUrl(originalUrl) {
    let shortenedUrl;
    let isUnique = false;

    // Generate a unique shortened URL
    while (!isUnique) {
      shortenedUrl = UrlUtils.generateShortenedUrl(process.env.TOKEN_LENGTH || 6);
      const existingUrl = await Url.findOne({ shortenedUrl });
      isUnique = !existingUrl; // Set to true if no duplicate is found
    }


    // Emit event after successfully saving the URL
    urlEmitter.emit('urlShortened', { originalUrl, shortenedUrl });

    return newUrl;
  }

  static async saveUrl(originalUrl, shortenedUrl) {
    const newUrl = new Url({
      originalUrl,
      shortenedUrl,
      clickCount: 0,
    });

    try {
      await newUrl.save();
    } catch (error) {
      console.error('Error saving URL:', error.message);
      throw error;
    }

    return newUrl;
  }

  static async trackClick(data) {
    const url = await Url.findOne({ shortenedUrl: data.shortenedUrl });
    if (url) {
      url.clickCount++;
      await url.save();

      const analytics = new Click(data);
      await analytics.save();
    }
  }

  static async bulkShortenUrls(urls) {
    const results = [];

    for (const url of urls) {
      const shortenedUrl = await this.shortenUrl(url);
      results.push(shortenedUrl);
    }

    return results;
  }
}

export default UrlService;
