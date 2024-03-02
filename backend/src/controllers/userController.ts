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

/**
 * Gives client a token if email and password match DB.
 * TODO: remove errors so that client is not aware of what happens in backend
 * @param req: contains email and password as a json POST request.
 * @param res: Wrong email/password, error 404 with a corresponding message.
 *             Failed validation at server side, error 400 with a corresponding message.
 *             Any other failure, error 401 with error message.
 *             On success, status 200 with corresponding message and token valid for 7days.
 */
export const login = async(req: Request, res: Response) => {
    const { email, password }: IUserLogin = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({ message: "Failed validation", errors: errors.array() });
            return;
        }
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).send({ message: "Email invalid." });
            return;
        }
        user.comparePassword(password, async (err: any, isMatch: boolean) => {
            if (err || !isMatch) {
                res.status(404).send({ message: "Password invalid." });
                return;
            }
            if (!process.env["SECRET"]) {
                throw new Error("Invalid environment");
            }
            // TODO: update jwt subject
            const token = jwt.sign({ id: user._id, role: user.role },
                process.env["SECRET"],
                { expiresIn: '7d', subject: 'TODO' });
            if (req.query["admin"] && user.role !== 'admin') {
                res.status(401).send({message: "Unauthorized"});
                return;
            }
            res.status(200).send({ message: "Password valid.",
                                               token: token } );
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
