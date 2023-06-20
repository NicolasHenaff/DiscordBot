import { SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server info!'),
    async execute(interaction: any) {
        await interaction.reply(`This command was run in ${interaction.guild.name}, who has ${interaction.guild.memberCount} members, and was created at ${interaction.guild.createdAt}.`);
    }
}