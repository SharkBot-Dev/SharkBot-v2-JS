import { EmbedBuilder, ChatInputCommandInteraction, Presence } from "discord.js";
import { success_embed } from "./../../utils/embed/make_embed.js";
import bool_to_string from "./../../utils/bool_to_string.js";

const status = {
    "online": "🟢オンライン",
    "offline": "⚫オフライン",
    "dnd": "⛔取り込み中",
    "idle": "🌙退席中"
}

function platform(presence: Presence) {
	if(presence?.clientStatus?.web){
		return "🌐 Web";
	}else if(presence?.clientStatus?.mobile){
		return "📱 スマホ";
	}else if(presence?.clientStatus?.desktop){
		return "🖥️ PC";
	}
}

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
Botか: ${bool_to_string(user.bot)}
`, inline: false }
    )
    .setThumbnail(avatar_url);

    const member = interaction.guild?.members.cache.get(user.id);

    if (member && member.presence?.status) {
        const status_text = status[member.presence.status as keyof typeof status]

        user_embed.addFields({
            name: "ステータス情報",
            value: `
ステータス: ${status_text}
機種: ${platform(member.presence)}
`
        })

        user_embed.addFields({
            name: "ロール",
            value: member.roles.cache.toJSON().join("")
        })
    }

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