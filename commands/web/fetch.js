"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commando = require("discord.js-commando");
const discord = require("discord.js");
module.exports = class FetchCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'fetch',
            group: 'web',
            memberName: 'fetch',
            description: 'Fetchs data from the Internet.',
            args: [
                {
                    type: 'string',
                    key: 'target',
                    prompt: 'Where would you like to get data from?'
                }
            ]
        });
    }
    async run(message, args) {
        fetch(args.target).then(function (response) {
            response.text().then(function (responseData) {
                let emb = new discord.RichEmbed();
                emb.title = "Fetch Results";
                emb.setDescription("JavaScript `fetch` completed.");
                emb.addField("Target", args.target);
                emb.addField("Result", "```" + responseData + "```");
                return message.replyEmbed(emb);
            }).catch(function () {
                return message.reply("Failed to read returned data!");
            });
        }).catch(function () {
            return message.reply("Failed to fetch data!");
        });
    }
};
