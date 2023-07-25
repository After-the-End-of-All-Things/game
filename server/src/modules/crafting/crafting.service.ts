import { IRecipe } from '@interfaces';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Crafting } from '@modules/crafting/crafting.schema';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CraftingService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Crafting)
    private readonly crafting: EntityRepository<Crafting>,
  ) {}

  async getCraftingForUser(userId: string): Promise<Crafting | undefined> {
    const dbCrafting = await this.crafting.findOne({ userId });
    if (!dbCrafting) {
      return await this.createCraftingForUser(userId);
    }

    return dbCrafting;
  }

  async createCraftingForUser(userId: string): Promise<Crafting | undefined> {
    const crafting = new Crafting(userId);

    try {
      await this.crafting.create(crafting);
      await this.em.flush();
    } catch (e) {
      // mongodb duplicate
      if (e.code === 11000) {
        throw new BadRequestException('crafting id already in use.');
      }
    }

    return crafting;
  }

  hasResources(recipe: IRecipe, resources: Record<string, number>): boolean {
    return recipe.ingredients.every((ing) => {
      return resources[ing.item] >= ing.amount;
    });
  }

  takeResources(
    recipe: IRecipe,
    resources: Record<string, number>,
  ): Record<string, number> {
    recipe.ingredients.forEach((ing) => {
      resources = {
        ...resources,
        [ing.item]: Math.max(0, resources[ing.item] - ing.amount),
      };
    });

    return resources;
  }
}