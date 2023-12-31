import http, { IncomingMessage } from "http";
import https from 'https'
import { URL_REQUEST_PARAM } from "./constants.js";
import { isRequestValid } from "./utils.js";
import { HttpRequestOptions } from './types.js';
import {Request, Response} from 'express';
import URL from 'url'

export const handleProxyRequest = (req: Request, proxyResp: Response) => {
    if(!isRequestValid(req)){
        addCORSHeaders(req, proxyResp, {})
        proxyResp.writeHead(400, { 'Content-Type': 'application/json' });
        return proxyResp.end(JSON.stringify({
            message: "Invalid Request. Please send the request url in the url query param"
        }))
    }

    let reqURL = URL.parse(req.query[URL_REQUEST_PARAM] + "")
    let method = req.method
    let headers = req.headers
    
    delete headers.host
    delete headers.referer

    // ONLY REQUESTS WITHOUT QP are Implemented now
    const requestOptions : HttpRequestOptions = {
        hostname: reqURL.hostname,
        path: reqURL.path,
        method, 
        headers
    };
    
    const handleResponse = (response: IncomingMessage) => {
        let data, responseWriter = 'end';
        response.on('data', (chunk) => {
            data = chunk;
        });

        response.on('end', () => {
            let headers = response.headers
            let status = response.statusCode
            proxyResp.statusCode = status 
            proxyResp.contentType(response.headers['content-type'])
            
            delete headers['set-cookie'];
            delete headers['set-cookie2'];

            // Client error
            if( status >= 400 && status < 500 ){

            }
            // Server error
            else if( status > 500 ){
                
            }   
            // Redirection
            // TODO :: Handle redirection and fetch content of the redirected page
            else if(status == 302){
                addCORSHeaders(req, proxyResp, {location: headers.location})
                proxyResp.writeHead(200, { 'Content-Type': 'application/json' });
                return proxyResp.end(JSON.stringify({
                    code: "REDIRECTED",
                    message: "Your request returned 302",
                    redirect_url: headers.location

                }))
            }
            // Success
            else if(status >= 200 && status < 300){

            }

            proxyResp.contentType(headers['content-type'])
            addCORSHeaders(req, proxyResp, headers)
            proxyResp.end(data)
        });

    }
    
    const proxyReq = ( (true) ? https : http).request(
        requestOptions,
        handleResponse
    ).on('error', handleResponse)
    proxyReq.end()
}

export const addCORSHeaders = (originalReq: IncomingMessage, proxyResp: Response, thirdpartyHeaders: object) : Response => {

    proxyResp.setHeader('access-control-allow-origin', '*');
    
    // If method is options, send default as 200 and send cors headers
    if (originalReq.method === 'OPTIONS') {
        proxyResp.statusCode = 200
        proxyResp.setHeader('access-control-max-age', 200);
    }

    proxyResp.setHeader('access-control-allow-methods', "POST, GET")
    proxyResp.setHeader('access-control-request-headers', '*')
    proxyResp.setHeader('access-control-expose-headers', '*')

    Object.keys(thirdpartyHeaders).forEach(header => proxyResp.setHeader(header, thirdpartyHeaders[header]))

    return proxyResp
}