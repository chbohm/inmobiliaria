
import { LiftclAwsSecretManager } from "@liftcl/aws-secret-manager";
import { ConsoleLogger } from "@liftcl/node-logs";



// -----------------------------------------------------------------------------------------------
async function main() {
    let logger = new ConsoleLogger();
    try {
        let secretManager = new LiftclAwsSecretManager(logger);
        process.env['XXX'] = '${rds!db-818a7ed4-0000-4c74-9c82-ed7f7b87383d|username}'
        let result = await secretManager.revealEnvVarsSecrets();
        logger.info(`Secrets resolved: ${result['XXX']}`);
        require('./your_app_entry_point'); // Replace with the actual entry point of your application
    } catch (e) {
        logger.error(`Error starting application: ${e.message}`);
    }
}
main();
