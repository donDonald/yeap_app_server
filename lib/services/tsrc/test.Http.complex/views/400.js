'use strict';

const assert = require('assert');

module.exports = function (api) {
    assert(api);

    const Handler = function(opts) {
    }

    Handler.prototype.handle = function(req, res, next) {
//      console.log(`${this._logPrefix}.handle(), res.statusCode:${res.statusCode}`);
        const template = {
            title: '400',
            message: `Incorrect parameters`
        };

        res.render('400', template, (err, html)=>{
            if (err) {
                res.status(400);
                this.handle4xx(req, res, next);
                this.log.ctx('400').warn('handling failed');
            } else {
                res.status(400);
                res.send(html);
            }
            this.log.ctx('400').info('handling complete');
        });
    }

    return Handler;
}
