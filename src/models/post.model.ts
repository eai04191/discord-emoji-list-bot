import { Schema, model } from "mongoose";

let schema: Schema = new Schema({
    guildId: { type: String, required: true },
    announceChannelId: String,
    postId: { type: String, required: true }
});

export default model("Post", schema);
