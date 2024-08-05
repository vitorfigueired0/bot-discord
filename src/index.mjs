import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds],  rest: { timeout: 60000 } });
client.commands = new Collection();
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
			client.commands.set(commandDefault.data.name, commandDefault);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

console.log('Fim')
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN);