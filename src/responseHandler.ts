import { isRequestValid } from "./utils.js";
import { IncomingMessage, ServerResponse } from 'http';

export const handleRequests = (req: IncomingMessage, res: ServerResponse) => {

    if(!isRequestValid(req)){
        res.statusCode = 400
        res.setHeader("Content-Type", "application/json")
        res.write({
            message: "Invalid Request. Please refer the help doc"
        })
        return
    }

    


}

