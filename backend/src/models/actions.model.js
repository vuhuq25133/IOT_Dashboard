import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
  device: {
    type: String,
    enum: ['fan', 'air', 'lamp'],
    required: true,
  },
  action: {
    type: String,
    enum: ['turn_on', 'turn_off', 'toggle'],
    required: true,
  },
  previousState: {
    type: String,
    enum: ['on', 'off'],
    default: 'off',
  },
  newState: {
    type: String,
    enum: ['on', 'off'],
    required: true,
  },
  // Single source of truth for time
  timestamp: {
    type: Date,
    default: Date.now,
  },
  triggeredBy: {
    type: String,
    enum: ['user', 'automation', 'schedule'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success',
  },
  errorMessage: {
    type: String,
    default: null,
  },
});

// Indexes for efficient queries
actionSchema.index({ timestamp: -1 });
actionSchema.index({ device: 1, timestamp: -1 });
actionSchema.index({ status: 1, timestamp: -1 });

export default mongoose.model('Action', actionSchema);
