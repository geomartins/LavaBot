// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, ConversationState, MessageFactory, StatePropertyAccessor, TurnContext, UserState } from 'botbuilder';
import { DialogContext, DialogSet } from 'botbuilder-dialogs';
import { CustomBotInterface } from './configs/interfacess';
import Routerr from './routerr';
import { LuisService } from './services/luis_service';
import { QnAMaker } from 'botbuilder-ai';
import { QnamakerService } from './services/qnamaker_service';


export class LavaBot extends ActivityHandler implements CustomBotInterface {
    dialogContext: DialogContext;
    luisService: LuisService;
    qnamakerService: QnamakerService;

    constructor(private userState: UserState, private conversationState: ConversationState, private dialogState: StatePropertyAccessor, private dialogSet: DialogSet) {
        super();

        this.luisService = new LuisService();
        this.qnamakerService = new QnamakerService();
      
       
        this.onMessage(async (context, next) => {
            this.dialogContext = await this.dialogSet.createContext(context);

           console.log(` This is the ${await this.luisService.topIntent(context)}`);

           let answer = await this.qnamakerService.getAnswers(context)
           console.log(`Qna answer ${answer}`);

            await new Routerr(this.dialogContext, this.dialogSet).run(context);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText)); 
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
  
    async run(context: TurnContext) {
        await super.run(context);
        await this.conversationState.saveChanges(context, true);
        await this.userState.saveChanges(context, true);
    }
}
