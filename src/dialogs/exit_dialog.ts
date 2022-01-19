import { ConversationState, MessageFactory, StatePropertyAccessor, TurnContext, UserState } from "botbuilder";
import { ComponentDialog, DialogContext, DialogSet, DialogTurnStatus, WaterfallDialog, WaterfallStepContext } from "botbuilder-dialogs";
import { CustomDialogInterface } from "../configs/interfacess";
import { Dialog } from "../configs/typess";


const ExitDialogId = 'ExitDialogId'
const ExitDialogWaterfallId = 'ExitDialogWaterfallId '

const TEXT_PROMPT = 'TEXT_PROMPT'
class ExitDialog extends ComponentDialog implements CustomDialogInterface {
    constructor(private dialogState: StatePropertyAccessor<Dialog>){
        super(ExitDialogId);

        this.addDialog(new WaterfallDialog(ExitDialogWaterfallId,[
            this.beginStep.bind(this),
            this.endStep.bind(this)
        ]))
    

        this.initialDialogId = ExitDialogWaterfallId;
    }

    async beginStep(stepContext: WaterfallStepContext) {
       
       return await stepContext.context.sendActivity(MessageFactory.text('You just exited the prompt'));
    }

    async endStep(stepContext: WaterfallStepContext){
       
        await stepContext.cancelAllDialogs(true);
        return await stepContext.endDialog();
    }

    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }
}

export {
    ExitDialogId,
    ExitDialog
}