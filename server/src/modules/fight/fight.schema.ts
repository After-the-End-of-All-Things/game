import {
  Element,
  IFight,
  IFightCharacter,
  IFightStatusMessage,
  IFightTile,
} from '@interfaces';
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';
import { generateUUID } from '@utils/uuid';

@Entity()
export class Fight implements IFight {
  @SerializedPrimaryKey()
  id!: string;

  @Index()
  @Property()
  internalId: string;

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

  @PrimaryKey({ hidden: true })
  _id!: ObjectId;

  constructor(
    involvedPlayers: string[],
    turnOrder: string[],
    attackers: IFightCharacter[],
    defenders: IFightCharacter[],
    tiles: IFightTile[][],
  ) {
    this.internalId = generateUUID();
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
