import { Client, Events, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'

const client = new Client({ intents: [GatewayIntentBits.Guilds],  rest: { timeout: 60000 } });

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.TOKEN);