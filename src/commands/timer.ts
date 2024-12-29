import { ApplicationCommandRegistry } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { ChatInputCommandInteraction } from 'discord.js';

export class TimerCommand extends Subcommand {
  public constructor(
    context: Subcommand.LoaderContext,
    options: Subcommand.Options
  ) {
    super(context, {
      ...options,
      name: 'timer',
      description: 'Simulate timers',
      subcommands: [
        {
          name: 'start',
          chatInputRun: 'chatInputStart',
        },
        {
          name: 'stop',
          chatInputRun: 'chatInputStop',
        },
      ],
    });
  }

  public override registerApplicationCommands(
    registry: ApplicationCommandRegistry
  ): void {
    registry.registerChatInputCommand((builder) => {
      builder
        .setName(this.name)
        .setDescription(this.description)
        .addSubcommand((command) =>
          command.setName('start').setDescription('Start the timer')
        )
        .addSubcommand((command) =>
          command.setName('stop').setDescription('Stop the timer')
        );
    });
  }

  public async chatInputStart(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    const msg = await interaction.editReply('**Timer**\n`00:00:00`');
    let seconds = 0;
    let minutes = 0;
    let hours = 0;

    this.container.timers.set(interaction.user.id, msg.id);
    const timerInterval = setInterval(() => {
      if (!this.container.timers.has(interaction.user.id))
        return clearInterval(timerInterval);

      seconds++;

      if (seconds == 60) {
        seconds = 0;
        minutes++;

        if (minutes == 60) {
          minutes = 0;
          hours++;
        }
      }

      if (msg.editable)
        msg.edit(
          `**Timer**\n\`${hours < 10 ? `0${hours}` : hours}:${
            minutes < 10 ? `0${minutes}` : minutes
          }:${seconds < 10 ? `0${seconds}` : seconds}\``
        );
    }, 1000);
  }

  public async chatInputStop(
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    await interaction.deferReply({
      ephemeral: true,
    });

    if (!this.container.timers.has(interaction.user.id))
      return void interaction.editReply("You don't have a timer");

    this.container.timers.delete(interaction.user.id);
    return void interaction.editReply('Your timer has been stopped!');
  }
}
