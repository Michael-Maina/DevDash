import UsersController from "../controllers/UsersController";
const express = require("express");

const router = express.Router();

router.post("/newuser", UsersController.postUser);


export default router;
