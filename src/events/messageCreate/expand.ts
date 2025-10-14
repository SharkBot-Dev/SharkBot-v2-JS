import { Client, EmbedBuilder, Message, TextChannel, ThreadChannel } from "discord.js";
import { ExpandSettings } from "../../models/expand.ts";

const COOLDOWN_TIME_EXPAND = 5;
const cooldownExpandTime: Record<string, number> = {};

const URL_REGEX =
  /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/g;

export async function execute(message: Message, client: Client) {
  if (message.author.bot) return;
  if (!message.content) return;
  if (message.channel.isDMBased()) return;

  const guildId = Number(message.guild?.id);
  if (!guildId) return;

  const dbfind = await ExpandSettings.findOne({ Guild: guildId }).lean();
  if (!dbfind) return;

  const currentTime = Date.now() / 1000;
  const lastTime = cooldownExpandTime[guildId] ?? 0;
  if (currentTime - lastTime < COOLDOWN_TIME_EXPAND) return;
  cooldownExpandTime[guildId] = currentTime;

  const urls = [...message.content.matchAll(URL_REGEX)];
  if (!urls.length) return;

  for (const match of urls) {
    const [, guild_id, channel_id, message_id] = match;

    const guild = client.guilds.cache.get(guild_id);
    if (!guild) continue;

    const channel = await guild.channels.fetch(channel_id).catch(() => null);
    if (!channel) continue;

    if (!(channel instanceof ThreadChannel)) {
      if ("nsfw" in channel && channel.nsfw) {
        if (!("nsfw" in message.channel) || !message.channel.nsfw) {
          await message.react("❌");
          return;
        }
      }
    }

    try {
      const targetMsg = await (channel as TextChannel).messages.fetch(
        message_id
      );

      const embed = new EmbedBuilder()
        .setDescription(
          targetMsg.content
            ? targetMsg.content.slice(0, 1500)
            : "[メッセージなし]"
        )
        .setColor("Green")
        .setTimestamp(targetMsg.createdAt)
        .setAuthor({
          name: targetMsg.author.displayName,
          iconURL:
            targetMsg.author.avatarURL() ??
            targetMsg.author.defaultAvatarURL,
          url: `https://discord.com/users/${targetMsg.author.id}`,
        })
        .addFields({
          name: "元のメッセージ",
          value: `[リンクを開く](${targetMsg.url})`,
          inline: false,
        })
        .setFooter({
          text: `${targetMsg.guild?.name} | ${(targetMsg.channel as TextChannel).name}`,
          iconURL: targetMsg.guild?.iconURL() ?? undefined,
        });

      const embeds = [embed];

      if (targetMsg.embeds.length > 0) {
        embeds.push(new EmbedBuilder(targetMsg.embeds[0].toJSON()));
      }

      await message.channel.send({ embeds });
      return;
    } catch (err) {
      await message.react("❌");
      return;
    }
  }
}