'use strict';

describe('lib.tools.types', ()=>{

    let assert, api;

    before(()=>{
        assert = require('assert');
        const re = function(module) { return require('../../' + module); }

        api = {};
        api.lib = {};
        api.lib.tools     = {};
        api.lib.tools.types = re('tools/types.js')(api);
    });

    describe('lib.tools.types.hash4', ()=>{
        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash4.test('0000'));
            assert.equal(true, api.lib.tools.types.hash4.test('9999'));
        });

        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash4.test('aaaa'));
            assert.equal(true, api.lib.tools.types.hash4.test('AAAA'));
        });

        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash4.test('ffff'));
            assert.equal(true, api.lib.tools.types.hash4.test('FFFF'));
        });

        it('Failure cases', ()=>{
            assert.equal(false, api.lib.tools.types.hash4.test(''));
            assert.equal(false, api.lib.tools.types.hash4.test('000'));
            assert.equal(false, api.lib.tools.types.hash4.test('00000'));
            assert.equal(false, api.lib.tools.types.hash4.test('0000a'));
        });
    });

    describe('lib.tools.types.hash8', ()=>{
        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash8.test('00000000'));
            assert.equal(true, api.lib.tools.types.hash8.test('99999999'));
        });

        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash8.test('aaaaaaaa'));
            assert.equal(true, api.lib.tools.types.hash8.test('AAAAAAAA'));
        });

        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash8.test('ffffffff'));
            assert.equal(true, api.lib.tools.types.hash8.test('FFFFFFFF'));
        });

        it('Failure cases', ()=>{
            assert.equal(false, api.lib.tools.types.hash8.test(''));
            assert.equal(false, api.lib.tools.types.hash8.test('0000000'));
            assert.equal(false, api.lib.tools.types.hash8.test('000000000'));
            assert.equal(false, api.lib.tools.types.hash8.test('00000000a'));
        });
    });

    describe('lib.tools.types.hash16', ()=>{
        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash16.test('0000000000000000'));
            assert.equal(true, api.lib.tools.types.hash16.test('9999999999999999'));
        });

        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash16.test('aaaaaaaaaaaaaaaa'));
            assert.equal(true, api.lib.tools.types.hash16.test('AAAAAAAAAAAAAAAA'));
        });

        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash16.test('ffffffffffffffff'));
            assert.equal(true, api.lib.tools.types.hash16.test('FFFFFFFFFFFFFFFF'));
        });

        it('Failure cases', ()=>{
            assert.equal(false, api.lib.tools.types.hash16.test(''));
            assert.equal(false, api.lib.tools.types.hash16.test('000000000000000'));
            assert.equal(false, api.lib.tools.types.hash16.test('00000000000000000'));
            assert.equal(false, api.lib.tools.types.hash16.test('0000000000000000a'));
        });
    });

    describe('lib.tools.types.hash32', ()=>{
        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash32.test('00000000000000000000000000000000'));
            assert.equal(true, api.lib.tools.types.hash32.test('99999999999999999999999999999999'));
        });

        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash32.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'));
            assert.equal(true, api.lib.tools.types.hash32.test('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'));
        });

        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.hash32.test('ffffffffffffffffffffffffffffffff'));
            assert.equal(true, api.lib.tools.types.hash32.test('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'));
        });

        it('Failure cases', ()=>{
            assert.equal(false, api.lib.tools.types.hash32.test(''));
            assert.equal(false, api.lib.tools.types.hash32.test('0000000000000000000000000000000'));
            assert.equal(false, api.lib.tools.types.hash32.test('000000000000000000000000000000000'));
            assert.equal(false, api.lib.tools.types.hash32.test('00000000000000000000000000000000a'));
        });
    });

    describe('lib.tools.types.text8max', ()=>{
        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.text8max.test('a'));
            assert.equal(true, api.lib.tools.types.text8max.test('AA'));
            assert.equal(true, api.lib.tools.types.text8max.test('fff'));
            assert.equal(true, api.lib.tools.types.text8max.test('FFFF'));
            assert.equal(true, api.lib.tools.types.text8max.test('yyyyyyy'));
            assert.equal(true, api.lib.tools.types.text8max.test('YYYYYYY'));
            assert.equal(true, api.lib.tools.types.text8max.test('ffffffff'));
            assert.equal(true, api.lib.tools.types.text8max.test('FFFFFFFF'));
        });

        it('Failure cases', ()=>{
            assert.equal(true, api.lib.tools.types.text8max.test('a'));
            assert.equal(true, api.lib.tools.types.text8max.test('AA'));
            assert.equal(true, api.lib.tools.types.text8max.test('fff'));
            assert.equal(true, api.lib.tools.types.text8max.test('FFFF'));
            assert.equal(true, api.lib.tools.types.text8max.test('yyyyyyy'));
            assert.equal(true, api.lib.tools.types.text8max.test('YYYYYYY'));
            assert.equal(true, api.lib.tools.types.text8max.test('ffffffff'));
            assert.equal(true, api.lib.tools.types.text8max.test('FFFFFFFF'));
        });
    });

    describe('lib.tools.types.name', ()=>{
        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.name.test('AA'));
            assert.equal(true, api.lib.tools.types.name.test('aaa'));
            assert.equal(true, api.lib.tools.types.name.test('FFFF'));
            assert.equal(true, api.lib.tools.types.name.test('yyyyyyy'));
            assert.equal(true, api.lib.tools.types.name.test('YYYYYYY'));
            assert.equal(true, api.lib.tools.types.name.test('ffffffff'));
            assert.equal(true, api.lib.tools.types.name.test('FFFFFFFF'));
            assert.equal(true, api.lib.tools.types.name.test('aaaabbbbyyyyzzzz'));
        });

        it('Failure cases', ()=>{
            assert.equal(false, api.lib.tools.types.name.test('A'));
            assert.equal(false, api.lib.tools.types.name.test('A0'));
            assert.equal(false, api.lib.tools.types.name.test('0A'));
            assert.equal(false, api.lib.tools.types.name.test('00000'));
            assert.equal(false, api.lib.tools.types.name.test('Abcdefghigklmnxyz'));
        });
    });

    describe('lib.tools.types.uint', ()=>{
        it('Success cases', ()=>{
            assert.equal(true, api.lib.tools.types.uint.test('0'));
            assert.equal(true, api.lib.tools.types.uint.test('1'));
            assert.equal(true, api.lib.tools.types.uint.test('0123456789012345'));
        });

        it('Failure cases', ()=>{
            assert.equal(false, api.lib.tools.types.uint.test(''));
            assert.equal(false, api.lib.tools.types.uint.test('a'));
            assert.equal(false, api.lib.tools.types.uint.test('-1'));
            assert.equal(false, api.lib.tools.types.uint.test('01234567890123456'));
        });
    });

});
