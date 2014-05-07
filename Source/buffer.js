/*
---
description: Buffer

license: MIT-style

authors: Olivier Gasc (gasc.olivier@gmail.com)

requires:
- Array
- Options
- Asset

provides: [Buffer]
...
*/

var Buffer = new Class({
    Implements: Options,

    buffer: {},

    options: {
        debug: false,
        cache: false,
        path: '/'
    },

    initialize: function(options) {
        this.setOptions(options);
    },

    get: function(type, key) {
        if (key === undefined) {
            if (this.buffer[type] !== undefined)
                return this.buffer[type];
        } else {
            if (this.buffer[type] !== undefined && this.buffer[type][key] !== undefined)
                return this.buffer[type][key];
        }

        return false;
    },

    set: function(type, src, fn, args) {
        if (this.buffer[type] === undefined) this.buffer[type] = {};

        if (src instanceof Array) {
            var length = src.length,
                loaded = {},
                count = 0,
                time = +new Date;

            src.each(function(s) {
                if (this.buffer[type][s] === undefined) {
                    new Asset.image(this.options.path + s + (this.options.cache ? '?' + time : ''), {
                        onLoad: function(el) {
                            this.buffer[type][s] = el;
                            loaded[s] = el;

                            if (++count === length)
                                fn.apply(this, [loaded].append(args !== undefined ? (args instanceof Array ? args : [args]) : []));
                        }.bind(this),
                        onError: function() {
                            if (this.options.debug) console.error('Failed to load image', arguments);

                            if (++count === length)
                                fn.apply(this, [loaded].append(args !== undefined ? (args instanceof Array ? args : [args]) : []));
                        }.bind(this),
                        onAbort: function() {
                            if (this.options.debug) console.error('Loading image aborted', arguments);

                            if (++count === length)
                                fn.apply(this, [loaded].append(args !== undefined ? (args instanceof Array ? args : [args]) : []));
                        }.bind(this)
                    });
                } else {
                    loaded[s] = this.buffer[type][s];

                    if (++count === length)
                        fn.apply(this, [loaded].append(args !== undefined ? (args instanceof Array ? args : [args]) : []));
                }
            }.bind(this));
        } else {
            if (this.buffer[type][src] === undefined) {
                new Asset.image(this.options.path + src + '?' + (+new Date), {
                    onLoad: function(el) {
                        this.buffer[type][src] = el;

                        fn.apply(this, [el].append(args !== undefined ? (args instanceof Array ? args : [args]) : []));
                    }.bind(this),
                    onError: function() {
                        if (this.options.debug) console.error('Failed to load image', arguments);
                    }.bind(this),
                    onAbort: function() {
                        if (this.options.debug) console.error('Loading image aborted', arguments);

                        if (++count === length)
                            fn.apply(this, [loaded].append(args !== undefined ? (args instanceof Array ? args : [args]) : []));
                    }.bind(this)
                });
            } else fn.apply(this, [this.buffer[type][src]].append(args !== undefined ? (args instanceof Array ? args : [args]) : []));
        }

        return this;
    },

    path: function(path) {
        if (path !== undefined)
            this.options.path = path;

        return path;
    },

    remove: function(type, key) {
        if (key === undefined) {
            if (this.buffer[type] !== undefined)
                delete this.buffer[type];
        } else {
            if (this.buffer[type] !== undefined && this.buffer[type][key] !== undefined)
                delete this.buffer[type][key];
        }

        return this;
    }
});