import { Message, MessagePayload } from "discord.js";
import type { MessageReplyOptions } from 'discord.js';
import { mongo } from "../../temps/mongodb.js";
import { Long } from "mongodb";

export async function reply(message: Message, payload: string | MessagePayload | MessageReplyOptions) {
    const db = mongo.db("MainTwo");
    const collection = db.collection("EphemeralSetting");

    const setting_find = await collection.findOne({
        Guild: new Long(message.guildId as string)
    })

    if (!setting_find) {
        const msg = await message.reply(payload);
        return msg;
    }

    try {
        const msg = await message.author.send(payload);
        return msg;
    } catch {
        await message.react("❌");
        return;
    }
}