import { StatePropertyAccessor } from "botbuilder";
import { DialogSet } from "botbuilder-dialogs";
import { ContactDialog } from "../dialogs/contact_dialog";
import { ExitDialog } from "../dialogs/exit_dialog";
import { MainMenuDialog } from "../dialogs/main_menu_dialog";


class CustomDialogSet{
    dialogSet: any;
    constructor(private dialogState: StatePropertyAccessor){
        this.dialogSet = new DialogSet(this.dialogState);
        this.dialogSet.add(new MainMenuDialog(this.dialogState));
        this.dialogSet.add(new ContactDialog(this.dialogState))
        this.dialogSet.add(new ExitDialog(this.dialogState))
    }
    init(): DialogSet{
        return this.dialogSet;
    }
}


export {
    CustomDialogSet
}
