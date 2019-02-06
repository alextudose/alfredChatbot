
import * as excuse from 'huh';
import builder = require('claudia-bot-builder');
import {DynamoDB} from 'aws-sdk'
import {Dialogue} from './dialogue-builder'
import onboarding from './onboarding'
import {Logger, guid} from './utils/logger';
import altfredBot from './altfred-smart';


const claudiaBot = builder((message: any, apiRequest: any) => {
    const dynamo = new DynamoDB.DocumentClient();

    const logger = new Logger(async (msg: string) => {
        await dynamo.put({
            TableName: 'bot-users-log',
            Item: {id: Date.now().toString() + "//" + guid(), fbid: message.sender, msg: msg}
        }).promise();
    });

    try {
        const storage = {
            async retrieve() {
                const user = await dynamo.get({
                    TableName: 'pointless-bot-users',
                    Key: {fbid: message.sender},
                    ConsistentRead: true
                }).promise();
                return user.Item && user.Item['state'];
            },
            async store(state: Object) {
                await dynamo.put({
                    TableName: 'pointless-bot-users',
                    Item: {fbid: message.sender, state: state}
                }).promise();
            }

        }
        const dialogue = new Dialogue(onboarding, storage, logger, message.sender);

        dialogue.setKeywordHandler(['back', 'undo'], 'undo');
        dialogue.setKeywordHandler('reset', 'restart');
        
        return dialogue.consume(message, apiRequest).catch((e) => ['I have said all ' + JSON.stringify(e)]);

    } catch (error) {
        logger.error(error);
        logger.error(error.stack);
        return `${error} at ${error.stack}`;
    }
});




declare var module: any;
(module).exports = claudiaBot;