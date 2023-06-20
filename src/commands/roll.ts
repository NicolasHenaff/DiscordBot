import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Lance des dès avec une formule')
        .addStringOption(option =>
            option.setName('dices')
                .setDescription('La formule pour connaitre ton destin')
                .setRequired(true)),
        async execute(interaction: any) {
            const diceString: string = interaction.options.getString('dices');
            const components = diceString.split(/([+-])/).map(s => s.trim()).filter(Boolean);
            const diceResults: Map<number, number[]> = new Map();

            let total = 0;
            let hasCriticalFailure = false;
            let hasCriticalSuccess = false;
            let isPositive = true;
            for (let component of components) {
                if (component === '+') {
                    isPositive = true;
                    continue;
                }
                if (component === '-') {
                    isPositive = false;
                    continue;
                }
                component = component.toLowerCase();

                if (component.includes('d')) {
                    const diceParts = component.split('d');
                    const numberOfDice = diceParts[0] ? parseInt(diceParts[0]) : 1;
                    const numberOfFaces = parseInt(diceParts[1]);

                    for (let i = 0; i < numberOfDice; i++) {
                        const roll = Math.ceil(Math.random() * numberOfFaces);
                        total += isPositive ? +roll: -roll;
                        
                        if (roll === 1) hasCriticalFailure = true;
                        if (roll === numberOfFaces) hasCriticalSuccess = true;

                        if (diceResults.has(numberOfFaces)) {
                            diceResults.get(numberOfFaces).push(roll);
                        }
                        else {
                            diceResults.set(numberOfFaces, [roll]);
                        }
                    }
                } else {
                    const modifier = parseInt(component);
                    total += isPositive ? +modifier: -modifier;
                }
            }

            // Construct a result string
            let results = '';
            for (const [faces, rolls] of diceResults) {
                results += `- d${faces}: ${rolls.join(', ')}; \n`;
            }

            // Calculate the color of the embed based on the results (red for critical failure, green for critical success, purple otherwise)
            let embedColor;
            let thumbnailLink;
            if ((hasCriticalFailure && hasCriticalSuccess) || (!hasCriticalFailure && !hasCriticalSuccess)) embedColor = 0x800080;
            else {
                if (hasCriticalFailure) {
                    embedColor = 0xFF0000;
                    thumbnailLink = 'https://media4.giphy.com/media/oOBTO2UcSoaBJewZT0/giphy.gif';
                };
                if (hasCriticalSuccess) {
                    embedColor = 0x00FF00;
                    thumbnailLink = 'https://media1.giphy.com/media/qmjZjcZZPAfdX0YgEP/giphy.gif';
                };
            }

            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setTitle('Résultat des Dés')
                .setThumbnail(thumbnailLink)
                .setDescription(`Résultat de la formule \`${diceString}\``)
                .addFields(
                    { name: 'Résultats', value: results, inline: false },
                    { name: 'Total', value: total.toString(), inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Demandé par ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

            await interaction.reply({ embeds: [embed] });
        }
}