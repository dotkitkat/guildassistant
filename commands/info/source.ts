import commando = require('discord.js-commando')

module.exports = class SourceCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'source',
            group: 'info',
            memberName: 'source',
            description: 'Gets a source code link for Azure.'
        })
    }

    async run(message, args) {
        return message.reply("view the source code here: https://github.com/kitkatdesu/azure")
    }
}