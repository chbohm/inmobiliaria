import { stringify } from "@liftcl/node-commons";

import { Injector } from "./injector";
import { LiftclAwsSecretManager } from "@liftcl/aws-secret-manager";
import { log } from "console";
import { logger } from "../common/logger";

let injector: Injector
async function _main() {
    injector = Injector.getInstance();
    await injector.init();
}

// -----------------------------------------------------------------------------------------------
async function main() {

    try {
        await _main();
    } catch (e) {
        logger.error(`${stringify(e)}`);
    }
}
main();
