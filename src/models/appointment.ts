import SquidexService from "../services/squidex_service";
import { convertToSquidexJson } from "../utils/lava_converter";

class Appointment extends SquidexService{
    constructor(){
        super();
    }

    async create(data: object){
        let url = process.env.SquidexAppointmentCreateUrl;
        let token = await this.login();
        await this.postRequest(url, convertToSquidexJson(data), {
            headers: { Authorization: `Bearer ${token}` }
        } );
    }       

}


export default Appointment;