"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogFactory = void 0;
const winston_1 = __importDefault(require("winston"));
const redisTransport = require('winston-redis');
const { combine, label, timestamp } = winston_1.default.format;
const DEFAULT_FORMAT = 'json';
class LogFactory {
    constructor(config) {
        this.logger = this.configure(config);
    }
    static getLogger(config) {
        if (!LogFactory.instance) {
            LogFactory.instance = new LogFactory(config);
        }
        return LogFactory.instance;
    }
    configure(config) {
        if (config) {
            const logFormat = config.has('log.format') ? config.get('log.format') : DEFAULT_FORMAT;
            const formatter = winston_1.default.format.json();
            let format = combine(formatter);
            const isTimestamp = config.has('log.notimestamp') ? false : true;
            format = isTimestamp ? combine(timestamp(), format) : format;
            let transport = config.has('log.redis') && config.get('log.redis') ? new redisTransport({ host: config.get('log.redis.host'), port: config.get('log.redis.port') }) : new winston_1.default.transports.File({ filename: 'application.log' });
            const logger = winston_1.default.createLogger({
                transports: [
                    new winston_1.default.transports.Console(),
                    transport
                ]
            });
            return logger;
        }
        const logger = winston_1.default.createLogger({
            transports: [
                new winston_1.default.transports.Console()
            ]
        });
        return logger;
    }
}
exports.LogFactory = LogFactory;
;
//export default LogFactory;
