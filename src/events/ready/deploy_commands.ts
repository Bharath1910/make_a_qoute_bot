import { REST, Routes } from 'discord.js'
import * as fs from 'fs/promises'
import * as path from 'path'
import type { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js'
import * as dotenv from 'dotenv'
import type { CustomClient } from '../../typings'

dotenv.config()
const { DISCORD_CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = process.env

interface Command {
  data?: SlashCommandBuilder
  execute?: (interaction: any) => Promise<void>
}

interface Subcommand {
  data?: SlashCommandSubcommandBuilder
  execute?: (interaction: any) => Promise<void>
}

export const execute = async function main (client: CustomClient): Promise<void> {
  if (
    DISCORD_CLIENT_ID === undefined 
    || GUILD_ID === undefined 
    || DISCORD_TOKEN === undefined
  ) {
    console.error('Missing env variables')
    return
  }

  const commands: object[] = []
  const commandDir = await fs.readdir(path.join(
    __dirname, '..', '..', 'commands'
  ))

  for (const dir of commandDir) {
    const subcommands: SlashCommandSubcommandBuilder[] = []
    try {
      await fs.access(path.join(__dirname, '..', '..', 'commands', dir, 'subcommands'))

      const subCommandDir = await fs.readdir(path.join(
        __dirname, '..', '..', 'commands', dir, 'subcommands'
      ))

      for (const subcommand of subCommandDir) {
        if (subcommand === 'index.ts' || subcommand === 'index.js') continue
        const command: Subcommand = await import(path.join(__dirname, '..', '..', 'commands', dir, 'subcommands', subcommand))
        if (command.data === undefined || command.execute === undefined) {
          console.warn(`Command ${subcommand} doesnt have data or execute`)
          return
        }

        subcommands.push(command.data)
      }
    } catch (err) {
      console.warn(`Command ${dir} doesnt have subcommands`)
    }

    const command: Command = await import(path.join(__dirname, '..', '..', 'commands', dir, 'index'))
    if (command.data === undefined || command.execute === undefined) {
      console.warn(`Command ${dir} doesnt have data or execute`)
      return
    }

    if (subcommands.length > 0) {
      for (const subcommand of subcommands) {
        command.data.addSubcommand(subcommand)
      }
    }

    commands.push(command.data.toJSON())
    client.commands?.set(command.data.name, command.execute)
  }

  const rest = new REST().setToken(DISCORD_TOKEN)
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      Routes.applicationGuildCommands(
        DISCORD_CLIENT_ID,
        GUILD_ID
      ),
      { body: commands }
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}