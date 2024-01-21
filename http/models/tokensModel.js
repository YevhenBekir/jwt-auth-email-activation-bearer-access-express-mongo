import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tokensSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    refresh_token: {
        type: String,
        required: true
    }
});

const Tokens = mongoose.model("Tokens", tokensSchema);

export default Tokens;