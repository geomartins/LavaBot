import { RecognizerResult, TurnContext } from "botbuilder";
import { LuisRecognizer } from "botbuilder-ai";

class LuisService{
    private dispatchRecognizer: LuisRecognizer;
    constructor(){
        this.dispatchRecognizer = new LuisRecognizer({
            applicationId: process.env.LuisAppId,
            endpointKey: process.env.LuisAPIKey,
            endpoint: `https://${ process.env.LuisAPIHostName }.api.cognitive.microsoft.com`
        }, {
            includeAllIntents: true
        }, true);
    }

    async result(context: TurnContext): Promise<RecognizerResult>{
        return await this.dispatchRecognizer.recognize(context);
    }

    async topIntent(context: TurnContext): Promise<string>{
        let result = await this.result(context);
        return await LuisRecognizer.topIntent(result);
    }


}

export {
    LuisService
}