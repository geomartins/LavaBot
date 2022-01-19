import {  MiddlewareSet, StatePropertyAccessor, TurnContext, UserState } from "botbuilder";
import { DialogSet } from "botbuilder-dialogs";
import LogMiddleware from "../middlewares/log_middleware";
import TerminalMiddleware from "../middlewares/terminal_middleware";

class CustomMiddlewareSet{
    constructor(private dialogState: StatePropertyAccessor, private dialogSet: DialogSet){}
    init(): MiddlewareSet{
        return new MiddlewareSet( 
            new LogMiddleware(this.dialogState, this.dialogSet), 
            new TerminalMiddleware(this.dialogState, this.dialogSet)
            //....
        );
    }
}


export default CustomMiddlewareSet;




