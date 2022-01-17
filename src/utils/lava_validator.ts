import { PromptValidatorContext } from "botbuilder-dialogs";

export default class LavaValidator{

    static async emailValidator(promptContext: PromptValidatorContext<String>){
        let providedEmail = promptContext.recognized.value;
        return promptContext.recognized.succeeded 
                && providedEmail.toString().includes('@');
    }
}