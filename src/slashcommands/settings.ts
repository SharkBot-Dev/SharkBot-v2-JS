import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export var data = new SlashCommandBuilder()
	.setName('settings')
	.setDescription('Botの設定をします。')
    .addSubcommand(command =>
        command
            .setName('expand')
            .setDescription('メッセージURL展開を設定します。')
            .addBooleanOption((option) => option.setName('有効化するか').setDescription('有効化するかを選択').setRequired(true))
            .addBooleanOption((option) => option.setName('外部からの展開を許可するか').setDescription('外部からの展開を許可するかを選択').setRequired(true))
    )
    .addSubcommand(command =>
        command
            .setName('ephemeral')
            .setDescription('コマンド結果を実行者のみに表示されるように設定します。')
            .addBooleanOption((option) => option.setName('有効化するか').setDescription('有効化するかを選択').setRequired(true))
    );

export async function execute(interaction: ChatInputCommandInteraction) {
	const group = interaction.options.getSubcommandGroup();

	const sub = interaction.options.getSubcommand();

    if (!group) {
        try {
            const commandPath = `./${interaction.commandName}/${sub}.ts`;
            const subCommand = await import(commandPath);

            if (subCommand.execute) {
                await subCommand.execute(interaction);
            }
        } catch (error) {
            console.error(error);
        }
        return;
    }

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