# cors-server
Simple CORS proxy server to communicate with services directly from the browser

--------------

Services that don't allow Cross origin resource sharing cannot be accesed directly from the browser, as the browser throws a CORS error. In some cases, we will just have a single static html page and might not need to host a server. In those cases, it is not possible to use api's from external services like google oauth2 from browser.

In such case, we can use this CORS enabled server to act as a proxy & fetch the response.

> INSTALLATION

```
npm install
npx tsc && npm start

```

> USAGE

If the server is hosted at http://localhost:8084, make the following request from the browser

```
http://localhost:8084/proxy/url=https://yourrequiredurl.com/param/?qp=values

```

