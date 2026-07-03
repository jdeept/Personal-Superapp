import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  date: string; // YYYY-MM-DD format
  name: string;
  completed: boolean;
  createdAt: Date;
}

const HabitSchema = new Schema<IHabit>({
  date: { type: String, required: true },
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Avoid OverwriteModelError
export const Habit = mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema);
