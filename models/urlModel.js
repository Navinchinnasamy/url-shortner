import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortenedUrl: { type: String, required: true, unique: true },
  clickCount: { type: Number, default: 0 },
  expiryDate: { type: Date }, // New field for expiry date
});

export default mongoose.model('Url', urlSchema);
