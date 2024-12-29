import { Listener } from '@sapphire/framework';

export class ReadyEvent extends Listener {
  public override run() {
    this.container.logger.info('[CLIENT]: Ready!');
  }
}
