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
  // Abaikan pesan dari bot itu sendiri
  if (message.author.bot) return;

  // Periksa apakah bot di-tag dalam pesan
  if (!message.mentions.has(client.user)) return;

  // Ambil isi pesan, hapus mention bot dari pesan
  const query = message.content.replace(/<@!?[0-9]+>/g, '').trim();

  // Jika tidak ada teks setelah mention, berikan pesan default
  if (!query) {
    message.reply('Silakan ajukan pertanyaan setelah mention saya! Contoh: <@BotID> Apa itu AI?');
    return;
  }

  try {
    const response = await axios.post(FLOWISE_API_URL, {
      question: query
    }, {
      headers: {
        Authorization: `Bearer ${FLOWISE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const answer = response.data.text || 'Maaf, tidak ada jawaban.';
    message.reply(answer);
  } catch (error) {
    console.error('Axios Error:', error.response ? error.response.data : error.message);
    message.reply('Terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti.');
  }
});

client.on('error', (error) => {
  console.error('Client error:', error);
});

client.on('shardError', (error) => {
  console.error('Shard error:', error);
});

client.login(DISCORD_TOKEN);
