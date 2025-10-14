import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { success_embed } from "./../../utils/embed/make_embed.ts";

export async function execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user") || interaction.user;

    await interaction.deferReply();

    const avatar_url = await user.avatarURL();

    const user_embed = (await success_embed("ユーザーを発見しました。")).addFields(
        { name: '基本情報', value: `
ユーザー名: ${user.username}
グローバル名: ${user.globalName}
ユーザーid: ${user.id}
タグ: ${user.tag}
アカウント作成日: ${user.createdAt}
`, inline: false }
    )
    .setThumbnail(avatar_url);

    try {
        await interaction.followUp({
            embeds: [user_embed]
        });
    } catch (e) {
        await interaction.followUp({
            content: 'エラーが発生しました。'
        });
    }
}