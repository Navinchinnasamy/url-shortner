import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  shortCode: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  ip: String,
  browser: String,
  os: String,
  platform: String,
  source: String,
  userAgent: String
});

const Click = mongoose.model('Click', clickSchema);

export default Click;
