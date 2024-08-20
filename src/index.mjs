import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds],  rest: { timeout: 60000 } });
client.commands = new Collection();

const commandsDir = 'src/commands/';
const commandFolders = fs.readdirSync(commandsDir);

for (const folder of commandFolders) {
	const commandsPath = path.join(commandsDir, folder);
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

 const eventsDir = 'src/events/'
 const eventsFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.mjs'))

 for(const file of eventsFiles) {
	const filePath = path.join(eventsDir, file)
	const fileUrl = new URL(`file://${path.resolve(filePath)}`)
	const event = await import(fileUrl.href)

	const eventDefault = event.default
	if (eventDefault.once) {
		client.once(eventDefault.name, (...args) => eventDefault.execute(...args));
	} else {
		client.on(eventDefault.name, (...args) => eventDefault.execute(...args));
	}
 }



client.login(process.env.TOKEN);
