import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { PlayerWave } from '@modules/wave/playerwave.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WaveDBService {
  constructor(
    @InjectRepository(PlayerWave)
    private readonly playerWaves: EntityRepository<PlayerWave>,
  ) {}

  async getExistingWave(
    waver: string,
    wavedAt: string,
  ): Promise<PlayerWave | null> {
    return this.playerWaves.findOne({
      playerWaving: waver,
      playerWavingAt: wavedAt,
    });
  }

  async addWave(waver: string, wavedAt: string): Promise<void> {
    const wave = new PlayerWave(waver, wavedAt);
    await this.playerWaves.create(wave);
  }
}
