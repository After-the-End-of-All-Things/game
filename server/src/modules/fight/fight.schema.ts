import {
  Element,
  IFight,
  IFightCharacter,
  IFightStatusMessage,
  IFightTile,
} from '@interfaces';
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

  @SerializedPrimaryKey()
  id!: string;

  @Property({ hidden: true })
  involvedPlayers: string[];

  @Property()
  turnOrder: string[];

  @Property()
  attackers: IFightCharacter[];

  @Property()
  defenders: IFightCharacter[];

  @Property()
  tiles: IFightTile[][];

  @Property()
  currentTurn: string;

  @Property()
  generatedElements: Record<Element, number>;

  @Property()
  generatedCharge: number;

  @Property()
  statusMessage: IFightStatusMessage[];

  constructor(
    involvedPlayers: string[],
    turnOrder: string[],
    attackers: IFightCharacter[],
    defenders: IFightCharacter[],
    tiles: IFightTile[][],
  ) {
    this.involvedPlayers = involvedPlayers;
    this.turnOrder = turnOrder;
    this.attackers = attackers;
    this.defenders = defenders;
    this.tiles = tiles;
    this.currentTurn = attackers[0].characterId;
    this.generatedElements = {
      fire: 0,
      water: 0,
      earth: 0,
      air: 0,
      light: 0,
      dark: 0,
      neutral: 0,
    };
    this.statusMessage = [];
    this.generatedCharge = 0;
  }
}
