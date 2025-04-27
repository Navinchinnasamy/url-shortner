import validator from 'validator';

class UrlUtils {
  static generateShortenedUrl(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }

  static normalizeUrl(fullUrl) {
    if (!fullUrl) return null;

    const normalized = fullUrl.trim();
    if (!validator.isURL(normalized, { require_protocol: false })) {
      throw new Error('Invalid URL');
    }

    return normalized.match(/^https?:\/\//) ? normalized : `https://${normalized}`;
  }
}

export default UrlUtils;
