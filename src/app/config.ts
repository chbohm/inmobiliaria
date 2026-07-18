
import { RabbitMQConfigSchema } from '@liftcl/node-commons';
import { Five9ConnectorConfigSchema, ServiceEndpointSchema } from '@liftcl/node-server-commons';
import { z } from 'zod';






export const AppConfigSchema = z.object({
    port: z.number(),
    debug: z.boolean().optional().default(false),
    five9: Five9ConnectorConfigSchema,
    rabbitmq: RabbitMQConfigSchema,
    delete_five9_contact_from_list: z.object({
        rabbitmq_routing_key: z.string()
    }),
    alarm_manager_url: z.string().optional()
});

export type Five9Config = z.infer<typeof Five9ConnectorConfigSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
export type ServiceEndpointConfig = z.infer<typeof ServiceEndpointSchema>;