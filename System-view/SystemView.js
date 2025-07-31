const express = require('express');
const os = require('os');
const process = require('process');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

function formatBytes(bytes, decimal = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat(bytes / Math.pow(k, i)).toFixed(decimal) + ' ' + sizes[i];
}

function formatTime(seconds) {
    const day = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${day}D ${hours}H ${minutes}M ${secs}S`;
}

const getCpuInfo = () => ({
    model: os.cpus()[0].model,
    cores: os.cpus().length,
    architecture: os.arch(),
});

const getMemoryInfo = () => {
    const total = formatBytes(os.totalmem());
    const free = formatBytes(os.freemem());
    const usage = ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2) + '%';
    return { total, free, usage };
};

const getOsInfo = () => ({
    platform: os.platform(),
    type: os.type(),
    release: os.release(),
    hostname: os.hostname(),
    uptime: formatTime(os.uptime()),
    
});

const getUserInfo = () => os.userInfo();

const getNetworkInfo = () => os.networkInterfaces();

const getProcessInfo = () => {
    const memoryUsage = process.memoryUsage();
    return {
        pid: process.pid,
        title: process.title,
        nodeVersion: process.version,
        uptime: formatTime(process.uptime()),
        cwd: process.cwd(),
        memoryUsage: {
            rss: formatBytes(memoryUsage.rss),
            heapTotal: formatBytes(memoryUsage.heapTotal),
            heapUsed: formatBytes(memoryUsage.heapUsed),
            external: formatBytes(memoryUsage.external),
        },
        env: {
            NODE_ENV: process.env.NODE_ENV || 'Not set',
        },
    };
};

app.get('/all', (req, res) => {
    res.json({
        cpu: getCpuInfo(),
        memory: getMemoryInfo(),
        user: getUserInfo(),
        process: getProcessInfo(),
        os: getOsInfo(),
        network: getNetworkInfo(),
    });
});

app.listen(PORT, () => {
    console.log(`System-view running at http://localhost:${PORT}`);
});
