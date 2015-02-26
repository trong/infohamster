'use strict';

var moment = require('moment'),
    _ = require('lodash');

module.exports = {
    name: 'default',

    _config: null,
    _logger: null,
    _elasticsearch: null,
    _timer: null,

    _servers: [],

    init: function () {
        this._prepareConnections();
        this._watch = _.bind(this._watch, this);
    },

    start: function (config, logger, elasticsearch) {
        this._config = config;
        this._logger = logger;
        this._elasticsearch = elasticsearch;

        this.init();

        this._timer = setInterval(this._watch, this._config.modules[this.name].interval);
    },

    stop: function () {
        var self = this,
            servers = self._config.modules[self.name].servers;

        for (var i = 0; i < servers.length; i++) {
            servers[i].close();
        }

        if (self._timer != null) {
            clearInterval(self._timer);
        }
    },

    _prepareConnections: function () {
        console.log('default _prepareConnections');
    },

    _watch: function () {
        console.log('default _watch');
    },

    _push: function (index, type, doc, server) {
        var self = this;

        this._elasticsearch.create({
            index: index,
            type: type,
            body: {
                point: server,
                stat: doc,
                '@timestamp': new Date()
            }
        }, function (error, response) {
            if (error) {
                self._logger.error(error);
            } else {
                self._logger.info('Module ' + self.name + ' status: ' + JSON.stringify(server));
            }
        });
    },

    _process: function (doc, server) {
        this._push(
            this._todaysIndex(this._config.modules[this.name].index),
            this.name,
            doc,
            server
        );
    },

    _todaysIndex: function (index) {
        return index + '-' + moment().format('YYYY.MM.DD');
    }
};