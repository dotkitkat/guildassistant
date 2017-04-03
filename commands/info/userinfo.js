"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commando = require("discord.js-commando");
const discord = require("discord.js");
module.exports = class UserInfoCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "userinfo",
            group: "info",
            memberName: "userinfo",
            description: "Grabs user information.",
            args: [
                {
                    type: 'member',
                    key: 'target',
                    prompt: 'Who would you like to get information for?'
                }
            ],
            guildOnly: true
        });
    }
    async run(message, args) {
        let target = args.target;
        var emb = new discord.RichEmbed();
        emb.title = "User information for " + target.displayName;
        emb.addField("Discriminator", target.user.discriminator, true);
        let roles = target.roles.map(function (role) {
            return role.name;
        });
        let i = roles.indexOf("@everyone");
        if (i != -1) {
            roles.splice(i, 1);
        }
        emb.addField("Roles", roles.join(", "), true);
        emb.addField("Join Date", target.joinedAt.toDateString(), true);
        if (target.highestRole.name != null) {
            emb.addField("Highest Role", target.highestRole.name, true);
        }
        if (target.presence.game.name != null) {
            emb.addField("Game", "Playing " + target.presence.game.name, true);
        }
        emb.setThumbnail(target.user.avatarURL);
        return message.replyEmbed(emb);
    }
};
