import { Message, Client } from "discord.js";

export var data = {
    name: "test",
}

export async function execute(message: Message, args: string[], client: Client) {
    await message.reply("これは隠しコマンドだよ・・？");
}