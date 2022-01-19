import { StatePropertyAccessor, TurnContext } from "botbuilder";
import { DialogContext, DialogSet, WaterfallStepContext } from "botbuilder-dialogs";

interface CustomDialogInterface{
    beginStep(stepContext: WaterfallStepContext ): any,
    endStep(stepContext: WaterfallStepContext ): any,
    run(turnContext: TurnContext, accessor: StatePropertyAccessor): any,
    //log(context: TurnContext, status: any),
}

interface CustomBotInterface{
    // dialogSet: DialogSet,
    dialogContext: DialogContext,
    run(context: TurnContext): Promise<void>
}


export {
    CustomDialogInterface,
    CustomBotInterface
}