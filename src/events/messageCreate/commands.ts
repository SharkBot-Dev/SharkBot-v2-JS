import { Client, Collection, Message } from "discord.js";
import { commands, commands_cooldown } from "./../../temps/command.ts";
import { error_embed } from "./../../utils/embed/make_embed.ts";

export async function execute(message: Message, client: Client) {
    if (message.author.bot) return;
    if (!message.content) return;
    if (message.channel.isDMBased()) return;

    try {
        if (!message.content.startsWith("!.")) {
            return;
        }

        const args = message.content.slice("!.".length).trim().split(/ +/);

        const commandName = args.shift()?.toLowerCase();

        const command = commands.get(commandName) as any;
        if (!command) {
            return;
        }

        // クールダウン
        if (!commands_cooldown.has(command.data.name)) {
            commands_cooldown.set(command.data.name, new Collection());
        }
        const now = Date.now();
        const timestamps = commands_cooldown.get(command.data.name) as Collection<string, number>;
        const defaultCooldownDuration = 3;
        const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) as any + cooldownAmount;
            if (now < expirationTime) {
                return;
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
            var error_dm_embed = await error_embed('エラーが発生しました。')
            error_dm_embed.setDescription('サポートサーバーにご連絡ください。')
            await message.reply({
                embeds: [error_dm_embed]
            });
        }
    } catch {
        return;
    }
}