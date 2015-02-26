'use strict';

var MongoClient = require('mongodb').MongoClient,
    _ = require('lodash'),
    imodule = _.cloneDeep(require('../../imodule'));

module.exports = _.extend(imodule, {
    name: 'mongodb',

    _prepareConnections: function () {
        var self = this,
            servers = self._config.modules[self.name].servers;

        for (var i = 0; i < servers.length; i++) {
            var url = 'mongodb://' + servers[i].host + ':' + servers[i].port;

            MongoClient.connect(url, _.bind(function (err, db) {
                if (err) {
                    self._logger.error(err);
                } else {
                    self._logger.debug(self.name + ' - connected to ' + url);
                    self._servers[this.index] = db;
                }
            }, {index: i}));
        }
    },

    _watch: function () {
        var self = this;

        for (var i = 0; i < self._servers.length; i++) {
            self._servers[i].command({serverStatus: 1}, _.bind(function (err, doc) {
                if (!err) {
                    self._process(doc, self._config.modules[self.name].servers[this.index]);
                } else {
                    self._logger.error(err);
                }
            }, {index: i}));
        }
    }
});