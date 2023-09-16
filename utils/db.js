import { MongoClient } from 'mongodb';
import { env } from 'process';

const DB_HOST = env.DB_HOST || "localhost";
const DB_PORT = env.PORT || 27017;
const DB_DATABASE = env.DB_DATABASE || "dev_dash";

const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBStorage {
    constructor(){
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.client.connect((err) => {
            if(!err){
                this.db = this.client.db(DB_DATABASE);
                this.userCol = this.db.collection('users');
                this.articleCol = this.db.collection("articles");
            }
            else{
                this.db = false;
                console.log(err.message);
            }
        });
    };

    isAlive()
    {
        return Boolean(this.db);
    }

    static async getMe(email)
    {
        const user = await this.userCol.findOne({ email });
        if(user) return user;

        return null;
    }

}

const db_client = new DBStorage();

export default db_client;
