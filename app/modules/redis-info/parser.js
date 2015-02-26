'use strict';

module.exports = {
    /**
     * Parse Redis Info response
     *
     * @param {string} doc
     * @returns {object}
     */
    parse: function (doc) {
        var parts = doc.split('#');
        var item = {};

        for (var i = 1; i < parts.length; i++) {
            var data = parts[i].trim().split("\r\n");

            item[data[0]] = {};
            for (var j = 1; j < data.length; j++) {
                var point = data[j].split(':'),
                    key = point[0].trim(),
                    value = point[1].trim();

                if (this._isNum(value)) {
                    if (value.indexOf('.') > 0) {
                        item[data[0]][key] = parseFloat(value);
                    } else {
                        item[data[0]][key] = parseInt(value);
                    }
                } else {
                    item[data[0]][key] = (data[0] == 'Keyspace' || data[0] == 'Commandstats') ? this._splitkeys(value) : value;
                }
            }
        }
        return item;
    },

    /**
     * Custom parser for multikeys block
     *
     * @param {string} data
     * @returns {object}
     * @private
     */
    _splitkeys: function (data) {
        var item = {};

        var db = data.split(',');
        for (var k = 0; k < db.length; k++) {
            var info = db[k].split('=');

            item[info[0]] = parseInt(info[1]);
        }

        return item;
    },

    /**
     * Is it number?
     *
     * @param mixed_var
     * @returns {boolean}
     * @private
     */
    _isNum: function (mixed_var) {
        var whitespace =
            " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
        return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
                1)) && mixed_var !== '' && !isNaN(mixed_var);
    }
};