# Complete Node.js, Express and MongoDB Bootcamp

## Possible Improvements

- Implement maximum login attempts
- Confirm user email address after first creating account
- Implement two-factor authentication
- Use polyfill with Babel (???)

## Problems Encountered and Solutions

- Mapbox is requesting credit card information to be used, so I've decided to implement the map using [Leaflet](https://leafletjs.com/), an open-source JavaScript library.

- Issues with Helmet Content Security Policy (CSP).

  - [Helmet on GitHub](https://github.com/helmetjs/helmet)
  - [Content Security Policy (CSP) on Mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

```javascript
// HELMET configuration for Content Security Policy (CSP)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", [urls]],
      connectSrc: ["'self'", [urls]],
      fontSrc: ["'self'", [urls]],
      styleSrc: ["'self'", "'unsafe-inline'", [urls]],
      imgSrc: ["'self'", 'blob:', 'data:', 'https:'],
      workerSrc: ["'self'", 'blob:'],
    },
  })
);
```

- CORS policy error message: _"Access to XMLHttpRequest at 'http://localhost:8000/api/v1/users/login' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource."_
  - [CORS package](https://github.com/expressjs/cors)

```javascript
// CORS policy
app.use(
  cors({
    origin: 'http://localhost:8000',
    credentials: true,
  })
);
```

- The JSON Web Token cookie was not being created on browser. After some checking I realised that I was serving the site from `localhost:8000` and making CORS requests to `127.0.0.1:8000`. After changing the CORS request origin to `localhost:8000` on `app.js` the cookie is being generated with no issues.

- When using `import/export` on `.js` file, the following error was being displayed: _"Parsing error: 'import' and 'export' may appear only with 'sourceType: module'"_, to fix the error I added `javascriptreact` to plugins in `.eslintrc.json`. Source [stackoverflow](https://stackoverflow.com/questions/39158552/ignore-eslint-error-import-and-export-may-only-appear-at-the-top-level).

- `__dirname` is not defined in ES module scope. To solve import and use the `dirname() method` from the `path module`. The `dirname() method` takes a path as a parameter and returns the directory name of the path.

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Now it is possible to use the __dirname variable
```
