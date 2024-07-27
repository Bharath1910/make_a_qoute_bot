import { Message } from "discord.js";
import { CustomClient } from "../../typings";
import { EmbedBuilder } from "discord.js";

export async function execute(
	client: CustomClient,
	message: Message
): Promise<void> {
	if (message.author.bot) return;
	if (message.content !== `<@${client.application?.id}>`) return;
	if (message.mentions.repliedUser === null) {
		message.reply({
			content: "You need to mention a user to create an invocation."
		});
		return;
	}

	const { username, avatar, id } = message.mentions.repliedUser
	const avatarURL = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=4096`
	
	return;
}