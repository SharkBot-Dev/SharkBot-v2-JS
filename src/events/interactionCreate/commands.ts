import { MessageFlags, ChatInputCommandInteraction, SlashCommandBuilder, Client } from "discord.js";
import { slash_commands } from "./../../temps/slashcommand.ts";

import { error_embed } from "./../../utils/embed/make_embed.ts";

type SlashCommand = {
    data: SlashCommandBuilder,
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export async function execute(interaction: ChatInputCommandInteraction, client: Client) {

    if (!interaction.isChatInputCommand()) return;

    if (!interaction.inGuild()) {
        var error_dm_embed = await error_embed('DMでコマンドは実行できません。')
        error_dm_embed.setDescription('Botの操作はDMで行えません。\nサーバー内で実行して下さい。')
        await interaction.reply({
            embeds: [error_dm_embed]
        })
        return;
    }

    const command = slash_commands.get(interaction.commandName) as SlashCommand;
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
};