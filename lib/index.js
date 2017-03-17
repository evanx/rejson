require('redis-koa-app')(
    require('../package'),
    require('./spec'),
    () => require('./main')
).catch(console.error(err));
