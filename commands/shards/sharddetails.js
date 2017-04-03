"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
module.exports = class ShardDetailsCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'sharddetails',
            group: 'shards',
            memberName: 'sharddetails',
            description: 'Gets details for a shard.',
            args: [
                {
                    key: "targetShard",
                    type: 'integer',
                    prompt: 'What shard number would you like information for?'
                }
            ]
        });
    }
    hasPermission(message) {
        return this.client.isOwner(message.author);
    }
    async run(message, args) {
        var client = this.client;
        var embed = new discord_js_1.RichEmbed();
        var newsv = args.targetShard - 1;
        embed.setTitle("Details for Shard " + args.targetShard);
        if (args.targetShard > client.shard.count || args.targetShard < 0) {
            return message.reply("Invalid shard! :anger:");
        }
        else {
            var guilds = client.shard.fetchClientValues("guilds.size").then(function (response) {
                var g = response[newsv];
                embed.addField("Guilds", g, true);
                var pings = client.shard.fetchClientValues("ping").then(function (response) {
                    var b = response[newsv];
                    embed.addField("Average Heartbeat Ping", (b + "ms"), true);
                    return message.replyEmbed(embed);
                });
            });
        }
    }
};
