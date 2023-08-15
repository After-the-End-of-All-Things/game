import { IFight, IFightCharacter, IFightTile } from '@interfaces';
import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Fight implements IFight {
  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  @SerializedPrimaryKey({ hidden: true })
  id!: string;

  @Property({ hidden: true })
  involvedPlayers: string[];

  @Property()
  attackers: IFightCharacter[];

  @Property()
  defenders: IFightCharacter[];

  @Property()
  tiles: IFightTile[][];

  constructor(
    involvedPlayers: string[],
    attackers: IFightCharacter[],
    defenders: IFightCharacter[],
    tiles: IFightTile[][],
  ) {
    this.involvedPlayers = involvedPlayers;
    this.attackers = attackers;
    this.defenders = defenders;
    this.tiles = tiles;
  }
}
