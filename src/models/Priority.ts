import mongoose, { Schema, Document } from 'mongoose';

export interface IPriority extends Document {
  label: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PrioritySchema: Schema = new Schema({
  label: { type: String, required: true },
  done: { type: Boolean, default: false },
}, { timestamps: true });

export const Priority = mongoose.models.Priority || mongoose.model<IPriority>('Priority', PrioritySchema);
