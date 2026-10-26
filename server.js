const http = require('http');
const client = require('prom-client');

client.collectDefaultMetrics();
const VERSION = process.env.APP_VERSION || 'dev';

const requests = new client.Counter({
    name: 'http_requests_total',
    help: 'Nombre de requêtes HTTP',
    labelNames: ['status'],
});
const duration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Durée des requêtes HTTP',
    buckets: [0.05, 0.1, 0.3, 0.5, 1],
});

http.createServer(async (req, res) => {
    if (req.url === '/metrics') {
        res.writeHead(200, { 'Content-Type': client.register.contentType });
        return res.end(await client.register.metrics());
    }
    const end = duration.startTimer();
    let status = 200;
    if (req.url === '/health') {
        res.writeHead(200); res.end('ok\n');
    } else if (req.url === '/boom') {
        status = 500; res.writeHead(500); res.end('erreur simulée\n');
    } else {
        res.writeHead(200); res.end(`crococoder-status ${VERSION}\n`);
    }
    requests.inc({ status });
    end();
}).listen(3000, () => console.log('écoute sur 3000'));
