import { Logger, LogLevel } from "@liftcl/node-commons";
import { LoggerBuilder, SlackTransport } from "@liftcl/node-logs";



export const createFileLoggerBuilder = (filename: string) => {
  return new LoggerBuilder("info")
    .addTimestampFormat("YYYY-MM-DD HH:mm:ss")
    .addErrorFormat()
    .addMetadataFormat()
    .addBasicFormat()
    .addDefaultRollingFileTransport("./var", filename, 'info');
}

export const logger = createFileLoggerBuilder("five9-api-connector").addConsoleTransport("info").build("five9-api-connector");

export const consoleLogger = new LoggerBuilder("info")
  .addTimestampFormat("YYYY-MM-DD HH:mm:ss")
  .addErrorFormat()
  .addBasicFormat()
  .addErrorFormat()
  .addConsoleTransport()
  .build("consoleLogger");

