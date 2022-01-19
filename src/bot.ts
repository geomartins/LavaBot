// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, ConversationState, MessageFactory, StatePropertyAccessor, TurnContext, UserState } from 'botbuilder';
import { DialogContext, DialogSet, DialogTurnStatus } from 'botbuilder-dialogs';
import { CustomBotInterface } from './configs/interfacess';
import { Dialog } from './configs/typess';
import { ContactDialog, ContactDialogId } from './dialogs/contact_dialog';
import { ExitDialog, ExitDialogId } from './dialogs/exit_dialog';
import { MainMenuDialog, MainMenuDialogId } from './dialogs/main_menu_dialog';
import Routerr from './routerr';

export class LavaBot extends ActivityHandler implements CustomBotInterface {
    dialogContext: DialogContext;

    constructor(private userState: UserState, private conversationState: ConversationState, private dialogState: StatePropertyAccessor, private dialogSet: DialogSet) {
        super();

        this.onMessage(async (context, next) => {
            this.dialogContext = await this.dialogSet.createContext(context);
            
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
