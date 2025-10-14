import { Colors, ChatInputCommandInteraction, PermissionFlagsBits, MessageFlags } from "discord.js";
import { success_embed, error_embed } from "./../../utils/embed/make_embed.ts";
import { ExpandSettings } from "../../models/expand.ts";

export async function execute(interaction: ChatInputCommandInteraction) {
    if (interaction.member == null) return;

    const enabled = interaction.options.getBoolean("有効化するか", true);

    const guildId = Number(interaction.guildId);

    if (
        typeof interaction.member.permissions !== "string" &&
        interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) === false
    ) {
        return await interaction.reply({
            embeds: [(await error_embed("このコマンドの実行にはメッセージの管理権限が必要です。"))],
            flags: MessageFlags.Ephemeral,
        });
    }

    if (enabled) {
        await ExpandSettings.updateOne(
            { Guild: guildId },
            { $set: { Guild: guildId } },
            { upsert: true }
        );
        const embed = await success_embed("メッセージ展開を有効化しました。")
        await interaction.reply({ embeds: [embed] });
    } else {
        const result = await ExpandSettings.deleteOne({ Guild: guildId });

        if (result.deletedCount === 0) {
            const embed = await error_embed("メッセージ展開は無効です。")
            return await interaction.reply({ embeds: [embed] });
        }

        const embed = await success_embed("メッセージ展開を無効化しました。")

        await interaction.reply({ embeds: [embed] });
    }
}