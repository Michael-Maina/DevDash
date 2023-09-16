import db_client from "../utils/db";
import sha1 from 'sha1';


export default class UsersController {
    static async postUser(req, res){
        const { email, password } = req.body;

        if (!email){
            return res.status(400).send({error :"Missing email"});
        }
        if (!password){
            return res.status(400).send({error : "Missing password"});
        }
        if (await db_client.userCol.findOne({email}))
        {
            return res.status(404).send({error: "email already exists"})
        }
        try
        {
            const new_user = await db_client.userCol.insertOne({ email, "password": sha1(password)});
            return res.status(200).send(new_user)
        }
        catch (error)
        {
            console.log(error);
        }
    }
}
