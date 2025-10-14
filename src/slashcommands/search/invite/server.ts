import { MessageFlags, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";

export async function execute(interaction: ChatInputCommandInteraction) {
    const server = interaction.options.getString("invite");

    if (server == null) return;

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
        const invite = await interaction.client.fetchInvite(server);

        if (invite === null || invite === undefined) {
            await interaction.followUp({
                content: `招待リンクが見つかりません。`,
                flags: MessageFlags.Ephemeral,
            });

            return;
        }

        try {
            if (invite.guild == null) {
                await interaction.followUp({
                    content: `それはサーバーの招待リンクではありません。`,
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            if (invite.inviter == null) {
                const invite_embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle('招待リンクを発見しました。')
                    .addFields(
                        { name: 'サーバー名', value: invite.guild.name, inline: false },
                        { name: 'サーバーID', value: `${invite.guild.id}`, inline: false },
                        { name: 'メンバー数', value: `${invite.memberCount}`, inline: false },
                        { name: 'オンライン数', value: `${invite.presenceCount}`, inline: false },
                        { name: '使用回数', value: `${invite.uses || 0} / ${invite.maxUses || '無限'}回`, inline: false },
                    )
                    .setThumbnail(invite.guild.iconURL());

                await interaction.followUp({
                    embeds: [invite_embed],
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            const invite_embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle('招待リンクを発見しました。')
                .addFields(
                    { name: 'サーバー名', value: invite.guild.name, inline: false },
                    { name: 'サーバーID', value: `${invite.guild.id}`, inline: false },
                    { name: '招待リンク作成者名', value: invite.inviter.username, inline: false },
                    { name: '招待リンク作成者ID', value: `${invite.inviter.id}`, inline: false },
                    { name: 'メンバー数', value: `${invite.memberCount}`, inline: false },
                    { name: 'オンライン数', value: `${invite.presenceCount}`, inline: false },
                    { name: '使用回数', value: `${invite.uses || 0} / ${invite.maxUses || '無限'}回`, inline: false },
                )
                .setThumbnail(invite.guild.iconURL());

            try {
                await interaction.followUp({
                    embeds: [invite_embed],
                    flags: MessageFlags.Ephemeral,
                });
            } catch (e) {
                await interaction.followUp({
                    content: 'エラーが発生しました。',
                    flags: MessageFlags.Ephemeral,
                });
            }
        } catch (e) {
            await interaction.followUp({
                content: `エラーが発生しました。\n${e}`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }
    } catch (e) {
        await interaction.followUp({
            content: `招待リンクが見つかりません。\n${e}`,
            flags: MessageFlags.Ephemeral,
        });
        return;
    }
}