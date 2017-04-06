import commando = require('discord.js-commando')
import discord = require('discord.js')

module.exports = class InviteCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'invite',
            memberName: 'invite',
            group: 'info',
            description: 'Gets a bot invite.'
        });
    }

    async run(message, args): Promise<any> {
        this.client.fetchApplication().then(function (result: discord.ClientOAuth2Application) {
            return message.reply(`invite Azure to your server: https://discordapp.com/oauth2/authorize?client_id=${result.id}&scope=bot&permissions=3165184`)
        }).catch(function (reason) {
            return message.reply("couldn't get the invite link. :anger:")
        })
    }
}