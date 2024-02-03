import {Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import {User, IUser, IUserLogin} from "../models/User";

export const register = async(req: Request, res: Response) => {
    const { user_name, email, password, role }: IUser = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({message: "Failed validation", errors: errors.array()});
            return
        }
        const userObj = new User({ user_name, email, password, role });

        await userObj.save();
        res.status(201).send({message: "User registered successfully."});
    } catch(error) {
        res.status(401).send({message: error});
        return;
    }
}

export const login = async(req: Request, res: Response) => {
    const { email, password }: IUserLogin = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ message: "Failed validation", errors: errors.array() });
            return;
        }
        console.log("1");
        const user = await User.findOne({ email });
        console.log("2");

        if (!user) {
            res.status(404).send({ message: "Email invalid." });
            return;
        }
        console.log("3");
        user.comparePassword(password, async (err: any, isMatch: boolean) => {
            if (err || !isMatch) {
                res.status(400).send({ message: "Password invalid." });
                return;
            }
            console.log("4");
            const token = jwt.sign({id: user._id, role: user.role}, process.env["SECRET"] as string);
            console.log("5");
            res.status(200).send({ message: "Password valid.",
                                               token: token,
                                               user_name: user?.user_name,
                                               role: user?.role } );
        });
    } catch (error) {
        res.status(401).send({ error: error });
        return;
    }
};

export const profile = async (req: Request, res: Response) => {
    const { id } = req.body.user;
    try {
        const user = await User.findOne({ _id: id });

        if (!user) {
            res.status(404).send({ message: "User not found."} );
            return;
        }
        res.status(200).send({ message: "User found.", user: user });
    } catch (error) {
        res.status(401).send({ error: error });
        return;
    }
};
