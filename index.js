"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secret = require('./config.json');
const express = require('express');
const discord = require("discord.js");
const pckg_inf = require("./package.json");
const logger = require('./shardLogger.js');
const messageRecieving = require('./sharderMessageReciever.js');
function bootloaderLog(toLog) {
    console.log(`[Azure Bootloader] ${toLog}`);
}
function shardManagerLog(toLog) {
    console.log(`[Shard Manager] ${toLog}`);
}
console.log("  ____  _____  __ __  ____     ___\n" +
    " /    T|     T|  T  T|    \   /  _]\n" +
    "Y  o  |l__/  ||  |  ||  D  ) /  [_\n" +
    "|     ||   __j|  |  ||    / Y    _]\n" +
    "|  _  ||  /  ||  :  ||    \ |   [_\n" +
    "|  |  ||     |l     ||  .  Y|     T\n" +
    "l__j__jl_____j \__,_jl__j\_jl_____j\n");
bootloaderLog("Starting Sharding Manager....");
// Change this to an integer if you want custom shards.
var total_shards = null;
var sharder;
if (total_shards == null) {
    sharder = new discord.ShardingManager('shard.js', {
        respawn: true,
        token: secret.authToken
    });
}
else {
    sharder = new discord.ShardingManager('shard.js', {
        respawn: true,
        token: secret.authToken,
        totalShards: total_shards
    });
}
let masterServer = express();
masterServer.get('/shards', function (req, res) {
    var shards = {
        "global": {
            "version": pckg_inf.version,
            "author": pckg_inf.author,
            "shard_count": sharder.totalShards
        },
        "allShards": []
    };
    sharder.shards.array().forEach(function (item, index) {
        shards["allShards"].push({
            "id": item.id,
            "connection_port": secret.shardServersBasePort + item.id
        });
    });
    return res.send(shards);
});
// the only reason the log is outside of the callback is so that is shows before the launching message for the first shard
shardManagerLog("Global API now listening on port " + secret.masterServerPort + ".");
masterServer.listen(secret.masterServerPort);
sharder.on('launch', shard => shardManagerLog(`Launching shard ${shard.id}. ${(sharder.totalShards - sharder.shards.size) == 0 ? "All shards launched." : `Total shards launched: ${sharder.shards.size}. Shards remaining: ${sharder.totalShards - sharder.shards.size}`}`));
messageRecieving(sharder, function (sender, message) {
    if (message.EVENT === "CONNECTION_SUCCESS") {
        logger.log("Online. API listening on " + message.DATA.PORT, sender.id);
    }
    /*
     All current events:
     SHARD_API_LISTENING
     CONNECTION_SUCCESS
     SHARD_CREATE
     DATABASE_CONFIGURED
     */
    /*else if (message.EVENT === "SHARD_API_LISTENING") {
     logger.log("API listening at " + message.DATA.PORT, sender.id);
     }*/
});
sharder.spawn(this.totalShards).catch(function (err) {
    shardManagerLog("[Error] " + err);
});
