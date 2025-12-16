import fs from "fs";
import path from "path";
import { commands } from "./temps/command.ts";
import { fileURLToPath, pathToFileURL } from "url";
import { dynamicImport } from "./utils/import/dynamicImport.ts";

export async function load() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const foldersPath = path.join(__dirname, "commands");
    const entries = fs.readdirSync(foldersPath, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isFile() && (entry.name.endsWith(".ts"))) {
            const filePath = path.join(foldersPath, entry.name);
            const command = await dynamicImport(pathToFileURL(filePath).href);

            if ("data" in command && "execute" in command) {
                commands.set(command.data.name, command);
                console.log(`コマンド「${command.data.name}」を読み込みました。`);
            } else {
                console.warn(`${filePath} は "data" または "execute" が不足しています。`);
            }
        }
    }
}