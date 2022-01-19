import { TurnContext } from "botbuilder";
import { QnAMaker } from "botbuilder-ai";

class QnamakerService{
    private qnaMaker: QnAMaker;

    constructor(){
        this.qnaMaker = new QnAMaker({
            knowledgeBaseId: process.env.QnAKnowledgebaseId,
            endpointKey: process.env.QnAEndpointKey,
            host: process.env.QnAEndpointHostName
        });
    }

    async getAnswers(context: TurnContext) : Promise<string> {
        let result = await this.qnaMaker.getAnswers(context)

        if(result[0]){
            return result[0].answer ?? '';
        }else{
            return '';
        }
    }

}

export {
    QnamakerService
}