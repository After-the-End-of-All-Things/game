# After the End of All Things

God, am I getting tired of typing that.

## Getting Started

- use Node 18.15 or higher
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

- `MAX_INVENTORY_SIZE` - the maximum inventory size per player (default: 100e)
- `BASE_EXPLORE_XP` - the amount of XP gained per explore (default: 5)
- `BASE_EXPLORE_COINS` - the amount of coins gained per explore (default: 3)
- `BASE_EXPLORE_SPEED` - the cooldown between explores (default: 5)
- `WAVE_PERCENT_BOOST` - the percent boost to wave events happening (default: 0)
- `ITEM_FIND_PERCENT_BOOST` - the percent boost to item find events happening (default: 0)
- `COLLECTIBLE_FIND_PERCENT_BOOST` - the percent boost to collectible find events happening (default: 0)
- `LOCATION_FIND_PERCENT_BOOST` - the percent boost to location find events happening (default: 0)
- `GAMEANALYTICS_KEY` - the game key for GameAnalytics
- `GAMEANALYTICS_SECRET` - the secret key for GameAnalytics
- `ROLLBAR_TOKEN` - the token for Rollbar

### Notes

- Setup scripts must be non-mandatory (at this time).
- When setting properties on a sub-object for a schema, it _will not flush_ unless you also set the object. One way to do this is: `this.prop = { ...this.prop, newProp: newPropValue }`.
- When setting properties on a sub-object for a schema, it must not be more than one property deep where possible. This causes unknown, annoying complications with the ORM. It is fiesty.
