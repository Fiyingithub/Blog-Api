import mongoose from "mongoose";
import { Schema } from "mongoose";
// import { v4 as uuid } from "uuid";


const userSchema = new Schema({
    firstname: {
        type: String,
        required: [true,'Firstname is required'],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true,'Lastname is required'],
        trim: true
    },
    emailAddress: {
        type: String,
        required: [true,'Email Address is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password Field is required"]
    }
})

const User = mongoose.model('user', userSchema)

export default User;