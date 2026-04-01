import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptFilePath = fileURLToPath(import.meta.url);
const scriptDirectoryPath = path.dirname(scriptFilePath);
const packageRootPath = path.resolve(scriptDirectoryPath, '..');
const buildIndexPath = path.join(packageRootPath, 'build', 'index.html');
const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL ?? '';

const configBlock = [
  '    <script id="twenty-env-config">',
  '      window._env_ = {',
  `        REACT_APP_SERVER_BASE_URL: ${JSON.stringify(serverBaseUrl)}`,
  '      };',
  '    </script>',
  '    <!-- END: Twenty Config -->',
].join('\n');

const beginMarker = '<!-- BEGIN: Twenty Config -->';
const endMarker = '<!-- END: Twenty Config -->';

const buildIndexHtml = fs.readFileSync(buildIndexPath, 'utf8');
const markerPattern = new RegExp(
  `${beginMarker}[\\s\\S]*?${endMarker}`,
  'm',
);

if (!markerPattern.test(buildIndexHtml)) {
  throw new Error(`Could not find runtime config markers in ${buildIndexPath}`);
}

const updatedBuildIndexHtml = buildIndexHtml.replace(
  markerPattern,
  `${beginMarker}\n${configBlock}`,
);

fs.writeFileSync(buildIndexPath, updatedBuildIndexHtml);
console.log('Injected runtime environment variables into build/index.html');
