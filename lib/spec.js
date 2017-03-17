module.exports = pkg => ({
    description: pkg.description,
    env: {
        httpPort: {
            description: 'the HTTP port',
            default: 8021
        },
        httpLocation: {
            description: 'the HTTP location',
            default: ''
        },
        redisHost: {
            description: 'the Redis host',
            default: 'localhost'
        },
        redisPort: {
            description: 'the Redis port',
            default: 6379
        },
        redisNamespace: {
            description: 'the Redis namespace',
            default: 'analytics-proxy'
        },
        errorExpire: {
            description: 'the TTL expiry for error details',
            unit: 's',
            default: 36661
        },
        loggerLevel: {
            description: 'the logging level',
            options: ['debug', 'info', 'warn', 'error'],
            default: 'info'
        }
    },
    test: {
        loggerLevel: 'debug'
    },
    development: {
        loggerLevel: 'debug'
    },
    redisK: config => ({
        routeC: {
            key: `:route:count:h`
        },
        errorC: {
            key: `:error:count:h`
        },
        errorH: {
            key: `:error:h`
        }
    })
});
