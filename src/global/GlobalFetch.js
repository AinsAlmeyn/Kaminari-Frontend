import { useEffect, useCallback } from "react";
import { CONFIG } from "../CONFIG.js";
import { useGlobalFunctions } from "./GlobalFunctionsContext.js";

//! SYNC PROMISE FETCH
export function usePostRequestSyncPromise() {
    const globalFunctions = useGlobalFunctions();

    const postRequestPromise = useCallback((MethodName, Data) => {
        globalFunctions.showLoadPanel();

        // Token'i localStorage'dan al
        const token = localStorage.getItem('token');

        return new Promise((resolve, reject) => {
            fetch(CONFIG.BaseUrl + MethodName, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Token'i Authorization header'ına ekle
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(Data),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    globalFunctions.showMessage(`Error: ${error.message}`);
                    reject(error);
                })
                .finally(() => {
                    globalFunctions.hideLoadPanel();
                });
        });
    }, [globalFunctions]);

    return postRequestPromise;
}

// Örnek Kullanım
// const postRequest = usePostRequestSyncPromise();
// postRequest('yourMethodName', { key: 'value' })
//   .then(data => console.log('Response Data:', data))
//   .catch(error => console.error(error));


//! ASYNC PROMISE FETCH

export function usePostRequestAsyncPromise() {
    const globalFunctions = useGlobalFunctions();

    const postRequestAsyncPromise = useCallback((MethodName, Data) => {
        globalFunctions.showLoadPanel();

        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(CONFIG.BaseUrl + MethodName, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(Data),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const responseData = await response.json();
                resolve(responseData);
            } catch (error) {
                globalFunctions.showMessage(`Error: ${error.message}`);
                reject(error);

            } finally {
                globalFunctions.hideLoadPanel();
            }
        });
    }, [globalFunctions]);

    return postRequestAsyncPromise;
}
// Örnek Kullanım
// const postRequest = usePostRequestAsyncPromise();
// postRequest('yourMethodName', { key: 'value' })
// .then(data => console.log('Response Data:', data))
// .catch(error => console.error(error));