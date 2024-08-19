import { REST, Routes } from 'discord.js';
import * as fs from 'node:fs'
import * as path from 'node:path'
import 'dotenv/config';

const commands = [];
const mainFolderPath = 'src/commands/';
const commandFolders = fs.readdirSync(mainFolderPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(mainFolderPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.mjs'));
	
  for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const fileUrl = new URL(`file://${path.resolve(filePath)}`);
		const command = await import(fileUrl.href);
		
		const commandDefault = command.default
    if ('data' in commandDefault && 'execute' in commandDefault) {
			commands.push(commandDefault.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(process.env.TOKEN);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();