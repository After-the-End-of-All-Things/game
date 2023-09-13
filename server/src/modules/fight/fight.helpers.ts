import {
  Element,
  ICombatAbility,
  ICombatAbilityPattern,
  ICombatTargetParams,
  IFightCharacter,
  IFightTile,
  Stat,
} from '@interfaces';
import { Fight } from '@modules/fight/fight.schema';
import { random, sample } from 'lodash';

// calculation functions
export function calculateAbilityDamage(
  ability: ICombatAbility,
  character: IFightCharacter,
  target: IFightCharacter,
  elements: Record<Element, number>,
): number {
  return Math.max(
    0,
    +Object.keys(ability.statScaling)
      .map((stat: Stat) => {
        const statBase =
          (ability.statScaling?.[stat] ?? 0) * character.totalStats[stat];

        const elementDamage = Math.max(
          0,
          Object.keys(elements)
            .map((element) => {
              const elementTotal = elements?.[element as Element] ?? 0;
              if (elementTotal === 0) return 0;

              const resistance =
                target.totalResistances[element as Element] ?? 1;
              const baseDamage = statBase * resistance;
              const elementDamageTotal = baseDamage * (elementTotal * 0.05);

              return elementDamageTotal;
            })
            .reduce((a, b) => a + b, 0),
        );

        const totalStat = statBase + elementDamage;

        if (stat === 'power') {
          const otherTough = Math.max(0, target.totalStats.toughness);
          const baseValue = +random(-otherTough, totalStat).toFixed(1);
          return Math.max(0, baseValue);
        }

        if (stat === 'magic') {
          const otherResist = Math.max(0, target.totalStats.resistance);
          const baseValue = +random(-otherResist, totalStat).toFixed(1);
          return Math.max(0, baseValue);
        }

        return totalStat;
      })
      .reduce((a, b) => a + b, 0)
      .toFixed(1),
  );
}

export function distBetweenTiles(tileA: IFightTile, tileB: IFightTile): number {
  return Math.abs(tileA.x - tileB.x) + Math.abs(tileA.y - tileB.y);
}

export function isDead(character: IFightCharacter): boolean {
  return character.health.current <= 0;
}

// getters
export function getAllFightCharacters(fight: Fight): IFightCharacter[] {
  return [...fight.attackers, ...fight.defenders];
}

export function getTileAtPosition(
  fight: Fight,
  x: number,
  y: number,
): IFightTile {
  return fight.tiles[y][x];
}

export function getTileContainingCharacter(
  fight: Fight,
  characterId: string,
): IFightTile | undefined {
  const tiles = fight.tiles.flat();
  const tile = tiles.find((t) => t.containedCharacters.includes(characterId));

  return tile;
}

export function getEmptyTile(): IFightTile {
  return {
    containedCharacters: [],
    x: -1,
    y: -1,
  };
}

export function getEmptyTiles(): IFightTile[][] {
  return [
    [getEmptyTile(), getEmptyTile(), getEmptyTile(), getEmptyTile()],
    [getEmptyTile(), getEmptyTile(), getEmptyTile(), getEmptyTile()],
    [getEmptyTile(), getEmptyTile(), getEmptyTile(), getEmptyTile()],
    [getEmptyTile(), getEmptyTile(), getEmptyTile(), getEmptyTile()],
  ];
}

export function getCharacterFromFightForUserId(
  fight: Fight,
  userId: string,
): IFightCharacter | undefined {
  return getAllFightCharacters(fight).find((c) => c.userId === userId);
}

export function getCharacterFromFightForCharacterId(
  fight: Fight,
  characterId: string,
): IFightCharacter | undefined {
  return getAllFightCharacters(fight).find(
    (c) => c.characterId === characterId,
  );
}

export function getAllTiles(fight: Fight): IFightTile[] {
  return fight.tiles.flat(2);
}

export function getAllTilesMatchingPatternTargets(
  fight: Fight,
  matchingTiles: Record<string, boolean>,
): IFightTile[] {
  return getAllTiles(fight).filter((t) => matchingTiles[`${t.x}-${t.y}`]);
}

export function getTargettedTilesForPattern(
  x: number,
  y: number,
  pattern: ICombatAbilityPattern,
): Record<string, boolean> {
  const staticSelectedTiles: Record<string, boolean> = {};

  switch (pattern) {
    case 'Single': {
      staticSelectedTiles[`${x}-${y}`] = true;
      return staticSelectedTiles;
    }

    case 'Cross': {
      staticSelectedTiles[`${x}-${y}`] = true;
      staticSelectedTiles[`${x - 1}-${y}`] = true;
      staticSelectedTiles[`${x + 1}-${y}`] = true;
      staticSelectedTiles[`${x}-${y - 1}`] = true;
      staticSelectedTiles[`${x}-${y + 1}`] = true;
      return staticSelectedTiles;
    }

    case 'CrossNoCenter': {
      staticSelectedTiles[`${x - 1}-${y}`] = true;
      staticSelectedTiles[`${x + 1}-${y}`] = true;
      staticSelectedTiles[`${x}-${y - 1}`] = true;
      staticSelectedTiles[`${x}-${y + 1}`] = true;
      return staticSelectedTiles;
    }

    case 'ThreeVertical': {
      staticSelectedTiles[`${x}-${y}`] = true;
      staticSelectedTiles[`${x}-${y - 1}`] = true;
      staticSelectedTiles[`${x}-${y + 1}`] = true;
      return staticSelectedTiles;
    }

    case 'TwoHorizontal': {
      staticSelectedTiles[`${x}-${y}`] = true;
      staticSelectedTiles[`${x + 1}-${y}`] = true;
      return staticSelectedTiles;
    }

    default:
      return pattern satisfies never;
  }
}

export function getTargetsForAbility(
  fight: Fight,
  action: ICombatAbility,
  targetParams: ICombatTargetParams,
): IFightCharacter[] {
  switch (action.targetting) {
    case 'Creature': {
      const { characterIds } = targetParams;
      if (!characterIds) return [];

      return characterIds
        .map((id) => getCharacterFromFightForCharacterId(fight, id))
        .filter(Boolean) as IFightCharacter[];
    }

    case 'Ground': {
      const { tile } = targetParams;
      if (!tile) return [];

      const tiles = getTargettedTilesForPattern(tile.x, tile.y, action.pattern);
      return getAllTilesMatchingPatternTargets(fight, tiles)
        .flatMap((tile) => tile.containedCharacters)
        .flatMap((id) => getCharacterFromFightForCharacterId(fight, id))
        .filter(Boolean) as IFightCharacter[];
    }

    case 'Self': {
      const { characterIds } = targetParams;
      if (!characterIds) return [];

      return characterIds
        .map((id) => getCharacterFromFightForCharacterId(fight, id))
        .filter(Boolean) as IFightCharacter[];
    }

    default:
      return action.targetting satisfies never;
  }
}

// validation functions
export function isActiveTurn(fight: Fight, userId: string) {
  const myCharacter = getCharacterFromFightForUserId(fight, userId);
  return fight.currentTurn === myCharacter?.characterId;
}

export function isFightOver(fight: Fight): boolean {
  return (
    fight.attackers.every((attacker) => isDead(attacker)) ||
    fight.defenders.every((defender) => isDead(defender)) ||
    fight.attackers.length === 0 ||
    fight.defenders.length === 0
  );
}

export function getCharacterSide(
  fight: Fight,
  char: IFightCharacter,
): 'attacker' | 'defender' {
  return fight.attackers.includes(char) ? 'attacker' : 'defender';
}

export function isValidTarget(
  fight: Fight,
  attacker: IFightCharacter,
  action: ICombatAbility,
  targetParams: ICombatTargetParams,
): boolean {
  const { targetting, pattern, targetInOrder } = action;

  const { tile, characterIds } = targetParams;
  if (!tile && !characterIds) return false;

  // easy checks
  if (tile && targetting !== 'Ground') return false;
  if (characterIds && targetting === 'Ground') return false;

  const ids = characterIds ?? [];

  // if everyone in the target id list is dead, it's invalid
  const checkChars = ids
    .map((id) => getCharacterFromFightForCharacterId(fight, id))
    .filter(Boolean) as IFightCharacter[];
  if (
    checkChars.length > 0 &&
    checkChars.every((character) => isDead(character))
  ) {
    return false;
  }

  const attackerSide = getCharacterSide(fight, attacker);

  // if we have to target in order, make sure we're targetting the first possible thing
  if (targetInOrder && ids.length === 1) {
    const attackersInOrder = [3, 2, 1, 0].map((x) => {
      return [0, 1, 2, 3]
        .map((y) =>
          fight.tiles[y][x].containedCharacters.filter((id) => {
            const char = getCharacterFromFightForCharacterId(fight, id);
            if (!char) return false;
            return !isDead(char);
          }),
        )
        .flat();
    });

    const defendersInOrder = [4, 5, 6, 7].map((x) =>
      [0, 1, 2, 3]
        .map((y) =>
          fight.tiles[y][x].containedCharacters.filter((id) => {
            const char = getCharacterFromFightForCharacterId(fight, id);
            if (!char) return false;
            return !isDead(char);
          }),
        )
        .filter(Boolean)
        .flat(),
    );

    const checkArray =
      attackerSide === 'attacker' ? defendersInOrder : attackersInOrder;

    let isCorrect = false;
    let cancelEarly = false;
    checkArray.forEach((closenessArr) => {
      if (cancelEarly || closenessArr.length === 0) return;
      cancelEarly = true;

      if (closenessArr.includes(ids[0])) {
        isCorrect = true;
      }
    });

    if (!isCorrect) return false;
  }

  // make sure if we have a pattern, we're hitting at least one alive creature
  if (pattern && tile) {
    const tiles = getTargettedTilesForPattern(tile.x, tile.y, pattern);
    const allTargettedCharacters: IFightCharacter[] = [];

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 4; y++) {
        if (!tiles[`${x}-${y}`]) continue;

        allTargettedCharacters.push(
          ...(fight.tiles[y][x].containedCharacters
            .map((id) => getCharacterFromFightForCharacterId(fight, id))
            .filter(Boolean) as IFightCharacter[]),
        );
      }
    }

    if (
      allTargettedCharacters.length === 0 ||
      allTargettedCharacters.every((c) => isDead(c))
    )
      return false;
  }

  return true;
}

export function didAttackersWinFight(fight: Fight): boolean {
  return fight.defenders.every((defender) => isDead(defender));
}

// status message functions
export function setStatusMessage(
  fight: Fight,
  context: string,
  message: string,
): void {
  fight.statusMessage = [{ message, context, timestamp: Date.now() }];
}

export function addStatusMessage(
  fight: Fight,
  context: string,
  message: string,
): void {
  fight.statusMessage = [
    ...fight.statusMessage,
    { message, context, timestamp: Date.now() },
  ];
}

export function clearStatusMessage(fight: Fight): void {
  fight.statusMessage = [];
}

// action functions
export function moveCharacterBetweenTiles(
  characterId: string,
  startTile: IFightTile,
  endTile: IFightTile,
): void {
  startTile.containedCharacters = startTile.containedCharacters.filter(
    (char) => char !== characterId,
  );
  endTile.containedCharacters = [...endTile.containedCharacters, characterId];
}

export function addAbilityElementsToFight(
  fight: Fight,
  ability: ICombatAbility,
): void {
  const elementOpposites: Record<Element, Element> = {
    air: 'earth',
    earth: 'air',

    fire: 'water',
    water: 'fire',

    light: 'dark',
    dark: 'light',

    neutral: 'neutral',
  };

  ability.generatedElements.forEach((element) => {
    fight.generatedElements[element] =
      (fight.generatedElements[element] ?? 0) + 1;

    fight.generatedElements[elementOpposites[element]] = Math.max(
      0,
      (fight.generatedElements[elementOpposites[element]] ?? 0) - 1,
    );
  });
}

export function applyAbilityCooldown(
  character: IFightCharacter,
  ability: ICombatAbility,
): void {
  if (!ability.cooldown) return;

  character.cooldowns[ability.itemId] = ability.cooldown + 1;
}

export function reduceAllCooldownsForCharacter(
  character: IFightCharacter,
): void {
  Object.keys(character.cooldowns).forEach((key) => {
    character.cooldowns[key] = Math.max(0, (character.cooldowns[key] ?? 0) - 1);
  });
}

export function doDamageToTargetForAbility(
  fight: Fight,
  attacker: IFightCharacter,
  defender: IFightCharacter,
  damage: number,
): void {
  if (isDead(defender)) return;

  const dealtDamage = +damage.toFixed(1);

  defender.health.current = Math.max(0, defender.health.current - dealtDamage);

  if (dealtDamage === 0) {
    addStatusMessage(
      fight,
      attacker.name,
      `${attacker.name}'s attack against ${defender.name} was blocked! `,
    );

    return;
  }

  addStatusMessage(
    fight,
    attacker.name,
    `${attacker.name} dealt ${dealtDamage.toLocaleString()} damage to ${
      defender.name
    }!`,
  );

  if (isDead(defender)) {
    addStatusMessage(
      fight,
      'Death',
      `${defender.name} was slain by ${attacker.name}!`,
    );
  }
}

// ai functions
export function getTargetsForAIAbility(
  fight: Fight,
  ability: ICombatAbility,
  attacker: IFightCharacter,
): ICombatTargetParams | undefined {
  const attackerSide = getCharacterSide(fight, attacker);

  const oppositeSide =
    attackerSide === 'attacker' ? fight.defenders : fight.attackers;

  switch (ability.targetting) {
    case 'Creature': {
      const validTargets = oppositeSide.filter((c) =>
        isValidTarget(fight, attacker, ability, {
          characterIds: [c.characterId],
        }),
      );

      const target = sample(validTargets) as IFightCharacter;
      if (!target) return undefined;

      return { characterIds: [target.characterId] };
    }

    case 'Ground': {
      const validTargets = oppositeSide.filter((c) => {
        const tile = getTileContainingCharacter(fight, c.characterId);
        if (!tile) return false;

        return !isValidTarget(fight, attacker, ability, { tile });
      });

      const target = sample(validTargets) as IFightCharacter;
      const targetTile = getTileContainingCharacter(fight, target.characterId);
      if (!targetTile) return undefined;

      return { tile: targetTile };
    }

    case 'Self': {
      return { characterIds: [attacker.characterId] };
    }

    default:
      return ability.targetting satisfies never;
  }
}
