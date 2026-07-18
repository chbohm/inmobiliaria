import { AppConfig } from "./config";

//"ws_url": "wss://qa-matches.financeadvisors.com/ws/",

export const config: AppConfig = {
    "debug": true,
    "port": 8005,
    "five9": {
        "url": "https://api.five9.com",
        "orgId": "141868",
        "username": "${qa_five9|user}",
        "password": "${qa_five9|password}",
        "default_call_list": "Sandbox - Call List",

    },
    "rabbitmq": {
        "url": "amqp://root:rootpass@qa.rabbitmq.liftcl:5672",
        "exchange": "5c-multi-qa"
    },
    "delete_five9_contact_from_list": {
        "rabbitmq_routing_key": "delete-five9-contact-from-list-qa"
    },
    "alarm_manager_url": "https://qa.app.liftcl:8888"
    
}
