# After the End of All Things

God, am I getting tired of typing that.

## Useful Scripts

* `npm run lint` - run the lint checker for client and server
* `npm run build` - build the client and server
* `npm run start` - start the client and the server
* `npm run bump:<major,minor,patch>` - bump the version of the project, trigger a release, and changelog updates

## Server Setup

1. Create `server/.env` file
1. Add `MONGODB_URI` environment variable (you will need to set up MongoDB somehow) [default: `mongodb://localhost:27017/`]
1. Add `JWT_SECRET` environment variable (set to any string) [default: `supersecret`]