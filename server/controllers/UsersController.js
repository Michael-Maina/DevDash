import db_client from "../utils/db";
import sha1 from 'sha1';
import User from "../utils/models/users";


export default class UsersController {
    static async postUser(req, res){
        const { email, password } = req.body;

        if (!email){
            return res.status(400).send({error :"Missing email"});
        }
        if (!password){
            return res.status(400).send({error : "Missing password"});
        }

        const newuser = await db_client.createDocument(User, {email, password});
        console.log(newuser);

    }
}
