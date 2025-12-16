import { Message, Client } from "discord.js";

import { commands } from "./../temps/command.ts";
import { dynamicImport } from "../utils/import/dynamicImport.ts";

export var data = {
    name: "command_reload",
}

export async function execute(message: Message, args: string[], client: Client) {
    if (message.author?.id != process.env.OWNER_ID) {
        return;
    }

    try {
        const commandPath = `./../../commands/${args[0]}.ts`;

        if (commands.has(args[0])) {
            commands.delete(args[0]);
        }

        const uniquePath = `${commandPath}`;
        
        const newCommandModule = await dynamicImport(uniquePath);
        
        const newCommand = newCommandModule;
        commands.set(args[0], newCommand);

        await message.reply({ content: `コマンド **${args[0]}** をリロードしました。`});

    } catch (error) {
        console.error(`コマンドのリロード中にエラーが発生しました:`, error);
        await message.reply({ content: `コマンドのリロードに失敗しました。` });
    }
}