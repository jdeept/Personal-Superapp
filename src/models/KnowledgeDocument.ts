import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeDocument extends Document {
  title: string;
  category: string;
  content: string;
  updatedAt: Date;
  createdAt: Date;
}

const KnowledgeDocumentSchema: Schema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, default: "" },
}, { timestamps: true });

export const KnowledgeDocument = mongoose.models.KnowledgeDocument || mongoose.model<IKnowledgeDocument>('KnowledgeDocument', KnowledgeDocumentSchema);
