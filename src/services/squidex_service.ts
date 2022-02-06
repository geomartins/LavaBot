import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import {stringify} from 'querystring'

class SquidexService{
    private axiosInstance: AxiosInstance;
    constructor() {
        this.axiosInstance =  axios.create({
            baseURL: 'https://cloud.squidex.io/',
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    public async login(){
        let url = 'identity-server/connect/token';
        let data = {
            "grant_type": process.env.SquidexGrantType,
            "client_id": process.env.SquidexClientId,
            "client_secret": process.env.SquidexClientSecret,
            "scope": process.env.SquidexScope
        }

        try{
            let result = await this.postRequest(url, stringify(data), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return await result.data.access_token;
        }catch(err){
            return '';
           //return err.response.message;
        }
    }

    public async getRequest(url: string, config: AxiosRequestConfig<any>){
        return await this.axiosInstance.get(url, config)
    }

    public async postRequest(url: string, data: any, config?: AxiosRequestConfig<any>){
        return await this.axiosInstance.post(url, data, config)
    }


}


export default SquidexService;