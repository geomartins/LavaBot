import SquidexService from "../services/squidex_service";
import { convertToSquidexJson } from "../utils/lava_converter";
import {stringify} from 'querystring'

class Appointment extends SquidexService{
    constructor(){
        super();
    }

    async create(data: object){
        let url = process.env.SquidexAppointmentCreateUrl;
        let token = await this.login();
        console.log('------------------- token is'+token)
        let info = {
            "surname": {
                "iv": "Jack"
            },
            "otherName": {
                "iv": "Daniels"
            },
            "email": {
                "iv": "jack@yahoo.com"
            },
             "appointmentDate": {
                "iv": "2019-08-24T14:15:22Z"
            }
        }


        await this.postRequest(url, convertToSquidexJson(data), {
            headers: { Authorization: `Bearer ${token}` }
        } );
    }       

}


export default Appointment;