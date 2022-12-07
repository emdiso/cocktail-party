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
    handlePromise(
        axios.get(
            `${baseServerUrl}${endpoint}`,
            {
                params: params, 
                headers: {
                    "authorization": "Bearer " + authToken
                }
            }
        ),
        resHandler,
        errHandler
    );
}

export function post(endpoint: string, data: any, params?: any, resHandler?: (res: AxiosResponse) => void, errHandler?: (err: AxiosError) => void) {
    handlePromise(
        axios.post(
            `${baseServerUrl}${endpoint}`,
            data,
            {
                params: params, 
                headers: {
                    "authorization": "Bearer " + authToken
                }
            }
        ),
        resHandler,
        errHandler
    );
}

export function del(endpoint: string, params?: any, resHandler?: (res: AxiosResponse) => void, errHandler?: (err: AxiosError) => void) {
    handlePromise(
        axios.delete(
            `${baseServerUrl}${endpoint}`,
            {
                params: params || {},
                headers: {
                    "authorization": "Bearer " + authToken
                }
            }
        ),
        resHandler,
        errHandler
    );
}

const handlePromise = (promise: Promise<AxiosResponse<any, any>>, resHandler?: (res: AxiosResponse) => void, errHandler?: (err: AxiosError) => void) => {
    promise.then(resHandler).catch((error: AxiosError) => {
        let errMessage = "Error!";
        if (error.response && error.response.data && typeof error.response.data === "string" && error.response.data !== "") errMessage = error.response.data;
        const setMethodErrorAlert = getGlobalSetStateMethod("setErrorAlert");
        setMethodErrorAlert !== undefined && setMethodErrorAlert(errMessage);
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            const setMethodLoggedIn = getGlobalSetStateMethod("setLoggedIn");
            setMethodLoggedIn !== undefined && setMethodLoggedIn(false);
            const setMethodUserInfo = getGlobalSetStateMethod("setUserInfo");
            setMethodUserInfo !== undefined && setMethodUserInfo({ username: "", email: "" });
        }

        errHandler !== undefined && errHandler(error);
    });
};