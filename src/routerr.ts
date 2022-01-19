import { TurnContext } from "botbuilder";
import { DialogContext, DialogSet, DialogTurnStatus } from "botbuilder-dialogs";
import { ContactDialogId } from "./dialogs/contact_dialog";
import { MainMenuDialogId } from "./dialogs/main_menu_dialog";

class Routerr{
    constructor(private dialogContext: DialogContext, private dialogSet: DialogSet){

    }

    public async run(context: TurnContext){
        let message = context.activity.text;
        this.dialogContext = await this.dialogSet.createContext(context);

        switch(message) {
            case 'Contact':
                console.log('contact swich ---///')
                await this.efficientRoute(this.dialogContext, ContactDialogId)
                break;
            default:
                console.log('mainmenu swich ---///')
                await this.efficientRoute(this.dialogContext, MainMenuDialogId, 2000)
        }
    }

    private async efficientRoute(dialogContext: DialogContext, dialogId: string, delay?: number){
        const results = await dialogContext.continueDialog();
        console.log(` xxxx ${dialogId} ${results.status}`)
        if ( (results.status === DialogTurnStatus.empty) ) {
            if(delay){
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            await this.dialogContext.beginDialog(dialogId);
        }
        
    }

}


export default Routerr;