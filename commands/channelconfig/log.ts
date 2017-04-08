import commando = require('discord.js-commando')
import discord = require('discord.js');

module.exports = class LogChannelSetupCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'logsetup',
            memberName: 'logsetup',
            group: 'channelconfig',
            description: 'configures the channel that I will log to.',

            args: [
                {
                    key: 'channel',
                    type: 'channel',
                    prompt: 'what channel would you like me to log to?',
                    label: 'logging channel'
                }
            ]
        })
    }

    async run(message: commando.CommandMessage, args) {
        var chan: discord.TextChannel = args.channel as discord.TextChannel;
        this.client.provider.set(message.guild, 'logChannel', chan.id);
        return message.reply('successfully set the log channel for `' + message.guild + '` to `#' + chan.name + '`!');
    }
}