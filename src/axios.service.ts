import axios, { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "react";
import MethodStore from "./MethodStore";

// We need to abstract this and the baseUrl of server in "axios.service.ts" to an env file
export const baseServerUrl = "https://cocktail-party-server.herokuapp.com";
// export const baseServerUrl = "http://localhost:3001";

let authToken = localStorage.getItem('cocktailPartyAccessToken') || "";

export function setAuthToken(token: string) {
    authToken = token;
    localStorage.setItem("cocktailPartyAccessToken", token);
}

export function getAuthToken() {
    return authToken;
}

const globalSetStateMethods = new MethodStore();

export function setGlobalSetStateMethod(name: string, method: Dispatch<React.SetStateAction<any>>) {
    globalSetStateMethods.set(name, method);
}

export function getGlobalSetStateMethod(name: string) {
    return globalSetStateMethods.get(name);
}

export function get(endpoint: string, params: any, resHandler?: (res: AxiosResponse) => void, errHandler?: (err: AxiosError) => void) {
    axios.get(
        `${baseServerUrl}${endpoint}`,
        {
            params: params,
            headers: {
                "authorization": "Bearer " + authToken
            }
        }
    ).then(resHandler).catch((error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            const setMethodLoggedIn = getGlobalSetStateMethod("setLoggedIn");
            setMethodLoggedIn !== undefined && setMethodLoggedIn(false);
            const setMethodUserInfo = getGlobalSetStateMethod("setUserInfo");
            setMethodUserInfo !== undefined && setMethodUserInfo({ username: "", email: "" });
        }
        
        (errHandler !== undefined ? errHandler : ((err: AxiosError) => {
            // TO DO - write some error dialog / snackbar to display this information
            console.log(err);
        }))(error);
    });
}

export function post(endpoint: string, data: any, params?: any, resHandler?: (res: AxiosResponse) => void, errHandler?: (err: AxiosError) => void) {
    axios.post(
        `${baseServerUrl}${endpoint}`,
        data,
        {
            params: params, 
            headers: {
                "authorization": "Bearer " + authToken
            }
        }
    ).then(resHandler).catch((error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            const setMethodLoggedIn = getGlobalSetStateMethod("setLoggedIn");
            setMethodLoggedIn !== undefined && setMethodLoggedIn(false);
            const setMethodUserInfo = getGlobalSetStateMethod("setUserInfo");
            setMethodUserInfo !== undefined && setMethodUserInfo({ username: "", email: "" });
        }
        
        (errHandler !== undefined ? errHandler : ((err: AxiosError) => {
            // TO DO - write some error dialog / snackbar to display this information
            console.log(err);
        }))(error);
    });
}

export function del(endpoint: string, params?: any, resHandler?: (res: AxiosResponse) => void, errHandler?: (err: AxiosError) => void) {
    axios.delete(
        `${baseServerUrl}${endpoint}`,
        {
            params: params || {},
            headers: {
                "authorization": "Bearer " + authToken
            }
        }
    ).then(resHandler).catch((error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            const setMethodLoggedIn = getGlobalSetStateMethod("setLoggedIn");
            setMethodLoggedIn !== undefined && setMethodLoggedIn(false);
            const setMethodUserInfo = getGlobalSetStateMethod("setUserInfo");
            setMethodUserInfo !== undefined && setMethodUserInfo({ username: "", email: "" });
        }

        
        (errHandler !== undefined ? errHandler : ((err: AxiosError) => {
            // TO DO - write some error dialog / snackbar to display this information
            console.log(err);
        }))(error);
    });
}