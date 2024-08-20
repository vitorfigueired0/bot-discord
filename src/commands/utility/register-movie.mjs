import { SlashCommandBuilder } from 'discord.js';
import * as fs from 'node:fs'

export default {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register a movie to watch list')
    .addStringOption(option => option.setName('input')
      .setDescription('Type movie name')
      .setRequired(true)
    ),

  async execute(interaction) {
    const option = interaction.options
    if(option.data) {
      const movieName = option.data[0].value
      this.registerMovie(movieName)
      await interaction.reply(`Nice choice! now the movie "${movieName}" can be picked as the movie of the night`)
    }
  },

  async registerMovie(movieName) {
    fs.writeFile('src/movie-list.txt', `${movieName}\n`, { flag: 'a+' }, err => {
      if(err) {
        console.error(`Error while register movie: ${err}`)
      }
    })
  } 
}