const secret = require('./config.json');
import sqlite = require('sqlite')
import path = require('path')
import { Message, WSEventType } from "discord.js";
import express = require('express')
const bodyParser = require('body-parser');
import discord = require('discord.js');
const logger = require('./shardLogger.js');
const ytdl = require('ytdl-core');
import commando = require('discord.js-commando');
import request = require('request');

// Azure bot shard - do not directly reference - created multiple times for sharding.

var opt: commando.CommandoClientOptions = {
    disableEveryone: true,
    commandPrefix: '~',
    commandEditableDuration: 0,
    nonCommandEditable: false,
    unknownCommandResponse: false,
    owner: secret['ownerId'],
    disabledEvents: [ 'TYPING_START' ]
}

const client: commando.CommandoClient = new commando.CommandoClient(opt);

if (!secret['devEnvironment']) {
    process.send({
        "EVENT": "SHARD_INIT"
    });
}

// Command groups   
const commandGroups: string[][] = [
    ['info', 'Information'],
    ['guild', 'Guild'],
    ['shards', 'Sharding'],
    ['music', 'Music'],
    ['joinableroles', 'Joinable Roles'],
    ['channelconfig', 'Channel Config']
];

client.on('guildMemberAdd', function (member: discord.GuildMember) {
    var logchan: string = client.provider.get(member.guild, 'logChannel', 'none')
    if (!(logchan === 'none')) {
        var g: discord.GuildChannel = member.guild.channels.get(logchan);
        if ([null, undefined].includes(g)) {
            return;
        }
        else {
            (g as discord.TextChannel).sendMessage("Member `" + member.displayName + "` has joined `" + member.guild.name + "`!");
        }
    }
    else {
        return;
    }
});

client.on('guildMemberRemove', function (member: discord.GuildMember) {
    var logchan: string = client.provider.get(member.guild, 'logChannel', 'none')
    if (!(logchan === 'none')) {
        var g: discord.GuildChannel = member.guild.channels.get(logchan);
        if ([null, undefined].includes(g)) {
            return;
        }
        else {
            (g as discord.TextChannel).sendMessage("Member `" + member.displayName + "` has left `" + member.guild.name + "`!");
        }
    }
    else {
        return;
    }
})

const pasteApiAddr = 'https://paste.safe.moe/documents';

client.on('messageDelete', function (message: discord.Message) {
    request({
        method: 'POST',
        uri: pasteApiAddr,
        json: false,
        body: message.content
    }, function (error, response, body) {
        console.log('resp: ' + response);
        console.log('statCode: ' + response.statusCode);
        console.log('body: ' + body);
        if (response.statusCode === 200) {
            //return message.reply('Message deleted. Author: ' + message.author.username + '. Paste.safe.moe link: https://paste.safe.moe/' + body.key);
            var chan = client.provider.get(message.guild, 'messageLogChannel', 'none')
            if (chan === 'none') {
                return;
            }
            else {
                var chanG: discord.GuildChannel = message.guild.channels.get(chan);
                if ([null, undefined].includes(chanG)) {
                    return;
                }
                else {
                    var chanT: discord.TextChannel = chanG as discord.TextChannel;
                    chanT.sendMessage('Message deleted. Author: ' + message.author.username + '. Pastebin link: https://paste.safe.moe/' + JSON.parse(body).key);
                }
            }
    }
        else {
            return;
        }
    })
})

// Register commands
client.registry
    .registerGroups(commandGroups)
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

// Configure events
// No custom events (yet)

// Configure db
client.setProvider(
    sqlite.open(path.join(__dirname, 'azure.sqlite3')).then(db => new commando.SQLiteProvider(db))
).catch(function (err) {
    logger.shardError(err, function () {
        if (secret["devEnvironment"]) return undefined;
        else return client.shard.id;
    });
});

// Configure shard API (if not in a development environment)
var token;
var finalCallback;
if (!secret['devEnvironment']) {
    token = process.argv[4];
    finalCallback = function () {
        setInterval(function () {
            client.user.setGame(`[Shard ${client.shard.id + 1}/${client.shard.count}]`).catch(function () { });
        }, 10000);
        logger.shardLog("Online.", client.shard.id);
    }
}
else {
    token = secret.authToken;
    finalCallback = function () {
        logger.shardLog("Online.", undefined);
    }
}

// Login
client.login(token).then(function () { finalCallback(); });