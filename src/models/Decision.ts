import mongoose, { Schema, Document } from 'mongoose';

export interface IDecision extends Document {
  title: string;
  rationale: string;
  expectedOutcome: string;
  risks: string;
  alternatives: string;
  reviewDate: Date;
  outcomeReview?: string;
  status: 'OPEN' | 'REVIEWED';
  createdAt: Date;
  updatedAt: Date;
}

const DecisionSchema: Schema = new Schema({
  title: { type: String, required: true },
  rationale: { type: String, required: true },
  expectedOutcome: { type: String, required: true },
  risks: { type: String, default: "" },
  alternatives: { type: String, default: "" },
  reviewDate: { type: Date, required: true },
  outcomeReview: { type: String },
  status: { type: String, enum: ['OPEN', 'REVIEWED'], default: 'OPEN' },
}, { timestamps: true });

export const Decision = mongoose.models.Decision || mongoose.model<IDecision>('Decision', DecisionSchema);
