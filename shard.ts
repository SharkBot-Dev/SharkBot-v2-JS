import { Client, GatewayIntentBits } from "discord.js";
import { connect } from "./src/temps/mongodb.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent],
});

await (await import('./src/load.js')).load(client);

(async () => {
  await connect();
  console.log("MongoDB接続完了");
  await client.login(process.env.TOKEN);
})();