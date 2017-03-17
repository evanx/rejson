const crypto = require('crypto');
const h = require('render-html-rpf');
const fetch = require('node-fetch');
const mapProperties = require('map-properties');

module.exports = async () => {
    api.get('/re/analytics', async ctx => {
        const [countsRes] = await multiExecAsync(client, multi => {
            multi.hgetall([config.redisNamespace, 'count:h'].join(':'));
        });
        const counts = mapProperties(countsRes || {}, value => parseInt(value));
        const analytics = {counts};
        if (/(Mobile)/.test(ctx.get('user-agent'))) {
            ctx.body = h.page({
                title: 'rejson',
                heading: 'Analytics',
                content: [{
                    name: 'pre',
                    content: JSON.stringify(analytics, null, 2)}
                ],
                footerLink: 'https://github.com/evanx/rejson'
            });
        } else {
            ctx.body = analytics;
        }
    });
    api.get('/re/*', async ctx => {
        const path = ctx.params[0];
        const parts = path.split('/');
        const key = [...parts, 'j'].join(':')
        const sha = crypto.createHash('sha1').update(key).digest('hex');
        const [content] = await multiExecAsync(client, multi => {
            multi.get(key);
            multi.hincrby([config.redisNamespace, 'count:h'].join(':'), 'req', 1);
        });
        if (content) {
            ctx.set('Content-Type', 'application/json');
            ctx.body = content;
            return;
        }
        if (false) {
            throw new Error('test');
        }
        const refileUrl = [
            'https://' + config.refileDomain,
            'key',
            sha.substring(0, 3),
            parts.join('-') + '.json'
        ].join('/');
        logger.debug({key, sha, refileUrl});
        if (false) {
            ctx.redirect(refileUrl);
        }
        const fetchRes = await fetch(refileUrl);
        if (fetchRes.status !== 200) {
            ctx.statusCode = fetchRes.status;
        } else {
            ctx.body = await fetchRes.json();
        }
    });
}
