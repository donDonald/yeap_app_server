'use strict';

const assert = require('assert'),
      re = (module)=>{ return require('../' + module); };




module.exports = (api)=>{
    assert(api)




    class ErrorHole {




        constructor(ctx) {
            this._ctx = ctx;
        }




        get name() {
            return 'ErrorHole';
        }




        get log() {
            if (this._ctx) {
                return api.log.ctx(this._ctx).ctx(this.name);
            } else {
                return api.log.ctx(this.name);
            }
        }




        open(opts, cb) {
            this.log.ctx('setup').info('Opening ...');
            this.log.ctx('setup').info('Opening is complete');
            setImmediate(cb);
        }




        close(cb) {
            this.log.ctx('setup').info('Closing ...');
            this.log.ctx('setup').info('Closing is complete');
            setImmediate(cb);
        }




        handle4xx(req, res, next) {
            this.log.ctx('4xx').info('handling...');

            const template = {
                title: `${res.statusCode}`,
                message: `Default error handler`
            };

            res.render('4xx', template, (err, html)=>{
                if (err) {
                    this.log.ctx('4xx').info(`sending status code:${res.statusCode}`);
                    res.sendStatus(res.statusCode);
                } else {
                    res.send(html);
                }
                this.log.ctx('4xx').info('handling complete');
            });
        }




        handle400(req, res, next) {
            if (res.statusCode != 400) {
                return next();
            }

            this.log.ctx('400').info('handling...');

            // Some examples
            // https://github.com/expressjs/express/blob/master/examples/error-pages/views/404.ejs
            // https://github.com/expressjs/express/blob/master/examples/error-pages/views/500.ejs
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




        handle401(req, res, next) {
            this.log.ctx('401').info('handling...');

            const template = {
                title: '401',
                message: `Not authorized access`
            };

            res.render('401', template, (err, html)=>{
                if (err) {
                    res.status(401);
                    this.handle4xx(req, res, next);
                    this.log.ctx('401').warn('handling failed');
                } else {
                    res.status(401);
                    res.send(html);
                }
                this.log.ctx('401').info('handling complete');
            });
        }




        handle404(req, res, next) {
            this.log.ctx('404').info('handling...');

            const template = {
                title: '404',
                message: `The requested URL ${req.url} is not found`
            };

            res.render('404', template, (err, html)=>{
                if (err) {
                    res.status(404);
                    this.handle4xx(req, res, next);
                    this.log.ctx('404').warn('handling failed');
                } else {
                    res.status(404);
                    res.send(html);
                }
                this.log.ctx('404').info('handling complete');
            });
        }
    }




    return ErrorHole;
}

