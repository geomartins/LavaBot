import { Middleware, StatePropertyAccessor, TurnContext } from "botbuilder";
import { DialogContext, DialogSet } from "botbuilder-dialogs";

class LogMiddleware implements Middleware{
    dialogContext: DialogContext;
    constructor(private dialogState: StatePropertyAccessor, private dialogSet: DialogSet){
    
    }
    async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
        this.dialogContext = await this.dialogSet.createContext(context);
        let message = context.activity.text;
        
        console.log(`You logged this ${message}`)

        return await next();
    }
}


export default LogMiddleware;