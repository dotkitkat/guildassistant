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
    ['web', 'Internet'],
    ['shards', 'Sharding'],
    ['music', 'Music'],
    ['fun', 'Fun'],
    ['joinableroles', 'Joinable Roles']
];

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