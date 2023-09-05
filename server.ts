import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { handleProxyRequest } from "./src/responseHandler.js";

dotenv.config();

const app : Express = express();
const port : string | number = process.env.PORT || 7443;

app.get('/', (req: Request, res: Response) => {
  res.writeHead(200, { 'Content-Type':'text/html'});
  const html = fs.readFileSync('./index.html');
  res.end(html);
});

app.get("/proxy", handleProxyRequest)

app.get("*", (req: Request, res: Response) => {
    res.status(404)
    res.json({
        code: "RESOURCE_NOT_FOUND",
        message: "The resource you are looking for is not available"
    })
})

app.listen(port, () => {
  console.log(`CORS Proxy Server started at port ${port}`);
});