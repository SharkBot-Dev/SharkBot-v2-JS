import { MessageFlags, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Colors } from "discord.js";

export async function execute(interaction: ChatInputCommandInteraction) {
    if (interaction.member == null) return;
    if (interaction.channel == null) return;

    const count = interaction.options.getNumber("count", true);

    if (
        typeof interaction.member.permissions !== "string" &&
        interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) === false
    ) {
        return await interaction.reply({
            embeds: [new EmbedBuilder().setTitle('このコマンドの実行にはチャンネルの管理権限が必要です。').setColor(Colors.Red)]
        });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
        const messages = (await interaction.channel.messages.fetch({ limit: 100 }))
        .first(count);

        if (!messages[0]) {
            await interaction.followUp({
                content: 'メッセージが1件もないため、削除できません。',
                flags: MessageFlags.Ephemeral,
            });

            return;
        }

        if (interaction.channel.isTextBased()) {
            await (interaction.channel as import("discord.js").TextChannel).bulkDelete(messages);
        } else {
            await interaction.followUp({
                content: 'このコマンドはテキストチャンネル・ボイスチャンネル・スレッドでのみ使用できます。',
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        await interaction.followUp({
            content: 'メッセージを削除しました。',
            flags: MessageFlags.Ephemeral,
        });
    } catch (e) {
        await interaction.followUp({
            content: 'メッセージ削除に失敗しました。\n2週間以上前のメッセージは削除できません。',
            flags: MessageFlags.Ephemeral,
        });
    }
}