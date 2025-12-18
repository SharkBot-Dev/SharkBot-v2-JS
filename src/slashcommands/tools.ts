import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export var data = new SlashCommandBuilder()
	.setName('tools')
	.setDescription('様々なツールを使用します。')
    .addSubcommand(command =>
        command
            .setName('short')
            .setDescription('URLを短縮します。')
            .addStringOption(option =>
                option
                    .setName('使用するサイト')
                    .setDescription('短縮urlに使用するサイトを選択')
                    .setRequired(true)
                    .addChoices(
                        { name: 'shb.red', value: 'shb' },
                        { name: 'is.gd', value: 'is' }
                    )
            )
            .addStringOption(option => option.setName("url").setDescription("URLを入力").setRequired(true))
    );

export async function execute(interaction: ChatInputCommandInteraction) {
	const group = interaction.options.getSubcommandGroup();

	const sub = interaction.options.getSubcommand();

    if (!group) {
        try {
            const commandPath = `./${interaction.commandName}/${sub}.js`;
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
		const commandPath = `./${interaction.commandName}/${group}/${sub}.js`;
		const subCommand = await import(commandPath);

		if (subCommand.execute) {
			await subCommand.execute(interaction);
		}
	} catch (error) {
		console.error(error);
	}
}