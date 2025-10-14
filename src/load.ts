import { Client } from "discord.js";

export async function load(client: Client) {
	await (await import('./slashcommand_load.ts')).load();
	await (await import('./event_load.ts')).load(client);
	await (await import("./sync.ts")).load();
}