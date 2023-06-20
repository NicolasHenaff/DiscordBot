import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { resolve, join } from 'path';
import { readdirSync } from 'fs';

config({ path: resolve(__dirname, '../../.env') });
const token: string = process.env.DISCORD_TOKEN ?? 'no token'
const clientId = process.env.CLIENT_ID ?? 'no client id';

const commands = [];

const commandsPath = join(__dirname, '../../dist/commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command: any = require(filePath).command;
    if (command.data) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);
	} catch (error) {
		console.error(error);
	}
})();
