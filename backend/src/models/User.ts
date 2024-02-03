import mongoose from "mongoose"
import bcrypt from "bcrypt"

export interface IUser {
    user_name: string;
    email: string;
    password: string;
    role: "admin" | "user" | undefined;
}

export interface IUserLogin {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        match: /\w+\@\w+\.\w+/,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
}, {
    methods: {
        comparePassword(candidatePassword: string, cb: (arg: any, isMatch: boolean) => void) {
            bcrypt.compare(candidatePassword, this["password"], function(err, isMatch) {
                cb(err, isMatch);
            });
        }
    }
});

userSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    })
});

export const User = mongoose.model("User", userSchema);
