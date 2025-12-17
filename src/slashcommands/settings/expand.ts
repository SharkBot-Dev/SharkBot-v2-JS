import { Colors, ChatInputCommandInteraction, PermissionFlagsBits, MessageFlags } from "discord.js";
import { success_embed, error_embed } from "./../../utils/embed/make_embed.js";
import { mongo } from "../../temps/mongodb.js";
import { Long } from "mongodb";

export async function execute(interaction: ChatInputCommandInteraction) {
    if (interaction.member == null) return;

    const enabled = interaction.options.getBoolean("有効化するか", true);
    const outside = interaction.options.getBoolean("外部からの展開を許可するか", false);

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

    const db = mongo.db("Main");

    if (enabled) {
        await db.collection("ExpandSettings").updateOne(
            { Guild: guildId },
            { $set: { Guild: guildId, Enabled: enabled, Outside: outside } },
            { upsert: true }
        );
        const embed = await success_embed("メッセージ展開を有効化しました。")
        await interaction.reply({ embeds: [embed] });
    } else {
        await db.collection("ExpandSettings").updateOne(
            { Guild: guildId },
            { $set: { Guild: guildId, Enabled: enabled, Outside: outside } },
            { upsert: true }
        );

        const embed = await success_embed("メッセージ展開を無効化しました。")

        await interaction.reply({ embeds: [embed] });
    }
}