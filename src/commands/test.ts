import { Message, Client } from "discord.js";
import { reply } from "../utils/message/reply.ts";

export var data = {
    name: "test",
}

export async function execute(message: Message, args: string[], client: Client) {
    await reply(message, "これは隠しコマンドだよ・・？");
}