import mongoose, { ObjectId } from 'mongoose';

export interface IProduct {
    name: string;
    category_id: number;
    price: number;
    image_src: string;
    date: Date;
    stock: number;
    description: string;
    views: number;
    id?: ObjectId;
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category_id: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image_src: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    views: {
        type: Number
    },
});

// productSchema.pre("save", function(next) {
    // const product = this;
    // if (!product.isModified("password")) {
    //     return next();
    // }
    // bcrypt.genSalt(10, function(err, salt) {
    //     if (err) {
    //         return next(err);
    //     }
    //     bcrypt.hash(product.password, salt, function(err, hash) {
    //         if (err) {
    //             return next(err);
    //         }
    //         Product.password = hash;
    //         next();
    //     });
    // })
// });

export const Product = mongoose.model("Product", productSchema);
