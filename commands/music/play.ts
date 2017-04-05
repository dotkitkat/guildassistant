import {Command, CommandMessage, CommandoClient} from "discord.js-commando";
import {Guild, Message, VoiceConnection} from "discord.js";
import {isUndefined} from "util";
const ytdl = require('ytdl-core');
const discord = require('discord.js');
const azureLog = require('../../shardLogger.js');
module.exports = class PlayCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'play',
            memberName: 'play',
            group: 'music',
            description: 'Searches YouTube for a video and then plays it. (Can also take direct links)',
            guildOnly: true,
            args: [
                {
                    key: 'video',
                    type: 'string',
                    prompt: 'what video would you like to play?'
                }
            ]
        })
    }

    async run(message: CommandMessage, args): Promise<any> {
        var client = this.client;
        var chan = message.member.voiceChannel;
        if (isUndefined(chan)) {
            return message.reply("You're not in a voice channel! :anger:")
        }
        chan.join().then(function (vc_con: VoiceConnection) {
            var audio_stream = ytdl(args.video);
            var vc_handler = vc_con.playStream(audio_stream);
            vc_handler.once("end", function (reason) {
                vc_handler = null;
            })
        }).catch(function (err) {
            azureLog.log(err, client.shard.id);
            return message.reply("Failed to enter your voice channel :anger:")
        });
    }
};