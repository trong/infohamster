'use strict';

var monitor = require('./app/monitor'),
    logger = require('./app/logger');

logger.info('Service starting ...');
monitor.start();

process.on('uncaughtException', function(err) {
    console.log(err);
})