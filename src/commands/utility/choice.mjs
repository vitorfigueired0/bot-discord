import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('choice')
    .setDescription('Choice 1 or zero')
    .addStringOption(option => option.setName('choiceone')
      .setDescription('just 1..')
      .setRequired(true)
      .addChoices(
        { name: 'One', value: '1' },
        { name: 'Zero', value: '0' },
      )),

  async execute(interaction) {
    const option = interaction.options
    if(option.data) {
      await interaction.reply(`Nice choice!: ${option.data[0].value}`)
    }
  }
}