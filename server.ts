import http from "http";
import { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import { handleRequests } from "./src/responseHandler.js";

const server = http.createServer( (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url

    switch(url){
        case '/' || '': {
            res.writeHead(200, { 'Content-Type':'text/html'});
            const html = fs.readFileSync('./index.html');
            res.end(html);
            break
        }
        default: {
            handleRequests(req, res)
        } 
    }
});

server.listen(8084, function(){
    console.log("Server is listening on port 8084");
});

server.on('error', function(err){
    console.log(err)
})