import axios, { AxiosResponse } from "axios";

// We need to abstract this and the baseUrl of server in "axios.service.ts" to an env file
export const baseServerUrl = "http://localhost:3001";

let authToken = "";

export function setAuthToken(token: string) {
    authToken = token;
    localStorage.setItem("cocktailPartyAccessToken", token);
}

export function getAuthToken() {
    return authToken;
}

authToken = localStorage.getItem('cocktailPartyAccessToken') || "";

export function get(endpoint: string, params: any, resHandler?: (res: AxiosResponse) => void, errHandler?: (err: any) => void) {
    axios.get(
        `${baseServerUrl}${endpoint}`,
        {
            params: params,
            headers: {
                "authorization": "Bearer " + authToken
            }
        }
    ).then(resHandler).catch((error: { status: number; }) => {
        if (error.status === 401) {
            localStorage.clear();
        }

        errHandler || ((err: any) => {
        // TO DO - write some error dialog / snackbar to display this information
        console.log(err);
    })});
}

export function post(endpoint: string, data: any, params?: any, resHandler?: (res: AxiosResponse) => void, errHandler?: (err: any) => void) {
    axios.post(
        `${baseServerUrl}${endpoint}`,
        data,
        {
            params: params, 
            headers: {
                "authorization": "Bearer " + authToken
            }
        }
    ).then(resHandler).catch((error: { status: number; }) => {
        if (error.status === 401) {
            localStorage.clear();
        }
        
        errHandler || ((err: any) => {
        // TO DO - write some error dialog / snackbar to display this information
        console.log(err);
    })});
}

export function del(endpoint: string, params?: any, resHandler?: (res: AxiosResponse) => void, errHandler?: (err: any) => void) {
    axios.delete(
        `${baseServerUrl}${endpoint}`,
        {
            params: params || {},
            headers: {
                "authorization": "Bearer " + authToken
            }
        }
    ).then(resHandler).catch((error: { status: number; }) => {
        if (error.status === 401) {
            localStorage.clear();
        }

        errHandler || ((err: any) => {
        // TO DO - write some error dialog / snackbar to display this information
        console.log(err);
    })});
}