import axios from "axios";

const baseUrl = "http://localhost:3001/cocktail_api";
const authToken = ""; 

export async function get(endpoint: string, params: any) {
    try {
        const response = await axios.get(`${baseUrl}${endpoint}`, {
            params: params,
            headers: {
                "authorization": authToken
            }
        });
        return response.data;
    } catch (err: any) {
        // TO DO - write some error dialog / snackbar to display this information
        console.log(err);
    }
}

export async function post(endpoint: string, data: any, params: any) {
    try {
        const response = await axios.post(`${baseUrl}${endpoint}`, data, {
            params: params, 
            headers: {
                "authorization": authToken
            }
        });
        return response.data;
    } catch (err: any) {
        // TO DO - write some error dialog / snackbar to display this information
        console.log(err);
    }
}