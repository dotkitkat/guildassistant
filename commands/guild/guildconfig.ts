import commando = require('discord.js-commando')
import discord = require('discord.js')

module.exports = class GuildConfigCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: 'guildconfig',
            memberName: 'guildconfig',
            group: 'guild',
            description: "Edits a guild's config.",
            args: [
                {
                    key: 'key',
                    label: 'key',
                    type: 'string',
                    prompt: 'what key would you like to edit?'
                },
                {
                    key: 'value',
                    label: 'value',
                    type: 'string',
                    prompt: 'what value would you like to change the key to?'
                }
            ]
        })
    }

    hasPermission(message: commando.CommandMessage) {
        return message.guild.ownerID === message.author.id;
    }

    async run(message: commando.CommandMessage, args) {
        if (args.key === "joinableRoles") {
            return message.reply("joinable roles are not editable through guildconfig. Please use `help`.");
        }
        else if (args.key === "list") {
            return message.reply("the following configuration options are available: \n announcementsId \n streamChannelId (defaults to announcementsId)");
        }
        else {
            this.client.provider.set(message.guild, args.key, args.value).then(function () {
                return message.reply('set value `' + args.key + '` for guild `' + message.guild.name + "` to `" + args.value + "`!");
            });
        }
    }
}