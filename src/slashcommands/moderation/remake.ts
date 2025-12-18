import { MessageFlags, PermissionFlagsBits, EmbedBuilder, ChatInputCommandInteraction, Colors } from "discord.js";
import { success_embed, error_embed } from "./../../utils/embed/make_embed.js";

import { sleep } from "./../../utils/sleep.js";

export async function execute(interaction: ChatInputCommandInteraction) {
    if (interaction.member == null) return;
    if (interaction.channel == null) return;

    if (
        typeof interaction.member.permissions !== "string" &&
        interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) === false
    ) {
        return await interaction.reply({
            embeds: [((await error_embed("あなたに権限がありません。")).setDescription("必要な権限: チャンネルの管理"))],
            flags: [MessageFlags.Ephemeral]
        });
    }

    await interaction.deferReply();

    try {
        if (interaction.channel.isDMBased()) return;
        if (interaction.channel.isThread()) return;

        const channel = await interaction.channel.clone();

        sleep(1000);

        await channel.edit({
            position: interaction.channel.position
        })

        sleep(1000);

        await interaction.channel?.delete()

        const embed = await success_embed("チャンネルを再生成しました。");
        embed.setDescription(`実行者: <@${interaction.user.id}>`)

        await channel.send({
            embeds: [embed]
        })
    } catch (e) {
        return;
    }
}