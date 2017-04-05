import {Collection, Guild, RichEmbed, Shard, ShardingManager, VoiceConnection, Message} from "discord.js";
import {Command, CommandMessage, CommandoClient} from "discord.js-commando";

module.exports = class ShardDetailsCommand extends Command {
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
        })
    }

    isUsable(message: Message): boolean {
        return !(this.client.shard === null);
    }

    hasPermission(message: CommandMessage): boolean {
        return this.client.isOwner(message.author);
    }

    async run(message, args) {
        if (this.client.shard === null) {
            return message.reply("this client is running in development mode, so sharding is disabled.");
        }
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