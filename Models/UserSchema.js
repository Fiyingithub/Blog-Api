import mongoose from "mongoose";
import { Schema } from "mongoose";
import { v4 as uuid } from "uuid";


const userSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        default: uuid
    },
    firstname: {
        type: String,
        require: [true,'Firstname is required'],
        trim: true,
    },
    lastname: {
        type: String,
        require: [true,'Lastname is required'],
        trim: true
    },
    emailAddress: {
        type: String,
        require: [true,'Email Address is required'],
        unique: true
    },
    password: {
        type: String,
        require: [true, "Password Field is required"]
    }
})

const User = mongoose.model('user', userSchema)

export default User;