import {Collection, Guild, RichEmbed, Shard, ShardingManager, VoiceConnection, Message} from "discord.js";
import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import restrictions from '../../commandmeta/restrictions.js';
import CustomCommand from '../../commandmeta/customcommand.js';

module.exports = class ShardDetailsCommand extends CustomCommand {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'sharddetails',
            group: 'shards',
            memberName: 'sharddetails',
            description: 'Gets details for a shard.',
            args: [
                {
                    key: "targetShard",
                    type: 'integer',
                    prompt: 'what shard number would you like information for?'
                }
            ]
        }, {
            shardOnly: true,
            ownerOnly: true
        });
    }

    async run(message, args) {
        var client = this.client;
        var embed: RichEmbed = new RichEmbed();
        var newsv = args.targetShard - 1;
        embed.setTitle("Details for Shard " + args.targetShard);
        if (args.targetShard > client.shard.count || args.targetShard < 0) {
            return message.reply("invalid shard! :anger:")
        }
        else {
            var guilds = client.shard.fetchClientValues("guilds.size").then(function (response: Array<number>) {
                var g = response[newsv];
                embed.addField("Guilds", g, true);
                var pings = client.shard.fetchClientValues("ping").then(function (response: Array<number>) {
                    var b = response[newsv];
                    embed.addField("Average Heartbeat Ping", (b + "ms"), true);
                    return message.replyEmbed(embed);
                });
            });
        }
    }
};