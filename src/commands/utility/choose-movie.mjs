import { SlashCommandBuilder } from 'discord.js';
import * as fs from 'node:fs'

const movieListFile = 'src/movie-list.txt'

export default {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Choose a movie from watch list'),

  async execute(interaction) {
    const movie = await this.pickMovie()
    
    if(movie) {
      await interaction.reply(`The movie of the night is: ${movie}`)
      return
    }

    await interaction.reply(`The movie list is empty, please, register new values`)
  },

  async pickMovie() {
    const content = fs.readFileSync(movieListFile, 'utf-8')
    const movieList = content.split('\n')

    const randomMovieIndex = Math.floor(Math.random() * movieList.length)
    const movie = movieList[randomMovieIndex]

    if(movie) {
      this.removeMovie(movie, movieList)
    }

    return movie
  },

  async removeMovie(movie, movieList) {
    const newList = movieList.filter(item => !item.includes(movie))
    const newContent = newList.join('\n')

    fs.writeFile(movieListFile, newContent, err => {
      if(err) {
        console.error(`Error: ${err}`)
      }
    })
    
  }
  
}