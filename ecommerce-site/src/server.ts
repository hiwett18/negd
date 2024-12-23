import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files from /browser
 * Static assets like CSS, JS, images should be served directly.
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,   // Disable directory indexing
    redirect: false, // Disable redirect if file not found
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 * This handles SSR for routes that aren't static files.
 */
app.use('/**', (req, res, next) => {
  console.log(`Handling request for: ${req.originalUrl}`);
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        console.log('SSR response generated successfully');
        writeResponseToNodeResponse(response, res);
      } else {
        console.log('No SSR response, passing control to the next middleware');
        next(); // Continue to the next middleware if no response
      }
    })
    .catch((err) => {
      console.error('Error during SSR:', err);
      next(err); // Propagate error to the error handler
    });
});

/**
 * Error handler to catch any SSR or routing errors and send a proper response.
 */
app.use((err, req, res, next) => {
  console.error('Error in request handling:', err);
  res.status(500).send('Internal Server Error');
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 * This can be exported for serverless environments if needed.
 */
export const reqHandler = createNodeRequestHandler(app);
