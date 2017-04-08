import commando = require('discord.js-commando')
import discord = require('discord.js')

module.exports = class MessageLogChannelSetup extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'messagelogsetup',
            group: 'channelconfig',
            memberName: 'messagelogsetup',
            description: 'Sets up the channel to log message deletes to.',
            args: [
                {
                    key: 'messageLogChannel',
                    label: 'message log channel',
                    type: 'channel',
                    prompt: 'what channel would you like to log message deletes to?'
                }
            ]
        })
    }

    async run(message: commando.CommandMessage, args) {
        var msl: discord.TextChannel = args.messageLogChannel as discord.TextChannel;
        this.client.provider.set(message.guild, 'messageLogChannel', msl.id);
        return message.reply("successfully set the message log channel for `" + message.guild.name + "` to `#" + msl.name + "`!");
    }
}