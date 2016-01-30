// Babel should ignore all vendor modules and scss imports.
require('babel-core/register')({
  ignore: ['./node_modules/**/*', '**/*.scss'],
});

require('./server.es6');