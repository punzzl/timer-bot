import { container, SapphireClient } from '@sapphire/framework';
import { ClientOptions } from 'discord.js';

export class BotClient extends SapphireClient {
  public timers: Map<string, string> = new Map();

  constructor(options: ClientOptions) {
    super(options);
  }

  public start(): void {
    container.timers = this.timers;
    this.login(process.env.DISCORD_TOKEN);
  }
}

declare module '@sapphire/pieces' {
  interface Container {
    timers: Map<string, string>;
  }
}
