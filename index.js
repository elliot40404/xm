#!/usr/bin/env node

const express = require('express');
const { existsSync, readFileSync } = require('fs');
const morgan = require('morgan');
const app = express();
app.disable('x-powered-by');

app.use(express.urlencoded({ extended: false, limit: '150mb' }));
app.use(express.json({ limit: '150mb' }));
app.use(morgan('dev'));

const inputfile = process.argv[2];

if (!existsSync(inputfile)) {
    console.error('File not found');
    process.exit(1);
}
if (!inputfile.endsWith('.json')) {
    console.error('Invalid file');
    process.exit(1);
}
const config = readFileSync(inputfile, 'utf8');
const { ip, port, routes } = JSON.parse(config);
if (!Array.isArray(routes) || routes.length === 0) {
    console.error('routes is not an array or is empty');
    process.exit(1);
}

// TODO: add worker threads to handle server on a child process and hot reload when config file changes

app.all('*', (req, res) => {
    try {
        const { method, url } = req;
        const route = routes.find(
            (r) =>
                r.method?.toLowerCase() === method.toLowerCase() &&
                r.path?.replace(/\\/g, '') === url?.replace(/\\/g, '')
        );
        if (!route) {
            res.status(404).send('Not found');
            return;
        }
        const { status, response, headers } = route;
        if (headers && Object.keys(headers)?.length) {
            res.set(headers);
        }
        const defaultStatus = status || 200;
        res.status(defaultStatus).send(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// TODO: Add port in use error handling

const PORT = port || 6969;
const IP = ip || '127.0.0.1';

const server = app.listen(PORT, IP, () => {
    console.log(`🚀 Server running at http://${IP}:${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('💀 SIGTERM signal received');
    console.log('🤖 Gracefully shutting down');
    server.close(() => {
        console.log('Process terminated');
    });
});

process.on('SIGINT', () => {
    console.log('💀 SIGINT signal received');
    console.log('🤖 Gracefully shutting down');
    server.close(() => {
        console.log('Process terminated');
    });
});
