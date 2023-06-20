import { Events } from 'discord.js';
import { Bot } from './utils/Bot';
import { CustomInteraction } from './utils/CustomInteraction';

const bot = new Bot();
bot.on('ready', () => console.log('Bot is ready'));
bot.on(Events.InteractionCreate, async (interaction: CustomInteraction) => {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
bot.start();
