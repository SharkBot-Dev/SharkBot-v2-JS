import { Client, Events } from "discord.js";

export async function load(client: Client) {
	await (await import('./slashcommand_load.js')).load();
	await (await import('./command_load.js')).load();
	await (await import('./event_load.js')).load(client);
	await (await import("./sync.js")).load();

	client.on(Events.ShardError, (error) => {
		console.error('A websocket connection encountered an error:', error);
	});

	process.on('unhandledRejection', (error) => {
		console.error('Unhandled promise rejection:', error);
	});
}