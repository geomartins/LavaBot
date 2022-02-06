import { StatePropertyAccessor, TurnContext } from "botbuilder";
import { ChoiceFactory, ChoicePrompt, ComponentDialog, DialogSet, DialogTurnStatus, ListStyle, WaterfallDialog, WaterfallStepContext } from "botbuilder-dialogs";
import { CustomDialogInterface } from "../configs/interfacess";
import { Dialog } from "../configs/typess";
import Appointment from "../models/appointment";
import Routerr from "../routerr";
import { AppointmentDialog, AppointmentDialogId } from "./appointment_dialog";
import { ContactDialogId } from "./contact_dialog";

const MainMenuDialogId = 'MainMenuDialogId'

const MAIN_MENU_WATER_FALL = 'MAIN_MENU_WATER_FALL';
const MENU_PROMPT = 'MENU_PROMPT';

class MainMenuDialog extends ComponentDialog implements CustomDialogInterface{
    constructor(private dialogState: StatePropertyAccessor<Dialog>){
        super(MainMenuDialogId)

        this.addDialog(new ChoicePrompt(MENU_PROMPT))
        this.addDialog(new AppointmentDialog(dialogState))
        this.addDialog(new WaterfallDialog(MAIN_MENU_WATER_FALL, [
            this.beginStep.bind(this),
            this.endStep.bind(this),
           
        ]));

       this.initialDialogId = MAIN_MENU_WATER_FALL;
    }


     async beginStep(stepContext: WaterfallStepContext){
         console.log('MainMenuDialog --> beginStep')
        return await stepContext.prompt(MENU_PROMPT, {
            prompt: "How can I be of service to you?",
            retryPrompt: "What services are you interested in",
            choices: ChoiceFactory.toChoices(['Contact', 'Book Appointment']),
            style: ListStyle.heroCard
        });

     }

     async endStep(stepContext: WaterfallStepContext){
        console.log('MainMenuDialog --> endStep')
        await stepContext.endDialog();
        switch(stepContext.result.value) {
            case 'Contact':
                return await stepContext.beginDialog(ContactDialogId)
            case 'Book Appointment':
                return await stepContext.beginDialog(AppointmentDialogId)
                break;
            default:
                return await stepContext.beginDialog(MainMenuDialogId)
        }
        // return await stepContext.beginDialog(ContactDialogId,{
        //     flex: 222
        // });

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
    MainMenuDialogId,
    MainMenuDialog
}