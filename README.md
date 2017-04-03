# azure
Azure is a Discord bot written in Node.js.
It supports:
* Sharding (automatic and custom)
* TypeScript


It is written in Node.js using Discord.js and Discord.js-commando.

# Running
Just run the .js files. If you're contributing, make sure to compile all TS files to JS before please.
Sometimes installing Azure on ARM or Linux machines will make an error while installing `sqlite3`, just install sqlite3 with the `--unsafe-perm` option:
`npm install sqlite3 --unsafe-perm`