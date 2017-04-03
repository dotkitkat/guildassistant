module.exports = class shardLogger {
    static log(toLog, shardId) {
        console.log(`[Shard ${shardId}] ${toLog}`);
    }
    static error(toLog, shardId) {
        console.error(`[Shard ${shardId}] [Error] ${toLog}`);
    }
};
