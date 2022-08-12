const { SlashCommandBuilder, Routes, Client, MessageAttachment, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./auth.json');
const os = require('os');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Bot ready!');
  client.user.setPresence({
    game: {
     name: 'with the discord.js library',
     type: 'PLAYING',
    },
    status: 'online',
   });
});

// Login to Discord with your client's token
client.login(token);
console.log("Logged in!")

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('pong'),
	new SlashCommandBuilder().setName('server').setDescription('Details of current server'),
  new SlashCommandBuilder().setName('status').setDescription('Bot status'),
	new SlashCommandBuilder().setName('info').setDescription('Bot info'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Registered slash commands!'))
	.catch(console.error);

client.on('interactionCreate', async interaction => {
  console.log("Received a command!")
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}\nCreated on: ${interaction.guild.createdAt}\nID: ${interaction.guild.id}`);
	} else if (commandName === 'status') {
		await interaction.reply(`Bot is **online**\nRunning on ${os.platform()} ${os.release()}, node.js ${process.version}`);
	} else if (commandName === 'info') {
		await interaction.reply(`**Orphan Destroyer**\nCreated by BomberFish\nLicensed under the GNU Affero GPL. Source code available at https://github.com/BomberFish/orphan-destroyer`);
	} 
});