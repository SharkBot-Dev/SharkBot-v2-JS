import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export var data = new SlashCommandBuilder()
	.setName('search')
	.setDescription('様々な検索をします。')
	.addSubcommandGroup(group =>
		group
			.setName('invite')
			.setDescription('招待リンクを検索します。')
			.addSubcommand(sub => sub.setName('server').setDescription('サーバーの招待リンクを検索します。').addStringOption((option) => option.setName('invite').setRequired(true).setDescription('サーバーの招待リンクurlを入力')))
	)
    .addSubcommand(command =>
        command
            .setName('user')
            .setDescription('ユーザーを検索します。')
            .addUserOption((option) => option.setName('user').setDescription('ユーザーidを入力'))
    ).addSubcommand(command =>
        command
            .setName('server')
            .setDescription('サーバーの情報を表示します。')
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