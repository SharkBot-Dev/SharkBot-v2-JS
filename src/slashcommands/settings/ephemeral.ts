import { Colors, ChatInputCommandInteraction, PermissionFlagsBits, MessageFlags } from "discord.js";
import { success_embed, error_embed } from "./../../utils/embed/make_embed.ts";
import { mongo } from "../../temps/mongodb.ts";
import { Long } from "mongodb";

export async function execute(interaction: ChatInputCommandInteraction) {
    if (interaction.member == null) return;

    const enabled = interaction.options.getBoolean("有効化するか", true);

    const guildId = new Long(interaction.guildId as string);

    if (
        typeof interaction.member.permissions !== "string" &&
        interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) === false
    ) {
        return await interaction.reply({
            embeds: [(await error_embed("このコマンドの実行にはメッセージの管理権限が必要です。"))],
            flags: MessageFlags.Ephemeral,
        });
    }

    const db = mongo.db("MainTwo");
    const collection = db.collection("EphemeralSetting");

    if (enabled) {
        await collection.updateOne(
            { Guild: guildId },
            { $set: { Guild: guildId } },
            { upsert: true }
        );
        const embed = await success_embed("コマンド実行時に実行者にしか見えなくしました。")
        await interaction.reply({ embeds: [embed] });
    } else {
        const result = await collection.deleteOne({ Guild: guildId });

        if (result.deletedCount === 0) {
            const embed = await error_embed("実行者にしか見えなくする機能は無効です。")
            return await interaction.reply({ embeds: [embed] });
        }

        const embed = await success_embed("実行者以外も見えるようにしました。")

        await interaction.reply({ embeds: [embed] });
    }
}