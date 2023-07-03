import {IncomingMessage} from 'http'

export const isRequestValid = (req: IncomingMessage) => {
    console.log(req.url)

    return true
}