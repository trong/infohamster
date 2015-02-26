'use strict';

var redis = require("redis"),
    _ = require('lodash'),
    imodule = _.cloneDeep(require('../../imodule'));

module.exports = _.extend(imodule, {
    name: 'redis-slowlog',

    _prepareConnections: function () {
        var self = this,
            servers = self._config.modules[self.name].servers;

        for (var i = 0; i < servers.length; i++) {
            this._servers[i] = redis.createClient(servers[i].port, servers[i].host);

            this._servers[i].on("error", function (err) {
                self._logger.error(err);
            });

            if (servers[i].db != 0) {
                this._servers[i].select(0);
            }
        }
    },

    _watch: function () {
        var self = this;

        for (var i = 0; i < self._servers.length; i++) {
            self._servers[i].slowlog('get', 10, _.bind(function (err, doc) {
                if (!err) {
                    self._process(doc, self._config.modules[self.name].servers[this.index]);
                }
            }, {index: i}));
        }
    },

    _process: function (doc, server) {
        var self = this,
            bulk = [],
            index = {
                index: {
                    _index: this._todaysIndex(this._config.modules[this.name].index),
                    _type: this.name
                }
            };

        for (var i = 0; i < doc.length; i++) {
            bulk.push(index);
            bulk.push({
                point: server,
                slowlog: {
                    id: doc[i][0],
                    start_time: doc[i][1],
                    execution_time: doc[i][2],
                    query: doc[i][3].join(' '),
                    cmd: doc[i][3][0]//,
                    //cmd_partial: doc[i][3]
                },
                '@timestamp': new Date()
            });
        }

        if (bulk.length > 0) {
            this._elasticsearch.bulk({
                body: bulk
            }, function (error, response) {
                if (error) {
                    self._logger.error(error);
                } else {
                    self._logger.info('Slow log: ' + JSON.stringify(server));
                }
            });
        }
    }
});