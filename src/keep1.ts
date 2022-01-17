// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.

// import { ActivityHandler, ConversationState, MessageFactory, StatePropertyAccessor, TurnContext, UserState } from 'botbuilder';
// import { DialogContext, DialogSet, DialogTurnStatus } from 'botbuilder-dialogs';
// import { CustomBotInterface } from './configs/interfacess';
// import { Dialog } from './configs/typess';
// import { ContactDialog, ContactDialogId } from './dialogs/contact_dialog';
// import { ExitDialog } from './dialogs/exit_dialog';
// import { MainMenuDialog, MainMenuDialogId } from './dialogs/main_menu_dialog';

// export class LavaBot extends ActivityHandler implements CustomBotInterface {
//     dialogSet: DialogSet;
//     dialogContext: DialogContext;

//     constructor(private userState: UserState, private conversationState: ConversationState, private dialogState: StatePropertyAccessor) {
//         super();


//         //ADD ALL DIALOGS TO DIALOG SET
//         this.dialogSet = new DialogSet(dialogState);
//         this.dialogSet.add(new MainMenuDialog(dialogState));
//         this.dialogSet.add(new ContactDialog(dialogState))
//         this.dialogSet.add(new ExitDialog(dialogState))
       

//         this.onMessage(async (context, next) => {
//             await this.router(context);
//             next();
//         });

//         this.onMembersAdded(async (context, next) => {
//             const membersAdded = context.activity.membersAdded;
//             const welcomeText = 'Hello and welcome!';
//             for (const member of membersAdded) {
//                 if (member.id !== context.activity.recipient.id) {
//                     await context.sendActivity(MessageFactory.text(welcomeText, welcomeText)); 
//                 }
//             }
//             // By calling next() you ensure that the next BotHandler is run.
//             await next();
//         });
//     }

//     async router(context: TurnContext){
//         let message = context.activity.text;
//         this.dialogContext = await this.dialogSet.createContext(context);

//         if(message == 'Contact'){
//             await this.efficientRoute(this.dialogContext, ContactDialogId)
//         }else{
//             await this.efficientRoute(this.dialogContext, MainMenuDialogId)
//         }
//     }

//     async efficientRoute(dialogContext: DialogContext, dialogId: string){
//         const results = await dialogContext.continueDialog();
//         if (results.status === DialogTurnStatus.empty) {
//             await this.dialogContext.beginDialog(dialogId);
//         }
//     }
  
//     async run(context: TurnContext) {
//         await super.run(context);
//         await this.conversationState.saveChanges(context, true);
//         await this.userState.saveChanges(context, true);
//     }
// }
