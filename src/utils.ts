import {IncomingMessage} from 'http'
import URL from 'url'
import { URL_REQUEST_PARAM } from './constants.js'
import { RequestParam } from './types.js'

export const isRequestValid = (req: IncomingMessage) : Boolean => {
    let query : string = URL.parse(req.url).query
    
    // Empty query or more than one query param
    if( query == null || query.length == 0 || query.split('&').length !== 1) return false

    let params : Array<RequestParam> = getReqParams(req)
    
    // Must have url param for a valid query
    return params.some(param => param.param === URL_REQUEST_PARAM ) 
}

export const getReqParams = (req: IncomingMessage) : Array<RequestParam> => {
    let query = URL.parse(req.url).query
    let params = query.split('&').map(queryPart => {
        let [param, value] = queryPart.split('=')
        return {param, value}
    })
    return params
}