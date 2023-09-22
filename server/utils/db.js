import mongoose from 'mongoose';
import env from 'process';
import Article from './models/articles.js';
import User from './models/users.js';

class DBStorage {
  constructor(){
    this.DB_HOST = env.DB_HOST || "localhost";
    this.DB_PORT = env.PORT || 27017;
    this.DB_DATABASE = env.DB_DATABASE || "dev_dash";

    this.DB_URL = `mongodb://${this.DB_HOST}:${this.DB_PORT}/${this.DB_DATABASE}`;
    this.db = null;
  }

  async connect() {
    if (!this.db) {
      try {
        mongoose.connect(this.DB_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        this.db = mongoose.connection.db;
        console.log('Connected to MongoDB');
      } catch (error) {
          console.error('MongoDB connection error: ', error);
      }
    }
  }
	
	isAlive() {
		return Boolean(this.db);
	}

	async closeConnection() {
    await this.db.close();
    console.log('Disconnected from MongoDB');
  }
}

export default DBStorage;
