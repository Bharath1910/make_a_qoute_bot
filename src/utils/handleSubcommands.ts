import { ChatInputCommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { CustomClient } from "../typings";
import * as fs from 'fs/promises'
import * as path from 'path'

interface Command {
	data: SlashCommandBuilder
	execute: (client: CustomClient, interaction: Interaction) => Promise<void>
}
const cache = new Map<string, Command>()

export async function handleSubCommands(
	client: CustomClient,
	interaction: ChatInputCommandInteraction,
	commandPath: string
): Promise<void> {
	commandPath = path.join(commandPath, 'subcommands')
	if (cache.has(`${interaction.guildId}.${interaction.options.getSubcommand()}`)) {
		const command = cache.get(`${interaction.guildId}.${interaction.options.getSubcommand()}`) as Command
		command.execute(client, interaction)
		return
	}
	
	const subcommands = await fs.readdir(path.join(
		commandPath
	))

	for (const subCommand of subcommands) {
		if (subCommand === 'index.ts' || subCommand == 'index.js') continue
		const command: Command = await import(path.join(commandPath, subCommand))
		if (command.data === undefined || command.execute === undefined) {
			console.warn(`Command ${subCommand} doesnt have data or execute`)
			return
		}

		cache.set(`${interaction.guildId}.${command.data.name}`, command)

		if (interaction.options.getSubcommand() === command.data.name) {
			command.execute(client, interaction)
		}
	}
}