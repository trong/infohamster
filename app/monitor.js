'use strict';

var elasticsearch = require('elasticsearch'),
    config = require('./../config'),
    logger = require('./logger');

module.exports = {
    _elasticsearch: null,
    _initialized: false,
    _modules: [],

    /**
     * Init service
     */
    init: function () {
        if (!this._initialized) {
            this._prepareElasticsearch();
            this._loadModules();

            this._initialized = true;
        }
    },

    /**
     * Start service
     */
    start: function () {
        this.init();

        for (var i = 0; i < this._modules.length; i++) {
            this._modules[i].start(config, logger, this._elasticsearch);
        }
    },

    /**
     * Prepare connection to Elasticsearch
     * @private
     */
    _prepareElasticsearch: function () {
        this._elasticsearch = new elasticsearch.Client({
            host: config.elasticsearch.host + ':' + config.elasticsearch.port//,
            //log: 'trace'
        });
    },

    _loadModules: function () {
        for (var key in config.modules) {
            if (config.modules[key].enabled != false) {
                logger.info('Load module: ' + key);
                this._modules.push(require('./modules/' + key + '/index'));
            }
        }
    }
};