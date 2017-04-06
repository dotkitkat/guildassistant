import {Guild, RichEmbed, Shard, ShardClientUtil, ShardingManager} from "discord.js";
import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
const logger = require('../../shardLogger.js');
import restrictions from '../../commandmeta/restrictions.js';
import CustomCommand from '../../commandmeta/customcommand.js';

module.exports = class ShardsCommand extends CustomCommand {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'shards',
            memberName: 'shards',
            description: 'Gets all available shards.',
            group: 'shards'
        }, {
            ownerOnly: true,
            shardOnly: true
        });
    };

    async run(message, args): Promise<any> {
        if (this.client.shard === null) {
            return message.reply("this client is running in development mode, so sharding is disabled.");
        }
        const client = this.client;
        this.client.shard.fetchClientValues("guilds.size").then(function (results: Array<number>) {
            var processed = 0;
            var guildResult: string[] = [];
            results.forEach(function (item: number, index: number) {
                guildResult.push(`[Shard ${index + 1}]: ${item} guilds connected.`);
                processed++;
                if (processed === results.length) {
                    var embed: RichEmbed = new RichEmbed();
                    embed.title = "Shards Overview";
                    var proc = 0;
                    results.forEach(function (item: number, index: number) {
                        embed.addField("Shard " + (index + 1), item + " guilds connected.", true);
                        proc++;
                        if (proc == results.length) {
                            embed.addField("Current Shard", "Shard " + (client.shard.id + 1)), true;
                            return message.replyEmbed(embed);
                        }
                    });
                }
            })
        });
    }
};