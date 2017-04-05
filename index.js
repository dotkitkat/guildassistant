"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secret = require('./config.json');
const express = require('express');
const discord = require("discord.js");
const pckg_inf = require("./package.json");
const logger = require('./shardLogger.js');
const messageRecieving = require('./sharderMessageReciever.js');
var keymetrics = require('pmx').probe();
console.log("  ____  _____  __ __  ____     ___\n" +
    " /    T|     T|  T  T|    \   /  _]\n" +
    "Y  o  |l__/  ||  |  ||  D  ) /  [_\n" +
    "|     ||   __j|  |  ||    / Y    _]\n" +
    "|  _  ||  /  ||  :  ||    \ |   [_\n" +
    "|  |  ||     |l     ||  .  Y|     T\n" +
    "l__j__jl_____j \__,_jl__j\_jl_____j\n");
var devEnvironment = secret["devEnvironment"];
if (!devEnvironment) {
    logger.bootloaderLog("Starting Sharding Manager....");
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
    let master = express();
    master.get('/shards', function (req, res) {
        var shards = {
            "global": {
                "version": pckg_inf.version,
                "author": pckg_inf.author,
                "shard_count": sharder.totalShards,
                "shards_online": sharder.shards.size
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
    logger.shardManagerLog("Global API now listening on port " + secret.masterServerPort + ".");
    master.listen(secret.masterServerPort);
    sharder.on('launch', shard => logger.shardManagerLog(`Launching shard ${shard.id}. ${(sharder.totalShards - sharder.shards.size) == 0 ? "All shards launched." : `Total shards launched: ${sharder.shards.size}. Shards remaining: ${sharder.totalShards - sharder.shards.size}`}`));
    var totalShardsKeymetrics = keymetrics.metric({
        name: 'Shards Online',
        value: function () {
            return sharder.shards.size;
        }
    });
    messageRecieving(sharder, function (sender, message) {
        if (message.EVENT === "CONNECTION_SUCCESS") {
            logger.log("Online. API listening on " + message.DATA.PORT, sender.id);
        }
        /*
         All current events:
         Event Title | Data Sent: Data Type
         CONNECTION_SUCCESS | PORT: number (Shard API port that it is now listening on)
         SHARD_INIT
         */
    });
    sharder.spawn(this.totalShards).catch(function (err) {
        logger.shardManagerLog("[Spawning Error] " + err);
    });
}
else {
    logger.bootloaderLog("Development environment initialized. In this specialized environment, all sharding functions & all APIs have been disabled.");
    logger.bootloaderLog("Sharding disabled. Starting Azure client...");
    // dirty fix
    require('./shard.js');
}
//# sourceMappingURL=index.js.map