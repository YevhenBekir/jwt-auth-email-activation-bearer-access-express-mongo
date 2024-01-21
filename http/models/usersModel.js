import mongoose from "mongoose";

const Schema = mongoose.Schema;

const usersSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_activated: {
        type: Boolean,
        default: false
    },
    activation_link: {
        type: String
    }
});

const Users = mongoose.model("Users", usersSchema);

export default Users;