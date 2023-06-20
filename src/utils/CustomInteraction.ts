import { ChatInputCommandInteraction } from "discord.js";
import { Bot } from "./Bot";

export interface CustomInteraction extends ChatInputCommandInteraction {
    client: Bot;
}