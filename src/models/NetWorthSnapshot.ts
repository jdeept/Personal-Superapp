import mongoose, { Schema, Document } from 'mongoose';

export interface INetWorthSnapshot extends Document {
  date: string; // YYYY-MM
  totalValue: number;
  liquidCash: number;
  investments: number;
  createdAt: Date;
}

const NetWorthSnapshotSchema = new Schema<INetWorthSnapshot>({
  date: { type: String, required: true },
  totalValue: { type: Number, required: true },
  liquidCash: { type: Number, required: true },
  investments: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Avoid OverwriteModelError
export const NetWorthSnapshot = mongoose.models.NetWorthSnapshot || mongoose.model<INetWorthSnapshot>('NetWorthSnapshot', NetWorthSnapshotSchema);
