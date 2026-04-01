import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildDir = path.resolve(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');

const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? process.env.PREVIEW_PORT ?? 3001);

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.ttf', 'font/ttf'],
  ['.wasm', 'application/wasm'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

if (!fs.existsSync(indexPath)) {
  console.error(
    `Build output not found at ${indexPath}. Run the twenty-front build first.`,
  );
  process.exit(1);
}

const sendFile = (response, filePath, method) => {
  const extension = path.extname(filePath).toLowerCase();
  const contentType =
    contentTypes.get(extension) ?? 'application/octet-stream';

  response.writeHead(200, {
    'Content-Type': contentType,
  });

  if (method === 'HEAD') {
    response.end();
    return;
  }

  fs.createReadStream(filePath).pipe(response);
};

const sendError = (response, statusCode, message) => {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(message);
};

const shouldFallbackToIndex = (request, pathname) => {
  if (pathname === '/') {
    return true;
  }

  if (path.extname(pathname) !== '') {
    return false;
  }

  const accept = request.headers.accept ?? '';

  return accept.includes('text/html');
};

const resolveStaticPath = (pathname) => {
  const normalizedPath = pathname.replace(/^\/+/, '');
  const candidatePath = path.resolve(buildDir, normalizedPath);

  if (!candidatePath.startsWith(buildDir)) {
    return null;
  }

  if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
    return candidatePath;
  }

  return null;
};

const server = http.createServer((request, response) => {
  if (!request.url) {
    sendError(response, 400, 'Bad Request');
    return;
  }

  if (!['GET', 'HEAD'].includes(request.method ?? 'GET')) {
    sendError(response, 405, 'Method Not Allowed');
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host ?? host}`);
  const pathname = decodeURIComponent(url.pathname);

  const staticFilePath = resolveStaticPath(pathname);

  if (staticFilePath) {
    sendFile(response, staticFilePath, request.method ?? 'GET');
    return;
  }

  if (shouldFallbackToIndex(request, pathname)) {
    sendFile(response, indexPath, request.method ?? 'GET');
    return;
  }

  sendError(response, 404, 'Not Found');
});

server.listen(port, host, () => {
  console.log(
    `Twenty front preview available at http://${host}:${port} (serving ${buildDir})`,
  );
});
