import commando = require('discord.js-commando')
import discord = require('discord.js')

module.exports = class AvatarCommand extends commando.Command {
    constructor(client: commando.CommandoClient) {
        super(client, {
            name: "avatar",
            group: "info",
            memberName: "avatar",
            description: "Gets an avatar for a user.",
            args: [
                {
                    prompt: "What user would you like to get an avatar for?",
                    key: 'target',
                    type: 'member'
                }
            ]
        })
    }

    async run(message, args) {
        var user: discord.GuildMember = args.target;
        var emb: discord.RichEmbed = new discord.RichEmbed();
        emb.setImage(user.user.avatarURL);
        emb.title = "Avatar for " + user.displayName;
        var chan: discord.TextChannel = message.channel;
        return chan.sendEmbed(emb);
    }
};