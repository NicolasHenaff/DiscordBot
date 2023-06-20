import { config } from 'dotenv';
import { resolve, join } from 'path';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';

config({ path: resolve(__dirname, '../../.env') });

export class Bot extends Client {
    private tokenBot: string = process.env.DISCORD_TOKEN ?? 'no token';
    public commands: Collection<string, any>;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
            ],
        });
        this.token = this.tokenBot;
        this.commands = new Collection<string, any>();
        this.loadCommands();
    }

    public start(): void {
        if (this.token === 'no token') {
            console.log('No token provided');
            return;
        }

        this.login(this.tokenBot)
            .then(() => console.log('Bot is connected'))
            .catch((err) => console.log(err));
    }

    public stop(): void {
        console.log('Bot is disconnected');
        this.destroy();
    }

    public loadCommands(): void {
        const commandsPath = join(__dirname, '../commands');
        const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = join(commandsPath, file);
            const command: { data: {name?: string, description?: string}, execute: Function } = require(filePath).command;
            if (command.data && command.execute) {
                console.log(`[INFO] Loading command ${command.data.name} from ${filePath}`);
                this.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}
