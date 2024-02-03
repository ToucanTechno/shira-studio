import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.headers)
    try {
        if (!req.headers.authorization) {
            throw new Error("Missing authorization field");
        }
        // User expected to use authorization header: "Bearer <token>"
        if (!process.env["SECRET"]) {
            throw new Error("Invalid environment");
        }
        const token = req.headers.authorization.split(" ")[1];
        req.body.user = jwt.verify(token as string,
                                   process.env["SECRET"],
            { subject: 'TODO' });
        next();
    } catch (error) {
        res.status(401).send({message: "Failed to authorize"});
        return;
    }
};

export const adminAuthorize = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { role } = req.body.user;
        if (role !== "admin") {
            throw new Error();
        }
        next();
    } catch (error) {
        res.status(403).send({message: "Unauthorized"});
        return;
    }
};
