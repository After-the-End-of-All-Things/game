# After the End of All Things

we love eating our oats

## Getting Started

- use Node 18.15 or higher
- Install MongoDB
- `npm i` - install dependencies and run setup scripts
- `npm start` - start the client and server
- Install recommended VSCode extensions

## Useful Scripts

- `npm run setup` - run the setup scripts for both client and server
- `npm run lint` - run the lint checker for client and server
- `npm run build` - build the client and server
- `npm run start` - start the client and the server
- `npm run bump:<major,minor,patch>` - bump the version of the project, trigger a release, and changelog updates

## Server Setup

1. Create `server/.env` file
1. Add `MONGODB_URI` environment variable (you will need to set up MongoDB somehow) [default: `mongodb://127.0.0.1:27017`] Note the use of `127.0.0.1` instead of `localhost`, as `localhost` appears to not work.
1. Add `JWT_SECRET` environment variable (set to any string) [default: `supersecret`]

### Optional Server Environment Variables

- `DISABLE_DATABASE_LOGGING` - turn off the noisy database logging for MikroORM (default: false)
- `GAMEANALYTICS_KEY` - the game key for GameAnalytics
- `GAMEANALYTICS_SECRET` - the secret key for GameAnalytics
- `ROLLBAR_TOKEN` - the token for Rollbar
- `LOG_LEVEL` - the log level to use for the server (default: `trace`)

### Optional Game Setting Server Environment Variables

#### Collections

- `COLLECTIONS_TOTAL_COLLECTIBLES_REQUIRED` - the number of total collectibles required to claim rewards per tier (default: 100)
- `COLLECTIONS_TOTAL_COLLECTIBLES_REWARD_MULTIPLIER` - the multiplier for total collectibles rewards (default: 25)
- `COLLECTIONS_TOTAL_EQUIPMENT_REQUIRED` - the number of total equipment required to claim rewards per tier (default: 1000)
- `COLLECTIONS_TOTAL_EQUIPMENT_REWARD_MULTIPLIER` - the multiplier for total equipment rewards (default: 10)
- `COLLECTIONS_TOTAL_MONSTERS_REQUIRED` - the number of total monsters required to claim rewards per tier (default: 250)
- `COLLECTIONS_TOTAL_MONSTERS_REWARD_MULTIPLIER` - the multiplier for total monsters rewards (default: 10)
- `COLLECTIONS_UNIQUE_COLLECTIBLES_REQUIRED` - the number of unique collectibles required to claim rewards per tier (default: 10)
- `COLLECTIONS_UNIQUE_COLLECTIBLES_REWARD_MULTIPLIER` - the multiplier for unique collectibles rewards (default: 50)
- `COLLECTIONS_UNIQUE_EQUIPMENT_REQUIRED` - the number of unique equipment required to claim rewards per tier (default: 100)
- `COLLECTIONS_UNIQUE_EQUIPMENT_REWARD_MULTIPLIER` - the multiplier for unique equipment rewards (default: 25)
- `COLLECTIONS_UNIQUE_MONSTERS_REQUIRED` - the number of unique monsters required to claim rewards per tier (default: 25)
- `COLLECTIONS_UNIQUE_MONSTERS_REWARD_MULTIPLIER` - the multiplier for unique monsters rewards (default: 25)

#### Combat

- `COMBAT_COINS_LOSS_MULTIPLIER` - the multiplier for combat coins loss [percent] (default: 25)
- `COMBAT_XP_LOSS_MULTIPLIER` - the multiplier for combat XP loss [percent] (default: 25)

#### Crafting

- `CRAFTING_SPEED_MULTIPLIER` - the multiplier for crafting speed [percent] (default: 100)

#### Explore

- `EXPLORE_BASE_COINS` - the amount of coins gained per explore (default: 3)
- `EXPLORE_BASE_SPEED` - the cooldown between explores (default: 5)
- `EXPLORE_BASE_XP` - the amount of XP gained per explore (default: 5)
- `EXPLORE_EVENT_COLLECTIBLE_FIND_PERCENT_BOOST` - the percent boost to collectible find events happening (default: 0)
- `EXPLORE_EVENT_ITEM_FIND_PERCENT_BOOST` - the percent boost to item find events happening (default: 0)
- `EXPLORE_EVENT_LOCATION_FIND_PERCENT_BOOST` - the percent boost to location find events happening (default: 0)
- `EXPLORE_EVENT_MONSTER_FIND_PERCENT_BOOST` - the percent boost to monster find events happening (default: 0)
- `EXPLORE_EVENT_NPC_FIND_PERCENT_BOOST` - the percent boost to NPC find events happening (default: 0)
- `EXPLORE_EVENT_RESOURCE_FIND_PERCENT_BOOST` - the percent boost to resource find events happening (default: 0)
- `EXPLORE_EVENT_WAVE_PERCENT_BOOST` - the percent boost to wave events happening (default: 0)
- `EXPLORE_SPEED_MULTIPLIER` - the multiplier for explore speed [percent] (default: 100)
- `EXPLORE_XP_MULTIPLIER` - the multiplier for explore XP [percent] (default: 100)

#### Finding Items

- `FIND_RATE_COMMON` - the rate at which common items are found [weight] (default: 100)
- `FIND_RATE_UNCOMMON` - the rate at which uncommon items are found [weight] (default: 75)
- `FIND_RATE_UNUSUAL` - the rate at which unusual items are found [weight] (default: 50)
- `FIND_RATE_RARE` - the rate at which rare items are found [weight] (default: 25)
- `FIND_RATE_EPIC` - the rate at which epic items are found [weight] (default: 10)
- `FIND_RATE_MASTERFUL` - the rate at which masterful items are found [weight] (default: 5)
- `FIND_RATE_ARCANE` - the rate at which arcane items are found [weight] (default: 3)
- `FIND_RATE_DIVINE` - the rate at which divine items are found [weight] (default: 2)
- `FIND_RATE_UNIQUE` - the rate at which unique items are found [weight] (default: 1)

#### Inventory

- `INVENTORY_MAX_SIZE` - the maximum inventory size per player (default: 100)

### Notes

- Setup scripts must be non-mandatory (at this time).
- When setting properties on a sub-object for a schema, it _will not flush_ unless you also set the object. One way to do this is: `this.prop = { ...this.prop, newProp: newPropValue }`.
- When setting properties on a sub-object for a schema, it must not be more than one property deep where possible. This causes unknown, annoying complications with the ORM. It is fiesty.
