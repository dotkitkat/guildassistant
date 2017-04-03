"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_commando_1 = require("discord.js-commando");
const util_1 = require("util");
const ytdl = require('ytdl-core');
const discord = require('discord.js');
const azureLog = require('../../shardLogger.js');
module.exports = class PlayCommand extends discord_js_commando_1.Command {
    constructor(client) {
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
                    prompt: 'What video would you like to play?'
                }
            ]
        });
    }
    async run(message, args) {
        var client = this.client;
        var chan = message.member.voiceChannel;
        if (util_1.isUndefined(chan)) {
            return message.reply("You're not in a voice channel! :anger:");
        }
        chan.join().then(function (vc_con) {
            var audio_stream = ytdl(args.video);
            var vc_handler = vc_con.playStream(audio_stream);
            vc_handler.once("end", function (reason) {
                vc_handler = null;
            });
        }).catch(function (err) {
            azureLog.log(err, client.shard.id);
            return message.reply("Failed to enter your voice channel :anger:");
        });
    }
};
