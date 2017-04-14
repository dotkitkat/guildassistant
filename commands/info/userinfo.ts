import {User} from "discord.js";
import {CommandoClient} from "discord.js-commando";
import commando = require('discord.js-commando')
import discord = require('discord.js')

module.exports = class UserInfoCommand extends commando.Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "userinfo",
            group: "info",
            memberName: "userinfo",
            description: "Grabs user information.",
            args: [
                {
                    type: 'member',
                    key: 'target',
                    prompt: 'who would you like to get information for?'
                }
            ],
            guildOnly: true
        });
    }

    async run(message: commando.CommandMessage, args): Promise<any> {
        let target: discord.GuildMember = args.target;
        var emb = new discord.RichEmbed();
        emb.title = "User information for " + target.displayName;
        emb.addField("Discriminator", target.user.discriminator, true);
        let roles: string[] = target.roles.map(function (role: discord.Role) {
            return role.name;
        });
        let i: number = roles.indexOf("@everyone");
        if (i != -1) {
            roles.splice(i, 1);
        }
        emb.addField("Roles", roles.join(", "), true);
        emb.addField("Join Date", target.joinedAt.toDateString(), true);
        if (target.highestRole != null) {
            emb.addField("Highest Role", target.highestRole.name, true);
        }
        if (target.presence.game != null) {
            emb.addField("Game", "Playing " + target.presence.game.name, true);
        }
        emb.setThumbnail(target.user.avatarURL);
        return message.replyEmbed(emb);
    }
};