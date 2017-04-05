"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commando = require("discord.js-commando");
const discord = require("discord.js");
module.exports = class AvatarCommand extends commando.Command {
    constructor(client) {
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
        });
    }
    async run(message, args) {
        var user = args.target;
        var emb = new discord.RichEmbed();
        emb.setImage(user.user.avatarURL);
        emb.title = "Avatar for " + user.displayName;
        var chan = message.channel;
        return chan.sendEmbed(emb);
    }
};
//# sourceMappingURL=avatar.js.map