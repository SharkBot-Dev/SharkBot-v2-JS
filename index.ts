import { Client, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent],
});

await (await import('./src/load.ts')).load(client);

(async () => {
  await mongoose.connect("mongodb://localhost:27017/Main");
  console.log("MongoDB接続完了");
  await client.login(process.env.TOKEN);
})();