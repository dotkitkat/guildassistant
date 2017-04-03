"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_js_commando_1 = require("discord.js-commando");
const logger = require('../../shardLogger.js');
module.exports = class ShardsCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'shards',
            memberName: 'shards',
            description: 'Gets all available shards.',
            group: 'shards'
        });
    }
    ;
    hasPermission(message) {
        return this.client.isOwner(message.author);
    }
    async run(message, args) {
        const client = this.client;
        this.client.shard.fetchClientValues("guilds.size").then(function (results) {
            var processed = 0;
            var guildResult = [];
            results.forEach(function (item, index) {
                guildResult.push(`[Shard ${index + 1}]: ${item} guilds connected.`);
                processed++;
                if (processed === results.length) {
                    var embed = new discord_js_1.RichEmbed();
                    embed.title = "Shards Overview";
                    var proc = 0;
                    results.forEach(function (item, index) {
                        embed.addField("Shard " + (index + 1), item + " guilds connected.", true);
                        proc++;
                        if (proc == results.length) {
                            embed.addField("Current Shard", "Shard " + (client.shard.id + 1)), true;
                            return message.replyEmbed(embed);
                        }
                    });
                }
            });
        });
    }
};
