import { MessageFactory, StatePropertyAccessor, TurnContext } from "botbuilder";
import { ChoiceFactory, ChoicePrompt, ComponentDialog, DialogSet, DialogTurnStatus, ListStyle, TextPrompt, WaterfallDialog, WaterfallStepContext } from "botbuilder-dialogs";
import { CustomDialogInterface } from "../configs/interfacess";
import { Dialog } from "../configs/typess";
import LavaValidator from "../utils/lava_validator";

const ContactDialogId = 'ContactDialogId'

const ContactWaterfallId = 'ContactWaterfallId';
const EMAIL_PROMPT = 'EMAIL_PROMPT';

class ContactDialog extends ComponentDialog implements CustomDialogInterface{
    constructor(private dialogState: StatePropertyAccessor<Dialog>){
        super(ContactDialogId)

        this.addDialog(new TextPrompt(EMAIL_PROMPT, LavaValidator.emailValidator))
        this.addDialog(new WaterfallDialog(ContactWaterfallId, [
            this.beginStep.bind(this),
            this.summaryStepx.bind(this),
            this.endStep.bind(this),
        ]));

       this.initialDialogId = ContactWaterfallId;
    }


     async beginStep(stepContext: WaterfallStepContext){
        console.log('contactDialog --> beginStep')
       await stepContext.context.sendActivity(MessageFactory.text('You are already in the contact dialog'));
        const promptOptions = { prompt: 'Please enter your email.', retryPrompt: 'Pls enter a valid email' };
        return await stepContext.prompt(EMAIL_PROMPT, promptOptions);
    }

    async summaryStepx(stepContext: WaterfallStepContext){
        console.log('ContactDialog --> summaryStep')
        await this.dialogState.set(stepContext.context, {
            email: stepContext.result
        })
        return await stepContext.context.sendActivity('Contact Summary step concluded')

        
     }

     async endStep(stepContext: WaterfallStepContext){
        console.log('ContactDialog --> endStep')
        return stepContext.endDialog();
     }

        
    
     async run(turnContext: TurnContext, accessor: StatePropertyAccessor) {
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
    ContactDialogId,
    ContactDialog
}