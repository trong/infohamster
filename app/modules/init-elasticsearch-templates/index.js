'use strict';

var _ = require('lodash'),
    fs = require('fs'),
    imodule = _.cloneDeep(require('../../imodule'));

module.exports = _.extend(imodule, {
    name: 'init-elasticsearch-templates',

    start: function (config, elasticsearch) {
        this._config = config;
        this._elasticsearch = elasticsearch;

        var templates = this._getPathsToTemplates();

        for (var template in templates) {
            var mapping = {
                name: templates[template].name,
                body: this._prepareTemplate(templates[template].name, templates[template].path)
            };

            this._elasticsearch.indices.putTemplate(mapping, function (err, res) {
                if (err) {
                    console.error(err);
                }
            });
        }
    },

    _getPathsToTemplates: function () {
        var result = [];

        for (var key in this._config.modules) {
            if (key == this.name) continue;
            var path = __dirname + '/../' + key + '/template.json';

            if (fs.existsSync(path)) {
                result.push({
                    name: key,
                    path: path
                });
            }
        }

        return result;
    },

    _prepareTemplate: function (module, mapping) {
        var result = {
            "template": this._config.modules[module].index + '-*',
            "mappings": {}
        };

        result['mappings'][module] = JSON.parse(fs.readFileSync(mapping));

        return result;
    }
});