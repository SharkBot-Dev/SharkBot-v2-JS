import { Client} from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

export async function load(client: Client) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const eventsPath = path.join(__dirname, 'events');
    const eventFolders = fs.readdirSync(eventsPath);

    for (const folder of eventFolders) {
        const folderPath = path.join(eventsPath, folder);
        if (!fs.lstatSync(folderPath).isDirectory()) continue;

        const eventFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.ts'));
        const eventName = folder;

        for (const file of eventFiles) {
            const filePath = path.join(folderPath, file);
            const event = await import(pathToFileURL(filePath).href);

            if (typeof event !== 'function' && typeof event.execute !== 'function') {
                console.warn(`${file} は有効なイベント関数をエクスポートしていません`);
                continue;
            }

            const handler = typeof event === 'function' ? event : event.execute;
            const once = event.once ?? false;

            if (once) {
                client.once(eventName, (...args) => handler(...args, client));
            } else {
                client.on(eventName, (...args) => handler(...args, client));
            }

            console.log(`イベント '${eventName}' を読み込みました (${file})`);
        }
    }
}