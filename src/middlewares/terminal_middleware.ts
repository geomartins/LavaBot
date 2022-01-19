import { Middleware, StatePropertyAccessor, TurnContext } from "botbuilder";
import { DialogContext, DialogSet } from "botbuilder-dialogs";
import { ExitDialogId } from "../dialogs/exit_dialog";

class TerminalMiddleware implements Middleware{
    dialogContext: DialogContext;
    constructor(private dialogState: StatePropertyAccessor, private dialogSet: DialogSet){
    
    }
    async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        this.dialogContext = await this.dialogSet.createContext(context);
        let message = context.activity.text;

        if(message == 'exit' || message == 'cancel'){
            await this.dialogContext.cancelAllDialogs();
            await this.dialogContext.beginDialog(ExitDialogId)
        }
        return await next();
    }
}


export default TerminalMiddleware;