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

// calculation functions
export function calculateAbilityDamage(
  ability: ICombatAbility,
  character: IFightCharacter,
): number {
  return +Object.keys(ability.statScaling)
    .map(
      (stat) =>
        (ability.statScaling?.[stat as Stat] ?? 0) *
        character.totalStats[stat as Stat],
    )
    .reduce((a, b) => a + b, 0)
    .toFixed(1);
}

export function calculateAbilityDamageWithElements(
  elements: Record<Element, number>,
  ability: ICombatAbility,
  character: IFightCharacter,
  target: IFightCharacter,
): number {
  const damage = calculateAbilityDamage(ability, character);

  const elementDamage = Object.keys(elements)
    .map((element) => {
      const resistance = target.totalResistances[element as Element] ?? 1;
      return (elements?.[element as Element] ?? 0) * damage * resistance;
    })
    .reduce((a, b) => a + b, 0);

  return Math.max(0, damage + elementDamage);
}

export function distBetweenTiles(tileA: IFightTile, tileB: IFightTile): number {
  return Math.abs(tileA.x - tileB.x) + Math.abs(tileA.y - tileB.y);
}

export function isDead(character: IFightCharacter): boolean {
  return character.health.current <= 0;
}

// getters
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

export function getCharacterFromFightForUserId(
  fight: Fight,
  userId: string,
): IFightCharacter | undefined {
  const allCharacters = [...fight.attackers, ...fight.defenders];
  return allCharacters.find((c) => c.userId === userId);
}

export function getCharacterFromFightForCharacterId(
  fight: Fight,
  characterId: string,
): IFightCharacter | undefined {
  const allCharacters = [...fight.attackers, ...fight.defenders];
  const character = allCharacters.find((c) => c.characterId === characterId);

  return character;
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

export function getTargetsForAbilityPattern(
  fight: Fight,
  x: number,
  y: number,
  pattern: ICombatAbilityPattern,
): IFightCharacter[] {
  const targets: IFightCharacter[] = [];
  const tiles = getTargettedTilesForPattern(x, y, pattern);

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 8; x++) {
      if (!tiles[`${x}-${y}`]) continue;

      const tile = getTileAtPosition(fight, x, y);
      if (!tile) continue;

      targets.push(
        ...(tile.containedCharacters
          .map((id) => getCharacterFromFightForCharacterId(fight, id))
          .filter(Boolean) as IFightCharacter[]),
      );
    }
  }

  return targets;
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
      return [];
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
    fight.defenders.every((defender) => isDead(defender))
  );
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

  const attackerSide = fight.attackers.includes(attacker)
    ? 'attacker'
    : 'defender';

  // if we have to target in order, make sure we're targetting the first possible thing
  if (targetInOrder && ids.length === 1) {
    const attackersInOrder = [3, 2, 1, 0].map((x) => {
      return [0, 1, 2, 3]
        .map((y) => fight.tiles[y][x].containedCharacters)
        .flat();
    });

    const defendersInOrder = [4, 5, 6, 7].map((x) =>
      [0, 1, 2, 3].map((y) => fight.tiles[y][x].containedCharacters).flat(),
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
  defender.health.current = Math.max(0, defender.health.current - damage);
}