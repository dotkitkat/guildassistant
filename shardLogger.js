module.exports = class shardLogger {
    static shardLog(toLog, shardId) {
        if (shardId === undefined && !(require('./config.json')["devEnvironment"])) {
            console.log(`[Shard Unknown] ${toLog}`);
        }
        else if (shardId === undefined && require('./config.json')["devEnvironment"]) {
            console.log(`[Client] ${toLog}`);
        }
    }
    static shardError(toLog, shardId) {
        console.error(`[Shard ${shardId}] [Error] ${toLog}`);
        this.shardLog("[Error] " + toLog, shardId);
    }
    static bootloaderLog(toLog) {
        console.log(`[Azure Bootloader] ${toLog}`);
    }
    static shardManagerLog(toLog) {
        console.log(`[Sharding Manager] ${toLog}`);
    }
};
//# sourceMappingURL=shardLogger.js.map