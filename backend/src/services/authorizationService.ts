import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization!.split(" ")[1];
        const decode = jwt.verify(token, config.SECRET);
        req.body.user = decode;
        next();
    } catch (error) {
        return ResponseHelper.response({
            res,
            code: 401,
            success: false,
            message: "Invalid request!",
            data: {}
        });
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
        return ResponseHelper.response({
            res,
            code: 403,
            success: false,
            message: "You don't have permission!",
            data: {}
        });
    }
};
