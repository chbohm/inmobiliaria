import { RestService } from "../service/rest-service";
import { ConfigManager } from '../common/ConfigManager';

import { LogLevel, RabbitMQConfig, stringify } from "@liftcl/node-commons";
import { Five9SoapClient } from "../clients/five9-soap-client";
import { AppConfig, AppConfigSchema } from "./config";
import { logger } from "../common/logger";
import { LiftclAwsSecretManager } from "@liftcl/aws-secret-manager";
import { DeleteLeadFromFive9ListQueueConsumer } from "../service/delete-lead-from-five9-list-queue-consumer";
import { HealthChecker } from "@liftcl/health-check";
import { readFileSync } from "fs";
import { AlarmsClient, RabbitMQConsumerConfig } from "@liftcl/node-server-commons";

const GIT_COMMIT_JSON = JSON.parse(readFileSync('./git-commit.json', 'utf-8'));

export class Injector {
    public static INSTANCE: Injector;

    private config: AppConfig;
    private restService: RestService;
    public five9Client: Five9SoapClient;
    public deleteLeadFromFive9ListConsumer: DeleteLeadFromFive9ListQueueConsumer;
    public healthChecker: HealthChecker;

    public alarmManager: AlarmsClient; // Placeholder for AlarmManager, you can replace 'any' with the actual type when implemented




    private isStartingUp: boolean = true;

    private constructor() {


        process.on('uncaughtException', (err) => {
            logger.error(`There was an uncaught error: ${err.message}`);
            if (this.isStartingUp) {
                process.exit(1);
            }
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error(`Unhandled Rejection at: ${stringify(promise)} : ${stringify(reason)}`);
            if (this.isStartingUp) {
                process.exit(1);
            }
        });


    }

    public static getInstance(): Injector {
        if (!Injector.INSTANCE) {
            Injector.INSTANCE = new Injector();
        }
        return Injector.INSTANCE;
    }

    public async init() {
        this.isStartingUp = true;


        logger.info('');
        logger.info('___________________________________________________________________________');
        logger.info('                        Starting Five9 Api Connector                       ');
        logger.info('___________________________________________________________________________');
        logger.info('');

        let configRaw = ConfigManager.getConfig();

        logger.info("Config loaded successfully");

        logger.info(stringify(JSON.parse(configRaw), undefined, 2));


        let secretManager = new LiftclAwsSecretManager(logger.createChild("ConfigManager"));
        let configWithSecrets = await secretManager.injectSecretsIntoStr(configRaw)


        let configValidation = AppConfigSchema.safeParse(JSON.parse(configWithSecrets));
        if (!configValidation.success) {
            logger.error("Config validation failed with the following errors:");
            throw new Error(`Error in config validation: ${stringify(configValidation.error.issues)}`);
        }
        this.config = configValidation.data as AppConfig;

        this.alarmManager = new AlarmsClient({
            componentId: 'five9-api-connector',
            baseUrl: this.config.alarm_manager_url
        });

        this.five9Client = new Five9SoapClient(this.config.five9, logger);

        this.deleteLeadFromFive9ListConsumer = new DeleteLeadFromFive9ListQueueConsumer(this.five9Client, logger.createChild('DeleteLeadFromFive9ListQueueConsumer'));
        this.deleteLeadFromFive9ListConsumer.setAlarmClient(this.alarmManager.createChild('delete-lead-from-five9-list-queue-consumer'))
        if (this.config.rabbitmq && this.config.delete_five9_contact_from_list?.rabbitmq_routing_key) {
            await this.deleteLeadFromFive9ListConsumer.startProcessing(this.createConsumer(this.config.rabbitmq, this.config.delete_five9_contact_from_list.rabbitmq_routing_key));
        }

        this.restService = new RestService(this.config, logger);
        await this.restService.start();
        logger.info("Five9 Api Connector started successfully");
        this.isStartingUp = false;
    }

    private createConsumer(rabbitmq: RabbitMQConfig, routingKey: string): RabbitMQConsumerConfig {
        return {
            url: rabbitmq.url,
            queue: `${rabbitmq.exchange}-${routingKey}-queue`,
            exchange: rabbitmq.exchange,
            exchangeType: 'direct',
            routingKey: routingKey,
            durable: true,
            prefetchCount: 1,
            noAck: false
        };
    }

}