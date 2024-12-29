import { config } from 'dotenv';
config();

import { BotClient } from './structures/BotClient';

const client = new BotClient({
  intents: ['Guilds'],
  baseUserDirectory: `${process.cwd()}/src`,
});

client.start();
