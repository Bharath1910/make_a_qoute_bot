import { ActivityType, Client, Collection, GatewayIntentBits } from 'discord.js'
import * as dotenv from 'dotenv'
import { loadEvents } from './events/index'
import type { CustomClient } from './typings'

async function main (): Promise<void> {
  dotenv.config()
  const client: CustomClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  })

  client.commands = new Collection()

  const { DISCORD_TOKEN } = process.env

  await loadEvents(client)
  await client.login(DISCORD_TOKEN)
}

main().catch((err) => {
  console.error(err)
})