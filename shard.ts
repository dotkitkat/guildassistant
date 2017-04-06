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
    unknownCommandResponse: true,
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
    ['kud', 'Kindly United Dreams'],
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
    var serv = express();
    serv.use(bodyParser.json());
    serv.use(bodyParser.urlencoded({
        extended: true
    }));

    serv.post('/set-game', function (req, res) {
        client.user.setGame(req.body.game).then(function () {
            res.send({
                "game": client.user.presence.game.name
            })
        });
    });

    serv.post('/set-username', function (req, res) {
        client.user.setUsername(req.body.username).then(function () {
            res.send({ "username": client.user.username });
        });
    });

    serv.get('/info', function (req, res) {
        let info = {
            "user": client.user,
            "avatarURL": client.user.avatarURL,
            "shard": {
                "shard_id": client.shard.id
            }
        };
        res.send(info)
    });

    serv.get('/private-info', function (req, res) {
        if (req.headers["auth"] != secret.authToken) {
            res.send({
                "error": "invalid_authentication"
            });
        }
        else {
            res.send({
                "auth": "success",
                "authentication_token": secret.authToken,
                "owner_id": secret.ownerId,
                "anilist_api_id": secret.anilistApiId,
                "anilist_api_secret": secret.anilistApiSecret
            });
        }
    });

    token = process.argv[4];
    finalCallback = function () {
        setInterval(function () {
            client.user.setGame(`[Shard ${client.shard.id + 1}/${client.shard.count}]`).catch(function () { });
        }, 10000);
        serv.listen(secret.shardServersBasePort + client.shard.id, function () {
            process.send({
                "EVENT": "CONNECTION_SUCCESS",
                "DATA": {
                    "PORT": secret.shardServersBasePort + client.shard.id
                }
            });
            logger.shardLog("Online. API listening on " + (secret.shardServersBasePort + client.shard.id), client.shard.id);
        });
    }
}
else {
    var serv = undefined;
    token = secret.authToken;
    finalCallback = function () {
        logger.shardLog("Online.", undefined);
    }
}

// Login
client.login(token).then(function () { finalCallback(); });