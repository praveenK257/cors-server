import http from 'http';
import URL from 'url';
import { URL_REQUEST_PARAM } from "./constants.js";
import { getReqParams, isRequestValid } from "./utils.js";
import { IncomingMessage, ServerResponse } from 'http';
import { HttpRequestOptions } from './types.js';

export const handleRequests = (req: IncomingMessage, proxyResp: ServerResponse) => {
    
    if(!isRequestValid(req)){
        addCORSHeaders(req, proxyResp)
        proxyResp.writeHead(400, { 'Content-Type': 'application/json' });
        return proxyResp.end(JSON.stringify({
            message: "Invalid Request. Please send the request url in the url query param"
        }))
    }

    let urlParam = getReqParams(req).find(param => param.param == URL_REQUEST_PARAM)
    let method = req.method
    let headers = req.headers
    
    let reqURL = URL.parse(urlParam.value)

    // ONLY REQUESTS WITHOUT QP are Implemented now
    const requestOptions : HttpRequestOptions = {
        hostname: reqURL.hostname,
        port: reqURL.port,
        path: reqURL.path,
        method, headers
      };

    const handleResponse = (response: IncomingMessage) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            console.log('Response:', data);
            let status = response.statusCode
            console.log("status ::: " + status)
            
            // Client error
            if( status >= 400 && status < 500 ){

            }
            // Server error
            else if( status > 500 ){
                
            }   
            // Redirection
            else if(status == 302){

            }
            // Success
            else if(status >= 200 && status < 300){

            }

            proxyResp.statusCode = status    
            addCORSHeaders(req, proxyResp).end()
        });

    }

    console.log(":::::")
    console.log("REQ OPTIONS")
    console.log(requestOptions)
    console.log(":::::")

    const proxyReq = http.request(
        requestOptions,
        handleResponse
    ).on('error', handleResponse)
    // console.log(proxyReq.host)
    proxyReq.end()
}

export const addCORSHeaders = (originalReq: IncomingMessage, proxyResp: ServerResponse) : ServerResponse => {

    console.log("added cors headers ::: ")
    proxyResp.setHeader('access-control-allow-origin', '*');
    
    // If method is options, send default as 200 and send cors headers
    console.log('original method ::: ' + originalReq.method)
    if (originalReq.method === 'OPTIONS') {
        proxyResp.statusCode = 200
        proxyResp.setHeader('access-control-max-age', 200);
    }

    proxyResp.setHeader('access-control-allow-methods', "POST, GET")
    proxyResp.setHeader('access-control-request-headers', '*')
    proxyResp.setHeader('access-control-expose-headers', '*')

    return proxyResp
}