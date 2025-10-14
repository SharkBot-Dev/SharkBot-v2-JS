import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export var data = new SlashCommandBuilder().setName('moderation')
	.setDescription('サーバー管理者向け機能です。')
	.addSubcommandGroup(group =>
		group
			.setName('clear')
			.setDescription('このチャンネルのメッセージを一括削除します。')
			.addSubcommand(sub => sub.setName('clear').setDescription('通常の一括削除コマンドです。').addNumberOption((option) => option.setName('count').setMaxValue(100).setMinValue(1).setRequired(true).setDescription('削除する個数')))
    );

export async function execute(interaction: ChatInputCommandInteraction) {
	const group = interaction.options.getSubcommandGroup();

	const sub = interaction.options.getSubcommand();

	try {
		const commandPath = `./${interaction.commandName}/${group}/${sub}.ts`;
		const subCommand = await import(commandPath);

		if (subCommand.execute) {
			await subCommand.execute(interaction);
		}
	} catch (error) {
		console.error(error);
	}
}