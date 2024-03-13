import { REST, Routes } from 'discord.js'
import * as fs from 'fs/promises'
import * as path from 'path'
import type { SlashCommandBuilder } from 'discord.js'
import * as dotenv from 'dotenv'
import type { CustomClient } from '../../typings'

dotenv.config()
const { DISCORD_CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = process.env

interface Command {
  data?: SlashCommandBuilder
  execute?: (interaction: any) => Promise<void>
}

export const execute = async function main (client: CustomClient): Promise<void> {
  if (DISCORD_CLIENT_ID === undefined || GUILD_ID === undefined || DISCORD_TOKEN === undefined) {
    console.error('Missing env variables')
    return
  }

  const commands: object[] = []
  const commandDir = await fs.readdir(path.join(__dirname, '..', '..', 'commands'))

  for (const dir of commandDir) {
    const command: Command = await import(path.join(__dirname, '..', '..', 'commands', dir, 'index'))
    if (command.data === undefined || command.execute === undefined) {
      console.warn(`Command ${dir} doesnt have data or execute`)
      return
    }

    commands.push(command.data.toJSON())
    client.commands?.set(command.data.name, command.execute)
  }

  const rest = new REST().setToken(DISCORD_TOKEN)
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, GUILD_ID),
      { body: commands }
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}