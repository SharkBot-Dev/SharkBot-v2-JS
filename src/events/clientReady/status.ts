import { ActivityType, Client } from "discord.js";

export async function execute(client: Client) {
    await client.user?.setActivity(`TypeScriptのBot`, {type: ActivityType.Playing})
}