'use strict';

const assert = require('assert');

module.exports = (api) =>{
    assert(api);
    assert(api.path);

    return {
        loggerSetup: (appDir)=>{
            const loggerCfg = {
                writeIntervalMs: 5000, // 5 secs
                writeBufferBytes: 128 * 1024, // Buffer size 128kb
                streams: ['system', 'fatal', 'error', 'warn', 'info', 'debug', 'access']
            };
            loggerCfg.path = api.path.join(appDir, 'logs');
            const loggerFs = new api.logger.LoggerFs(loggerCfg);
            loggerFs.open();
            return loggerFs;
        },

        loggerTeardown: (service, cb)=>{
            api.log.setNext();
            const loggerFs = service.loggerFs;
            assert(loggerFs);
            assert.equal('object', typeof loggerFs);
            loggerFs.close((err)=>{
                assert(!err)
                cb();
            });
        }
    }
}

