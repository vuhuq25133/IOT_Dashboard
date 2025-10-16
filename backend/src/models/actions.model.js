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

setInterval(async () => {
  try {
    const Action = mongoose.model('Action');
    const total = await Action.countDocuments();
    const keep = 1000;
    if (total > keep) {
      const toDelete = total - keep;
      const ids = await Action.find({}, { _id: 1 })
        .sort({ timestamp: 1, _id: 1 })
        .limit(toDelete)
        .lean();
      const deleteIds = ids.map((d) => d._id);
      if (deleteIds.length) {
        const res = await Action.deleteMany({ _id: { $in: deleteIds } });
        console.log(`🧹 Đã dọn ${res.deletedCount} Action cũ (giữ ${keep} bản mới nhất).`);
      }
    }
  } catch (e) {
    console.warn('Action cleanup error:', e?.message || e);
  }
}, 5 * 60 * 1000);

export default mongoose.model('Action', actionSchema);
