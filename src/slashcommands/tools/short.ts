import { Colors, ChatInputCommandInteraction, PermissionFlagsBits, MessageFlags } from "discord.js";
import { success_embed, error_embed } from "./../../utils/embed/make_embed.js";
import { isUrl } from "./../../utils/is_url.js";

export async function execute(interaction: ChatInputCommandInteraction) {
    if (interaction.member == null) return;

    const sites = interaction.options.getString("使用するサイト", true);
    const url = interaction.options.getString("url", true);

    await interaction.deferReply({flags: MessageFlags.Ephemeral});

    try {
        if (!isUrl(url)) {
            const embed = await error_embed("URLを指定してください。");
            embed.setDescription(`短縮にはURLを指定する必要があります。`);

            await interaction.editReply({
                embeds: [embed],
            })

            return;
        }

        if (sites == "shb") {
            const data = await fetch(`https://shb.red/shorten?url=${encodeURI(url)}`)
                .then(res=>res.json());

            const embed = await success_embed("URLを短縮しました。");
            embed.setDescription(`${data.short_url}`);

            await interaction.editReply({
                embeds: [embed],
            })
        } else if (sites == "is") {
            const data = await fetch(`https://is.gd/create.php?format=json&url=${encodeURI(url)}`)
                .then(res=>res.json());

            const embed = await success_embed("URLを短縮しました。");
            embed.setDescription(`${data.shorturl}`);

            await interaction.editReply({
                embeds: [embed],
            })
        } else {
            const data = await fetch(`https://shb.red/shorten?url=${encodeURI(url)}`)
                .then(res=>res.json());

            const embed = await success_embed("URLを短縮しました。");
            embed.setDescription(`${data.short_url}`);

            await interaction.editReply({
                embeds: [embed],
            })
        }
    } catch {
        return;
    }
}