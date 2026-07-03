import mongoose, { Schema, Document } from 'mongoose';

export interface ITrade extends Document {
  date: string;
  ticker: string;
  type: string;
  entry: number;
  exit: number;
  pnl: number;
  tags: string[];
  createdAt: Date;
}

const TradeSchema = new Schema<ITrade>({
  date: { type: String, required: true },
  ticker: { type: String, required: true },
  type: { type: String, required: true },
  entry: { type: Number, required: true },
  exit: { type: Number, required: true },
  pnl: { type: Number, required: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

// Avoid OverwriteModelError
export const Trade = mongoose.models.Trade || mongoose.model<ITrade>('Trade', TradeSchema);
