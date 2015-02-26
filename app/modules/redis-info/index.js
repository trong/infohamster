'use strict';

var redis = require("redis"),
    _ = require('lodash'),
    parser = require('./parser'),
    imodule = _.cloneDeep(require('../../imodule'));

module.exports = _.extend(imodule, {
    name: 'redis-info',

    commands_processed: [],

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
            self._servers[i]
                .multi()
                .info()
                .info("commandstats")
                .exec(_.bind(function (err, doc) {
                    if (!err) {
                        var item = parser.parse(doc[0] + doc[1]),
                            server = self._config.modules[self.name].servers[this.index].name;

                        item['Stats']['total_commands_processed_delta'] = self.commands_processed[server] ? item['Stats']['total_commands_processed'] - self.commands_processed[server] : 0;
                        self.commands_processed[server] = item['Stats']['total_commands_processed'];


                        self._process(item, self._config.modules[self.name].servers[this.index]);
                    } else {
                        self._logger.error(err);
                    }
                }, {index: i}));
        }
    }
});