module.exports = class shardLogger {
    static log(toLog: string, shardId: number) {
        console.log(`[Shard ${shardId}] ${toLog}`)
    }

    static error(toLog: string, shardId: number) {
        console.log(`[Shard ${shardId}] [Error] ${toLog}`);
    }
};