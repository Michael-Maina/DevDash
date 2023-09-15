import mongoose from 'mongoose';
import env from 'process';
import Article from './models/articles';
import User from './models/users';

const DB_HOST = env.DB_HOST || "localhost";
const DB_PORT = env.PORT || 9000;
const DB_DATABASE = env.DB_DATABASE || "dev_dash";

const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

class DBStorage {
	constructor(){
		mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

		this.db = mongoose.connection;

		this.db.on('error', (err) => {
			console.error('MongoDB connection error: ', err);
		})

		this.db.once('open', () => {
			console.log('Connected to MongoDB');
		})
	};

	isAlive() {
		return Boolean(this.db);
	}

	async closeConnection() {
    await this.db.close();
    console.log('Disconnected from MongoDB');
  }

	async createDocument(model, data) {
    try {
      const newDocument = new model(data);
      await newDocument.save();
      return newDocument;
    } catch (error) {
      throw new Error('Error creating document: ' + error.message);
    }
  }

	async findDocuments(model, query) {
    try {
      const result = await model.find(query).exec();
      return result;
    } catch (error) {
      throw new Error('Error finding documents: ' + error.message);
    }
  }
}

const db_client = new DBStorage();

export default db_client;
