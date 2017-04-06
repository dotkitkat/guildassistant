# azure / GuildAssistant
Azure/GuildAssistant is a Discord bot written in Node.js, designed for helping server owners/managers run their server.
It supports:
* Sharding (automatic and custom)
* TypeScript


It is written in Node.js using `discord.js` and `discord.js-commando`.

# The Configuration File
The configuration file is located at `config.json`. It should be next to `index.js`.  
<Setup guide coming soon>  

# Running
**GuildAssistant is not originally designed to be selfhosted, but you can make it work. Note there is no support for selfhosting.**
Use `tsc` (TypeScript compiler) to compile the TypeScript source, and then run it with `node --harmony index.js`. You need to setup the config files first.

Quick setup for VS Code:  
`git clone http://github.com/kitkatdesu/azure.git`  
`cd azure`    
`code .`  
All launch configurations and tasks are setup for your convenience.