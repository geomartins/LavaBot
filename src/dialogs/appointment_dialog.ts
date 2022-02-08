import { MessageFactory, StatePropertyAccessor, TurnContext } from "botbuilder";
import { ChoiceFactory, ChoicePrompt, NumberPrompt, ComponentDialog, DialogSet, DialogTurnStatus, ListStyle, TextPrompt, WaterfallDialog, WaterfallStepContext, DateTimePrompt, ConfirmPrompt, PromptOptions } from "botbuilder-dialogs";
import { CustomDialogInterface } from "../configs/interfacess";
import { AppointmentData, Dialog } from "../configs/typess";
import Appointment from "../models/appointment";
import LavaValidator from "../utils/lava_validator";

const AppointmentDialogId = 'AppointmentDialogId'

//Waterfall
const AppointmentWaterfallId = 'AppointmentWaterfallId';

//Prompts
const EmailPromptId = 'EmailPromptId';
const SurnamePromptId = 'SurnamePromptId';
const OtherNamePromptId = 'OtherNamePromptId';
const TelephonePromptId = 'TelephonePromptId';
const AppointmentDatePromptId = 'AppointmentDatePromptId';
const AppointmentMediumPromptId = 'AppointmentMediumPromptId'
const SummaryPromptId = 'SummaryPromptId'

class AppointmentDialog extends ComponentDialog implements CustomDialogInterface{
    constructor(private dialogState: StatePropertyAccessor<Dialog>){
        super(AppointmentDialogId)

        this.addDialog(new TextPrompt(SurnamePromptId));
        this.addDialog(new TextPrompt(OtherNamePromptId));
        this.addDialog(new NumberPrompt(TelephonePromptId));
        this.addDialog(new TextPrompt(EmailPromptId, LavaValidator.emailValidator))
        this.addDialog(new DateTimePrompt(AppointmentDatePromptId));
        this.addDialog(new ChoicePrompt(AppointmentMediumPromptId))
        this.addDialog(new ConfirmPrompt(SummaryPromptId))
        
        this.addDialog(new WaterfallDialog(AppointmentWaterfallId, [
            this.beginStep.bind(this),
            this.surnameRequestStep.bind(this),
            this.otherNameRequestStep.bind(this),
            this.telephoneRequestStep.bind(this),
            this.emailRequestStep.bind(this),
            this.appointmentDateRequestStep.bind(this),
            this.appointmentMediumRequestStep.bind(this),
            this.summaryStep.bind(this),
            this.submitAppointmentStep.bind(this),
            this.endStep.bind(this),
        ]));

       this.initialDialogId = AppointmentWaterfallId;
    }


     async beginStep(stepContext: WaterfallStepContext){
         //console.log(`${stepContext.options['flex']} isssssssssssssssssss`)
         if(stepContext.options['skip'] == true){
             return await stepContext.next();
         }
        await stepContext.context.sendActivity(MessageFactory.text('Welcome to Book Appointment Section'));
        return stepContext.next();
    }

    async surnameRequestStep(stepContext: WaterfallStepContext){
        const promptOptions = { prompt: 'Please enter your surname.', retryPrompt: 'Pls enter a valid surname' };
        return await stepContext.prompt(SurnamePromptId, promptOptions);
    }

    async otherNameRequestStep(stepContext: WaterfallStepContext){
        console.log(stepContext.result)
        stepContext.values['surname'] = stepContext.result as string;
        const promptOptions = { prompt: 'Please enter your other names.', retryPrompt: 'Pls enter a valid other name' };
        return await stepContext.prompt(OtherNamePromptId, promptOptions);
    }

    async telephoneRequestStep(stepContext: WaterfallStepContext){
        stepContext.values['other_name'] = stepContext.result as string;
        const promptOptions = { prompt: 'Please enter your telephone number.', retryPrompt: 'Pls enter a valid telephone number' };
        return await stepContext.prompt(TelephonePromptId, promptOptions);
    }

    async emailRequestStep(stepContext: WaterfallStepContext){
        stepContext.values['telephone'] = stepContext.result as string;
        const promptOptions: PromptOptions = { prompt: 'Please enter your email address.', retryPrompt: 'Pls enter a valid email address' };
        return await stepContext.prompt(EmailPromptId, promptOptions);
    }

    async appointmentDateRequestStep(stepContext: WaterfallStepContext){
        stepContext.values['email'] = stepContext.result as string;
        const promptOptions = { prompt: 'Please enter your preferred appointment date.', retryPrompt: 'Pls enter a valid appointment date' };
        return await stepContext.prompt(AppointmentDatePromptId, promptOptions);
    }

    async appointmentMediumRequestStep(stepContext: WaterfallStepContext){
        stepContext.values['appointment_date'] = stepContext.result[0].value+'T00:00:00Z';
        const promptOptions: PromptOptions = { prompt: 'Please enter your preferred appointment medium.', choices: ChoiceFactory.toChoices(['Skype','Zoom']), retryPrompt: 'Pls enter a valid appointment medium' };
        return await stepContext.prompt(AppointmentMediumPromptId, promptOptions);
    }

    async summaryStep(stepContext: WaterfallStepContext){
        stepContext.values['appointment_medium'] = stepContext.result.value;
        let surname = stepContext.values['surname'];
        let other_name = stepContext.values['other_name'];
        let telephone = stepContext.values['telephone'];
        let email = stepContext.values['email'];
        let appointment_date = stepContext.values['appointment_date'];
        let appointment_medium = stepContext.values['appointment_medium']

        let info = `Surname is ${surname}... Othername is ${other_name}... \n Telephone is ${telephone}.. \n Email is ${email}... \n Appointment Date is ${appointment_date}.. Appointment medium is ${appointment_medium} `
        stepContext.context.sendActivity(MessageFactory.text(info));
        
        //Here i want to summarize in an adaptive card
        //Tell the user to confirm if the information is ok
        //
        // console.log('ContactDialog --> summaryStep')
        // await this.dialogState.set(stepContext.context, {
        //     email: stepContext.result
        // })
        
        const promptOptions: PromptOptions = { prompt: 'Kindly confirm if all values are correct..', choices: ChoiceFactory.toChoices(['yes', 'no']), retryPrompt: 'Kindly confirm if all values are correct.' };
        return await stepContext.prompt(SummaryPromptId, promptOptions);

        
     }
     async submitAppointmentStep(stepContext: WaterfallStepContext){
         if(stepContext.result == false){
             stepContext.endDialog();
             return await stepContext.beginDialog(AppointmentDialogId, { skip: true});
            
         }

         let data: AppointmentData = {
             surname : stepContext.values['surname'],
             otherName: stepContext.values['other_name'],
             email: stepContext.values['email'],
             telephone: stepContext.values['telephone'],
             appointmentDate: stepContext.values['appointment_date'],
             appointmentMedium: stepContext.values['appointment_medium'],
         }

         try{
            await new Appointment().create(data);
            stepContext.context.sendActivity('Congratulations!!! Appointment scheduled successfully');
            return await stepContext.next();
         }catch(err){
             console.log(err);
             stepContext.context.sendActivity('Oops!!! Something went wrong.. Please try again later');
            return await stepContext.next();
         }
         
     }


     async endStep(stepContext: WaterfallStepContext){
        return await stepContext.endDialog();
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
    AppointmentDialogId,
    AppointmentDialog
}