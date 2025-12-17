import { EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { success_embed } from "./../../utils/embed/make_embed.js";

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    if (!interaction.inGuild()) return;
    if (interaction.guild == null) return;

    try {
        const members = await interaction.guild.members.fetch();

        const online = members.filter(member=>member.presence?.status === "online");
        const dnd = members.filter(member=>member.presence?.status === "dnd");
        const idle = members.filter(member=>member.presence?.status === "idle");
        const offline = members.filter(member=>member.presence?.status === "offline"||!member.presence?.status);

        const web = members.filter(member=>member.presence?.clientStatus?.web);
        const mobile = members.filter(member=>member.presence?.clientStatus?.mobile);
        const desktop = members.filter(member=>member.presence?.clientStatus?.desktop);

        const server_embed = (await success_embed("サーバーの情報を取得しました。")).addFields(
            {name: "サーバー名", value: interaction.guild.name, inline: true},
            {name: "サーバーID", value: interaction.guild.id, inline: true},
            {name: "オーナー", value: `<@${interaction.guild.ownerId}>`, inline: true},
            {name: "メンバー数", value: `${interaction.guild.memberCount}人`, inline: true},
            {name: "チャンネル数", value: `${interaction.guild.channels.cache.size}個`, inline: true},
            {name: "ロール数", value: `${interaction.guild.roles.cache.size}個`, inline: true},
            {name: "ブースト回数", value: `${interaction.guild.premiumSubscriptionCount}個`, inline: true},
            {name: "作成日", value: `${interaction.guild.createdAt}`, inline: true},
            {name: "メンバーのステータス", value: `🟢: ${online.size}人 ⛔: ${dnd.size}人 🌙: ${idle.size}人 ⚫: ${offline.size}人\n🌐: ${web.size}人 📱: ${mobile.size}人 🖥️: ${desktop.size}人`, inline: false},
        ).setThumbnail(interaction.guild.iconURL())

        await interaction.followUp({
            embeds: [server_embed]
        });
    } catch (e) {
        await interaction.followUp({
            content: 'エラーが発生しました。'
        });
    }
}