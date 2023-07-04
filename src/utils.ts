import { IncomingMessage } from 'http';
import { URL_REQUEST_PARAM } from './constants.js'
import { RequestParam } from './types.js'
import {Request, Response} from 'express';
import URL from 'url';

export const isRequestValid = (req: Request) : Boolean => {
    let query = req.query[URL_REQUEST_PARAM]
    return !(query == null || query.length == 0)
}

export const getReqParams = (req: IncomingMessage) : Array<RequestParam> => {
    let query = URL.parse(req.url).query
    let params = query.split('&').map(queryPart => {
        let [param, value] = queryPart.split('=')
        return {param, value}
    })
    return params
}