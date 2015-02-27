'use strict';

/**
 * @author <Vadim Madison> vadim.a.madison@gmail.com
 */

var config = require('../config'),
    log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console',
            layout: {
                type: "pattern",
                pattern: "[%d] %[[%p]%] - %m"
            }
        }
    ],
    replaceConsole: true
});

/**
 * @type {Logger}
 */
var logger = log4js.getLogger('main');

module.exports = logger;