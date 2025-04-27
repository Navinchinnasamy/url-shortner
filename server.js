import dotenv from 'dotenv';
import express from 'express';
import * as UrlController from './controllers/urlController.js';
import urlEmitter from './utils/eventEmitter.js';
import DatabaseFactory from './utils/DatabaseFactory.js';
import UrlService from './services/urlService.js';

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

(async () => {
  try {
    await DatabaseFactory.connect('mongodb', process.env.MONGO_URI);
  } catch (error) {
    console.error('Failed to initialize database connection:', error.message);
    process.exit(1);
  }
})();

app.post('/api/shorten', UrlController.shortenUrl.bind(UrlController));
app.post('/api/shorten/bulk', UrlController.bulkShortenUrls.bind(UrlController));
app.get('/:shortenedUrl', UrlController.redirectUrlController);


urlEmitter.on('urlShortened', (data) => {
  console.log(`Shortened URL created: ${data.shortenedUrl} for ${data.originalUrl}`);
  UrlService.saveUrl(data.originalUrl, data.shortenedUrl)
    .then(() => console.log(`URL saved: ${data.shortenedUrl}`))
    .catch((error) => console.error('Error saving URL:', error.message));
});

urlEmitter.on('urlClicked', (data) => {
  console.log(`URL clicked: ${data.shortenedUrl}, Click count: ${data.clickCount}`);
  UrlService.trackClick(data)
    .then(() => console.log(`Click tracked for: ${data.shortenedUrl}`))
    .catch((error) => console.error('Error tracking click:', error.message));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} (${process.env.APP_ENV || 'production'})`);
});
