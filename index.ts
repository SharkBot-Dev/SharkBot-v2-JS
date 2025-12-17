import { ShardingManager } from "discord.js";

const manager = new ShardingManager("./dist/shard.js", {
  token: process.env.DISCORD_TOKEN!,
  totalShards: "auto",
  respawn: true,
  shardArgs: ["--color"],
});

manager.on("shardCreate", (shard) => {
  console.log(`[Shard ${shard.id}] 起動`);
});

await manager.spawn({
  timeout: 30_000,
});