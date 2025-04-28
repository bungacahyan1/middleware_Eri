const { Client, IntentsBitField } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const FLOWISE_API_URL = process.env.FLOWISE_API_URL; // https://cloud.flowiseai.com/api/v1/prediction/2cb2a62f-e4a1-4cbc-934b-f943feafa4e
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY; // GI0xh7juWkTdHipXYhBo7-e2Q0z-cgB8mi0_U2-mai
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Abaikan pesan dari bot
  if (!message.content.startsWith('!ask')) return; // Gunakan perintah !ask

  const query = message.content.slice(5).trim(); // Ambil teks setelah !ask
  try {
    const response = await axios.post(FLOWISE_API_URL, {
      question: query,
      overrideConfig: {
        sessionId: "example-session",
        memoryKey: "example-memory",
        systemMessagePrompt: "You are a helpful AI assistant.",
        humanMessagePrompt: query,
      },
    }, {
      headers: {
        Authorization: `Bearer ${FLOWISE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const answer = response.data.text || 'Maaf, tidak ada jawaban.';
    message.reply(answer);
  } catch (error) {
    console.error(error);
    message.reply('Terjadi kesalahan saat menghubungi AI.');
  }
});

client.login(DISCORD_TOKEN);
