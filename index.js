import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import commands from './command.json' assert { type: 'json' };
import { fetchJSON, addKey, deleteKey, updateKey } from './cmdFuction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Listen for messages
client.on('messageCreate', (msg) => {
  const messageContent = msg.content;
  console.log('messageContent:', messageContent);

  if (commands[messageContent]) {
    msg.reply(commands[messageContent]);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/all', async (req, res) => {
  try {
    const data = await fetchJSON();
    res.json({
      message: 'Success',
      data,
    });
  } catch (error) {
    console.error('Error in /all:', error);
    res.status(500).json({
      message: 'Failed to fetch data',
      data: null,
    });
  }
});

app.post('/api/', async (req, res) => {
  const { key, value } = req.body;
  console.log(req.body);
  try {
    const success = await addKey(key, value);
    if (success) {
      res.json({ message: 'Key added successfully!' });
    } else {
      res.status(400).json({ message: 'Key already exists.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to add key' });
  }
});

app.put('/api/', async (req, res) => {
  const { oldKey, newKey, newValue } = req.body;
  try {
    const success = await updateKey(oldKey, newKey, newValue);
    if (success) {
      res.json({ message: 'Key updated successfully!' });
    } else {
      res.status(400).json({ message: 'Key to update does not exist.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update key' });
  }
});

app.delete('/api/', async (req, res) => {
  const { key } = req.body;
  try {
    const success = await deleteKey(key);
    if (success) {
      res.json({ message: 'Key deleted successfully!' });
    } else {
      res.status(404).json({ message: 'Key not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete key' });
  }
});

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
};
startServer();
