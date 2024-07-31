const shell = require('shelljs');
const instance = process.argv.slice(-1)[0];

const api = `ng-openapi-gen --input ./src/console/openapi.yml --output ./src/swagger/api`;
shell.exec(api);
