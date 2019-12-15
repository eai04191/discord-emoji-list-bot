import { Client, TextChannel, NewsChannel } from "discord.js";
import { Mongoose, Schema } from "mongoose";
import Model from "./models/post.model";

require("dotenv").config();

// DB
const mongoose = new Mongoose();
mongoose.connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});
mongoose.connection.on("error", err => {
    console.error("MongoDB connection error: " + err);
    process.exit(-1);
});

// Discord.js
const client = new Client();

client.on("ready", () => {
    console.log("I am ready!");
    client.user
        .setActivity("Mention me to help")
        .then(presence =>
            console.log(
                `Activity set to ${presence.game ? presence.game.name : "none"}`
            )
        )
        .catch(console.error);
});

client.on("message", async message => {
    if (message.isMentioned(client.user) && message.content.includes("ping")) {
        console.log("Received ping. then reply pong.");
        message.reply("pong");
    } else if (message.isMentioned(client.user)) {
        await Model.create({ guildId: 1, announceChannelId: 2, postId: 3 });
        const data = await Model.find({ guildId: message.guild.id });
        console.log(data);
        message.reply("pong");
    }
});

client.on("emojiCreate", emoji => {
    console.log("new emoji arrived");
    // 投稿するチャンネルを決める
    // DBにあればそれを使う
    const findResult = Model.find({ guildId: emoji.guild.id }).exec();
    console.log(findResult);

    const announceChannel = emoji.guild.channels.find(
        channel =>
            channel.name === "announcements" &&
            ["text", "news"].includes(channel.type)
    );
    if (!announceChannel) {
        console.log("announcements channel was not found.");
        return;
    }

    if (
        announceChannel instanceof TextChannel ||
        announceChannel instanceof NewsChannel
    ) {
        announceChannel.send(`new emoji arrived: ${emoji} ${emoji.name}`);
    }
});

client.login(process.env.DISCORD_TOKEN);
