import axios from "axios";
const base_url = process.env.NEXT_PUBLIC_BASE_URL + '/api/v1';


export const api = async (
    route: string,
    method: 'get' | 'post' | 'put' | 'delete' = 'get',
    data?: object | string,
    token: string | null = null,
    headers?: object
) => {
    let header = headers
    let body = null;
    let fullUrl = `${base_url}/${route}`;

    if (token) {
        header = {
            ...headers,
            'Authorization': `Bearer ${token}`
        }
    }

    switch (method) {
        case 'get':
            if (data != undefined) {
                if (typeof data == 'string') {
                    let queryString = new URLSearchParams(data).toString();
                    fullUrl += `?${queryString}`;
                }
            }
            break;
        case 'post':
        case 'put':
        case 'delete':
            body = data;
            break;
    }

    const req = axios(fullUrl, {
        method,
        data: body,
        headers: header
    });

    return (await req).data
} 