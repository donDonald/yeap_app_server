'use strict';

const assert = require('assert');
const metavm = require('metavm');
const vm = require('vm');

const HANDLERS = {'get.js':'GET', 'post.js':'POST', 'delete.js':'DELETE', 'put.js':'PUT'},
      DIRS = {'GET':'get.js', 'POST':'post.js', 'DELETE':'delete.js', 'PUT':'put.js'};

module.exports = (api)=>{
    assert(api);



    const collectRoutes = function(path, routes) {
//      console.log(`collectRoutes(), path:${path}`);

        const fullPath = api.env.makePath(path);
        let files;
        try {
            files = api.fs.readdirSync(fullPath);
//          console.log('collectRoutes, files:', files);
        } catch(e) {
            return;
        }

        files.forEach((file)=>{
            const method = HANDLERS[file];
            if (method) {
                const route = {path:path, method:method};
                routes.push(route);
//              console.log('collectRoutes, route is found:', (path + '/'+ file));
            } else {
                collectRoutes(path + '/' + file, routes);
            }
        });
    }



    const makeStr = (handler)=>{
        const s = ' ';
        const sMethod = handler.method + s.repeat(7-handler.method.length);
        const sAccess = handler.access ? 'SET' : s.repeat(3);
        const sRules = handler.rules ? 'SET' : s.repeat(3);
        const result = `method:${sMethod}, access:${sAccess}, rules:${sRules}, url:${handler.route}`;
        return result;
    }



    const loadRoutes = function(apiStuff, application, router, path, accessController, accessFailure, params) {
//      console.log(`loadRoutes(), path:${path}`);
        const routes = [];
        collectRoutes(path, routes);
//      console.log('loadRoutes, collected routes:');
//      routes.forEach((r, index)=>{console.log(`    route[${index}]:`, r);});

//      console.log('loadRoutes, collected routes:');
        api.log.info('Collected routes:');
        routes.forEach((r, index)=>{
            const path = r.path + '/' + DIRS[r.method];
            const handler = createHandler(apiStuff, application, router, path, accessController, accessFailure, params);
            api.log.info('    ' + makeStr(handler));
        });
    }



    const createHandler = function(apiStuff, application, router, path, accessController, accessFailure, params) {
        let route, method;
        {
            const elements = path.split('/');
            method = elements[elements.length-1];
            elements.shift(); // remove routes
            elements.splice(-1,1); // remove method
            route = '/' + elements.join('/');
            method = HANDLERS[method];
        }
//      console.log(`createHandler(), path:${path}, route:${route}, method:${method}`);

        const Handler = application.require(path + '/Handler.js');

        params = params || {};
        params.route = route;
        params.method = method;
        const sParams = JSON.stringify(params);

        const src = `
            const Handler = ${Handler};
            const Ctor = Handler(api);
            assert.equal(typeof Ctor, 'function');
            const params = JSON.parse('${sParams}');
            const handler = new Ctor(params);
            assert.equal(typeof handler, 'object');
            module.exports = handler;
        `;
        const handler = application.runScript(src);
        const handle = handler.handle.bind(handler);

        const mws = [];

        // Setup access controller
        let access;
        if (accessController) {
            access = accessController.addRoute(path, method, accessFailure);
//          console.log(`createHandler, access:${typeof access}`);
            if (access) {
                handler.access = access;
                mws.push(access);
            }
        }

        // Setup validator
        let rules;
        const validator = api.re(path + '/validator');
//      console.log(`createHandler, validator:${typeof validator}`);
        if (typeof validator === 'function') {
            rules = validator(apiStuff);
//          console.log(`createHandler, rules:${typeof rules}`);
            handler.rules = rules;
            mws.push(rules.rules());
            const validate = rules.validate.bind(undefined, rules.reportFailure);
            mws.push(validate);
        }

        // Add route
        const methodLower = method.toLowerCase();
        const routeHandler = router[methodLower];
//      console.log(`createHandler, new handler is ready, method:${handler.method}, route:${handler.route}`);
        routeHandler.call(router, route, mws, handle);
        return handler;
    }



    return {
        createHandler: createHandler.bind(undefined, api),
        loadRoutes: loadRoutes.bind(undefined, api)
    };
}

