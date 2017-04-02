import commando = require('discord.js-commando');
const secret = require('./config.json');
import sqlite = require('sqlite')
import path = require('path')
import {Message} from "discord.js";
import construct = Reflect.construct;
import express = require('express')
const bodyParser = require('body-parser');
import discord = require('discord.js');
const logger = require('./shardLogger.js');
const ytdl = require('ytdl-core');

// Azure bot shard - do not directly reference - created multiple times for sharding.

const client: commando.CommandoClient = new commando.CommandoClient({
    owner: secret.ownerId
});


const shardUtil: discord.ShardClientUtil = new discord.ShardClientUtil(client);
const shardId = shardUtil.id;

logger.log("Starting Azure Shard...", shardId);

// Configure database
client.setProvider(sqlite.open(path.join(__dirname, 'azure.sqlite3')).then(db => new commando.SQLiteProvider(db)))
    .then(function () {
        logger.log("Database configured.", shardId);
        logger.log("Ready.", shardId)
    })
    .catch(console.error);

module.exports = client;

// Command groups   
const commandGroups: string[][] = [
    ['info', 'Information'],
    ['kud', 'Kindly United Dreams'],
    ['web', 'Internet'],
    ['shards', 'Sharding'],
    ['music', 'Music'],
    ['fun', 'Fun'],
    ['admin', 'Admin']
];

// Register commands
client.registry
    .registerGroups(commandGroups)
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

// Configure events
// No custom events (yet)

// Configure web server
// start azure SHARD api
let serv = express();
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
        res.send({"username": client.user.username});
    });
});

serv.get('/info', function (req, res) {
    let info = {
        "user": client.user,
        "avatarURL": client.user.avatarURL,
        "owner": client.owners[0],
        "shard": {
            "shard_id": client.shard.id
        }
    };
    res.send(info)
});

serv.get('/status', function (req, res) {
    res.send('under_construction');
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

// Login
client.login(process.argv[4]).then(function () {
    setInterval(function () {
        client.user.setGame("[Shard " + (client.shard.id + 1) + "/" + client.shard.count + "]").catch(function () {
        });
    }, 10000);
    serv.listen(secret.shardServersBasePort + client.shard.id, function () {
        logger.log("Azure API (Shard " + client.shard.id + ") listening on port " + (secret.shardServersBasePort + client.shard.id) + ".", client.shard.id);
    });
});