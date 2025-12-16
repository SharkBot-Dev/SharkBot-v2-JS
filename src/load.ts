import { Client, Events } from "discord.js";

export async function load(client: Client) {
	await (await import('./slashcommand_load.ts')).load();
	await (await import('./command_load.ts')).load();
	await (await import('./event_load.ts')).load(client);
	await (await import("./sync.ts")).load();

	client.on(Events.ShardError, (error) => {
		console.error('A websocket connection encountered an error:', error);
	});

	process.on('unhandledRejection', (error) => {
		console.error('Unhandled promise rejection:', error);
	});
}