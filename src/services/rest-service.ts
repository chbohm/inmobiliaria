import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as fs from 'fs';

import * as path from 'path';
import { DeleteContactFromFive9ListRequest, Five9Contact, stringify } from '@liftcl/node-commons';
import swaggerUi from 'swagger-ui-express';
import { randomUUID } from 'crypto';
import { Injector } from '../app/injector';

import { Logger } from '@liftcl/node-logs';
import { AppConfig } from '../app/config';
import { HealthChecker } from '@liftcl/node-server-commons';
import { DeleteLeadFromFive9ListQueueConsumer } from './delete-lead-from-five9-list-queue-consumer';
import { BasicChecker } from '@liftcl/health-check';


const GIT_COMMIT_JSON = JSON.parse(fs.readFileSync('./git-commit.json', 'utf8'));

export class RestService {
    private app: express.Application;
    private config: AppConfig;
    private logger: Logger;
    private swaggerDocument: any;
    private healthChecker: HealthChecker;

    private injector: Injector;


    constructor(config: AppConfig, logger: Logger) {
        this.injector = Injector.getInstance();
        this.config = config;
        this.logger = logger;
        this.app = express();
        let checker = new Checker('DeleteLeadFromFive9ListQueueConsumer', this.injector.deleteLeadFromFive9ListConsumer);
        this.healthChecker = new HealthChecker('./git-commit.json', [checker]);
        this.loadSwaggerDocument();
        this.setupMiddleware();
        this.setupRoutes();
    }

    private loadSwaggerDocument(): void {
        try {
            const swaggerPath = path.join(process.cwd(), 'swagger.json');
            if (fs.existsSync(swaggerPath)) {
                this.swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
                this.logger.info('Swagger documentation loaded successfully');
            } else {
                this.logger.warn('swagger.json not found. Run "npm run swagger" to generate it.');
                this.swaggerDocument = null;
            }
        } catch (error) {
            this.logger.error('Error loading swagger.json', error);
            this.swaggerDocument = null;
        }
    }


    private setupMiddleware(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private setupRoutes(): void {
        // Swagger documentation endpoint
        if (this.swaggerDocument) {
            this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(this.swaggerDocument));
        }




        // ── Five9 endpoints ──
        this.app.get('/api/contact', this.handleGetContactByKey.bind(this));
        this.app.get('/api/contacts', this.handleGetContacts.bind(this));
        this.app.get('/api/contacts/list/:call_list', this.handleFive9GetContactByCallList.bind(this));
        this.app.post('/api/contacts/upsert', this.handleUpsertContactIntoList.bind(this));
        this.app.patch('/api/contacts', this.handlePatchUpdateContact.bind(this));
        this.app.post('/api/contacts/delete', this.handlePost_delete_contact_from_five9_list.bind(this));


        this.app.get('/health', this.handleHealthGet.bind(this));
        this.app.get('/version', this.handleVersionGet.bind(this));
    }


    private async handleUpsertContactIntoList(req: Request, res: Response): Promise<void> {

        try {
            const payload = req.body;
            const contact = await this.injector.five9Client.upsertContactToList(payload);
            if (!contact) {
                res.status(404).json({ success: false, message: 'Contact could not be created/updated' });
                return;
            }
            res.json({ success: true, data: contact });
        } catch (err: any) {
            const errorId = randomUUID();
            let error;
            if (!err?.status) {
                error = {
                    status: 500,
                    id: errorId,
                    message: err.message ? err.message : stringify(err)
                }
            } else {
                error = err;
                error.id = errorId;
            }
            res.status(error.status || 500).json(error);
            this.logger.error(`[${errorId}] Five9 getContact error: ${stringify(error)}`);

        }
    }

    private async handleGetContactByKey(req: Request, res: Response): Promise<void> {
        /* #swagger.tags = ['Five9']
          #swagger.description = 'Get a Five9 contact by a single key. Provide exactly one of UUID, clickId, or number1 as a query parameter.'
          #swagger.parameters['UUID'] = {
              in: 'query',
              description: 'Five9 contact UUID',
              required: false,
              type: 'string'
          }
          #swagger.parameters['clickID'] = {
              in: 'query',
              description: 'Click ID associated with the contact',
              required: false,
              type: 'string'
          }
          #swagger.parameters['number1'] = {
              in: 'query',
              description: 'Primary phone number of the contact',
              required: false,
              type: 'string'
          }
          #swagger.responses[200] = {
              description: 'Contact found',
              schema: {
                 success: true,
                 data: {
                     UUID: 'FF55630D-AF0C-0736-4F5F-10D15CF6E610',
                     number1: '2488914546',
                     first_name: 'Grant',
                     last_name: 'Jones'
                 }
              }
          }
          #swagger.responses[404] = {
              description: 'Contact not found',
              schema: { success: false, message: 'No contact found for UUID: ...' }
          }
          #swagger.responses[500] = {
              description: 'Internal error',
              schema: { id: 'error-id', success: false, message: 'Error message' }
          }
        */
        try {
            const UUID = req.query.UUID || req.query.uuid || req.query.lead_id;
            const clickID = req.query.clickID || req.query.clickId || req.query.click_id; // support both clickID and clickId
            const phone = req.query.phone || req.query.number1;

            let field: string | undefined;
            let value: string | undefined;

            if (typeof UUID === 'string') {
                field = 'UUID';
                value = UUID;
            } else if (typeof clickID === 'string') {
                field = 'clickID';
                value = clickID;
            } else if (typeof phone === 'string') {
                field = 'number1';
                value = phone;
            }
            const contacts = await this.injector.five9Client.searchContactsByKey(field, value);
            res.json(contacts);
        } catch (error: any) {
            const errorId = randomUUID();
            this.logger.error(`[${errorId}] Five9 getContact error: ${stringify(error)}`);
            res.status(500).json({ id: errorId, success: false, message: error.message });
        }
    }

    private async handleFive9GetContactByCallList(req: Request, res: Response): Promise<void> {
        /* #swagger.tags = ['Five9']
          #swagger.description = 'Get Five9 contacts by call list'
          #swagger.parameters['call_list'] = {
              in: 'path',
              description: 'Five9 call list name',
              required: true,
              type: 'string'
          }
          #swagger.responses[200] = {
              description: 'Contacts found for call list',
              schema: {
                 success: true,
                 data: [
                    {
                        UUID: 'FF55630D-AF0C-0736-4F5F-10D15CF6E610',
                        number1: '2488914546',
                        first_name: 'Grant',
                        last_name: 'Jones',
                        F9LastList: 'Fresh Leads Over 250 AUM'
                    }
                 ]
              }
          }
          #swagger.responses[404] = {
              description: 'No contacts found for call list',
              schema: { success: false, message: 'No contacts found for call list: ...' }
          }
          #swagger.responses[500] = {
              description: 'Internal error',
              schema: { id: 'error-id', success: false, message: 'Error message' }
          }
        */
        try {
            const { call_list } = req.params;
            const contacts = await this.injector.five9Client.searchByCallList(call_list);
            if (!contacts || contacts.length === 0) {
                res.status(404).json({ success: false, message: `No contacts found for call list: ${call_list}` });
                return;
            }
            res.json({ success: true, data: contacts });
        } catch (error: any) {
            const errorId = randomUUID();
            this.logger.error(`[${errorId}] Five9 getContactsByCallList error: ${stringify(error)}`);
            res.status(500).json({ id: errorId, success: false, message: error.message });
        }
    }

    private async handleGetContacts(req: Request, res: Response): Promise<void> {
        /* #swagger.tags = ['Five9']
           #swagger.description = 'Search contacts in Five9'
           #swagger.parameters['field'] = {
                in: 'query',
                description: 'Field name for filtering (e.g. number1, UUID)',
                required: false,
                type: 'string'
           }
           #swagger.parameters['value'] = {
                in: 'query',
                description: 'Field value for filtering',
                required: false,
                type: 'string'
           }
           #swagger.parameters['limit'] = {
                in: 'query',
                description: 'Maximum records to return (client-side cap)',
                required: false,
                type: 'integer'
           }
           #swagger.responses[200] = {
                description: 'Contacts returned',
                schema: {
                    success: true,
                    result: [
                        {
                            UUID: 'FF55630D-AF0C-0736-4F5F-10D15CF6E610',
                            number1: '2488914546',
                            first_name: 'Grant',
                            last_name: 'Jones'
                        }
                    ]
                }
           }
           #swagger.responses[500] = {
                description: 'Internal error',
                schema: { id: 'error-id', success: false, message: 'Error message' }
           }
        */
        try {
            const field = typeof req.query.field === 'string' ? req.query.field : undefined;
            const value = typeof req.query.value === 'string' ? req.query.value : undefined;

            const criteria = field && value ? { field, value } : undefined;
            const contacts = await this.injector.five9Client.searchContacts(criteria);
            res.json({ success: true, result: contacts });
        } catch (error: any) {
            const errorId = randomUUID();
            this.logger.error(`[${errorId}] Five9 getContact error: ${stringify(error)}`);
            res.status(500).json({ id: errorId, success: false, message: error.message });
        }
    }

    private async handlePost_delete_contact_from_five9_list(req: Request, res: Response): Promise<void> {
        try {
            // Body is parsed as JSON by bodyParser.json() middleware (Content-Type: application/json)
            const payload = req.body;
            this.logger.info('Received Delete Contact From Five9 List');
            this.logger.info(JSON.stringify(payload, undefined, 2));
            const result = await this.injector.five9Client.deleteContactFromList(payload as DeleteContactFromFive9ListRequest)
            this.logger.info(`Delete Contact From Five9 List processed successfully`);
            res.status(200).json({ success: true, result });
        } catch (error) {
            const errorId = Date.now();
            const status = error?.status || 500;
            this.logger.error(`Error processing Delete Contact From Five9 List: ${error.message}`, error);
            res.status(status).json({ id: errorId, success: false, message: error?.message || 'An error occurred' });
        }
    }

    private async handlePatchUpdateContact(req: Request, res: Response): Promise<void> {
        /* #swagger.tags = ['Five9']
           #swagger.description = 'Patch/update a Five9 contact. It patches only the provided fields. Needs at least UUID or number1 to identify the contact. Send null to clear a field in Five9.'
           #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    UUID: 'FF55630D-AF0C-0736-4F5F-10D15CF6E610',
                    number1: '2488914546',
                    number2: null,
                    number3: '',
                    email: 'updated@example.com',
                    first_name: 'Grant',
                    last_name: 'Jones',
                    company: '',
                    street: '',
                    city: '',
                    state: '',
                    zip: '',
                    '7de63d97-d2a9-4dae-b3b8-080ca2660eda': '',
                    'f230984b-b8fc-407f-8a8c-bbe4b21733cc': '',
                    '9fb3311c-f5ab-4ce7-a52b-f5f3c9de5a81': '',
                    Age: '',
                    'Has Financial Advisor': '',
                    'Risk Tolerance': '',
                    Income: '',
                    'User Provided AUM': '',
                    'Calculated AUM': '',
                    'Validated AUM': '',
                    'Investment Experience': '',
                    'Investment Goals': '',
                    '401k Question': '',
                    '401k Amount': '',
                    'IRA Question': '',
                    'IRA Amount': '',
                    'Mutualfund ETFs Question': '',
                    'MutualFunds ETFs Amount': '',
                    'Tax Loss Question': '',
                    'Capital Gains Question': '',
                    'RMD Question': '',
                    'Trust Estate Question': '',
                    'Retirement Timeline': '',
                    'Cash Amount': '',
                    'Real Estate Amount': '',
                    'Brokerage Question': '',
                    'Brokerage Amount': '',
                    hs_contact_id: '',
                    phone_echo: '',
                    ani_update: '',
                    ani_phone_echo: '',
                    ani_identifier: '',
                    subid2: '',
                    F9LastList: '',
                    F9CreateDate: '',
                    F9CampaignAttempts: '',
                    'Create Date': '',
                    'Create Agent': '',
                    'Create Time': '',
                    'Voicemail Count': '',
                    'Appointment Date': '',
                    'Appointment Time': '',
                    'Appointment Agent': '',
                    'Appointment Status': '',
                    'Appointment Summary': '',
                    'Sales Rep ID': '',
                    'Validated Phone': '',
                    clickID: '',
                    marketAUM: '',
                    validationFlag: '',
                    leadCreate: '',
                    leadStatus: '',
                    trafficSourceID: '',
                    campaignID: '',
                    landerID: '',
                    buyerOne: '',
                    buyerTwo: '',
                    buyerThree: ''
                }
           }
           #swagger.responses[200] = {
                description: 'Contact updated',
                schema: {
                    success: true,
                    result: [
                        {
                            ok: true,
                            list: 'CRM_ONLY',
                            crm_records_updated: 1,
                            upload_errors: 0
                        }
                    ]
                }
           }
           #swagger.responses[400] = {
                description: 'Invalid request',
                schema: { success: false, message: 'Provide at least UUID or number1 in payload' }
           }
           #swagger.responses[500] = {
                description: 'Internal error',
                schema: { id: 'error-id', success: false, message: 'Error message' }
           }
        */
        try {
            const payload = req.body as Partial<Five9Contact>;
            if (!payload || (typeof payload !== 'object')) {
                res.status(400).json({ success: false, message: 'Request body is required' });
                return;
            }

            if (!payload.UUID && !payload.number1) {
                res.status(400).json({ success: false, message: 'Provide at least UUID or number1 in payload' });
                return;
            }

            const result = await this.injector.five9Client.updateFieldsInContact(payload);
            res.status(200).json({ success: true, result });
        } catch (error: any) {
            const errorId = randomUUID();
            const status = error?.status || 500;
            this.logger.error(`[${errorId}] Five9 patch contact error: ${stringify(error)}`);
            res.status(status).json({ id: errorId, success: false, message: error?.message || 'An error occurred' });
        }
    }


    private async handleVersionGet(req: Request, res: Response): Promise<void> {
        /* #swagger.tags = ['System']
           #swagger.description = 'Returns the  version of the component'
           #swagger.responses[200] = {
               description: 'Returns the version of the component',
               schema: { success: true, component: 'leads-router', image: '', commit: '', commit_timestamp: '', branch: '', version: '' }
           }
        */
        res.status(200).json({ success: true, ...GIT_COMMIT_JSON });
    }

    private async handleHealthGet(req: Request, res: Response): Promise<void> {
        /* #swagger.tags = ['System']
           #swagger.description = 'Returns the health status of the application. Returns 500 if any health check is failing (e.g. stuck leads or suppression list update errors).'
           #swagger.responses[200] = {
               description: 'All health checks passed',
               schema: { success: true, status: 'ok' }
           }
           #swagger.responses[500] = {
               description: 'One or more health checks failed',
               schema: { success: false, status: 'failed' }
           }
        */
        res.status(200).json({ success: true, status: 'ok', ...GIT_COMMIT_JSON });
    }



    public async start(): Promise<void> {
        await this._start();
    }



    public async _start(): Promise<void> {
        //await checkPortAvailable(this.config.port, this.logger);
        return new Promise((resolve, reject) => {
            const server = this.app.listen(this.config.port, () => {
                console.log(`RestService running on port ${this.config.port}`);
                resolve();
            });
            server.on('error', (error) => {
                this.logger.error(`Failed to start RestService: ${error.message}`);
                reject(error);
            });
        });
    }


    public getApp(): express.Application {
        return this.app;
    }
}


class Checker extends BasicChecker {
    constructor(name: string, private deleteLeadFromFive9ListConsumer: DeleteLeadFromFive9ListQueueConsumer) {
        super(name);
    }

    async checks(): Promise<void> {
        const status = this.deleteLeadFromFive9ListConsumer.getHealthStatus();
        if (!status.connected) {
            throw {
                status: 500,
                message: `DeleteLeadFromFive9ListQueueConsumer not healthy: ${status}`,
                details: status
            }
        }

    }
}