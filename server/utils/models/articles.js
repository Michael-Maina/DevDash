import mongoose from 'mongoose';

const { Schema } = mongoose;

class Article {
  constructor() {
    this.schema = new Schema({
      title: String,
      author: { type: String, default: 'The DevDash Team'},
      tags: Array,
      category: String,
      users_enrolled: Array,
      created_at: { type: Date, default: Date.now},
      updated_at: { type: Date, default: Date.now},
      schema_version: Number,
    });
  }
}
const articleSchema = new Article
const article = mongoose.model('article', articleSchema.schema);

export default article;
