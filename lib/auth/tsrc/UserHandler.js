'use strict';

describe('lib.auth.UserHandler', ()=>{

    const assert = require('assert');
    const re = (module)=>{ return require('../../' + module); }
    const createDbName=(name)=>{ return re('db/tools').createDbName('lib_auth_userhandler_') + name };

    let api, masterDbProps, dbProps;

    // Database record
    let Record = function (props) {
        if (props.uid) this.uid = props.uid;
        if (props.cat) this.uid = props.cat;
        if (props.name) this.name = props.name;
        if (props.email) this.email = props.email;
        if (props.stts) this.stts = props.stts;

        const authProviderId = props.authProviderId || props[Record.dbKeys.authProviderId];
        if (authProviderId) this.authProviderId = authProviderId;
    }

    // \brief These keys are mant for mapping JS fileds to DB fields.
    //        Postgresql doesn't support camel-case notation.
    Record.dbKeys = {};
    Record.dbKeys.uid = 'uid';
    Record.dbKeys.cat = 'cat';
    Record.dbKeys.authProviderId = 'auth_provider_id';
    Record.dbKeys.name = 'name';
    Record.dbKeys.email = 'email';
    Record.dbKeys.stts = 'stts';
    Record.dbKeysArray = Object.values(Record.dbKeys);

    // Database schema
    const schema =
    'CREATE TABLE IF NOT EXISTS records ( \
        uid                   CHAR(32) PRIMARY KEY, \
        cat                   CHAR(32), \
        auth_provider_id      VARCHAR (100) NOT NULL, \
        name                  VARCHAR (100) NOT NULL, \
        email                 VARCHAR (100) NOT NULL, \
        stindex               SERIAL, \
        stts                  TIMESTAMP NOT NULL DEFAULT NOW() \
    ); \
     \
    CREATE UNIQUE INDEX IF NOT EXISTS idx_records_uid ON records (uid); \
    CREATE UNIQUE INDEX IF NOT EXISTS idx_records_stts ON records (stts);'

    before(()=>{
        api = {};
        api.fs = require('fs');
        api.lib = {};
        api.lib.db = {};
        api.lib.db.tools = re('db/tools');
        api.lib.db.DbPool = re('db/DbPool')(api);
        api.lib.Md5 = re('Md5')(api);
        api.lib.makeId = re('makeId')(api);
        api.lib.model = {};
        api.lib.model.helpers = {};
        api.lib.model.helpers.count = re('model/helpers/count');
        api.lib.model.helpers.add = re('model/helpers/add');
        api.lib.model.helpers.query = re('model/helpers/query');
        api.lib.auth = {};
        api.lib.auth.UserHandler = re('auth/UserHandler')(api);

        // Database record
        Record.makeId = api.lib.makeId;
        Record.makeCat = api.lib.makeId;

        masterDbProps = api.lib.db.tools.masterDbProps;
        dbProps = JSON.parse(JSON.stringify(masterDbProps));
    });

    describe('#UserHandler.handle()', ()=>{

        before((done)=>{
            dbProps.database = createDbName('handle');
            api.lib.db.tools.create(
                masterDbProps,
                dbProps.database,
                (err)=>{
                    assert(!err, err);
                    done();
                }
            );
        });

        after((done)=>{
            records.dbc.end(done);
        });

        let records;
        it('Create Records', (done)=>{

            const Records = function(dbProps) {
                this.dbc = new api.lib.db.DbPool(dbProps);
                this.tableName = 'records';
                this.add = api.lib.model.helpers.add.bind(this, this.dbc, this.tableName, Record);
                this.count = api.lib.model.helpers.count.bind(this, this.dbc, this.tableName);
                this.inserter = function(values, value)
                {
                    if (!values) {
                        return [];
                    }
                    values.push(value);
                    return values;
                }
                this.query = api.lib.model.helpers.query.run.bind(this, this.dbc, this.tableName, Record, this.inserter);
            }

            Records.construct = function (dbProps, cb) {
                let records = new Records(dbProps);
                records.init((err)=>{
                    if (err) {
                        records = undefined;
                    }
                    cb(err, records);
                });
            }

            Records.prototype.init = function(cb) {
                api.lib.db.tools.querySqls(this.dbc, [schema], (err)=>{
                    cb(err);
                });
            }

            Records.construct(dbProps, (err, r)=>{
                assert(!err, err);
                records = r;
                assert(records);
                done();
            });
        });

        let userHandler;
        it('Create UserHandler', ()=>{
            const provider = {
                name: 'test',
                logName: '[test]'
            };

            const collectUser = (profile)=>{
                const user = {
                    // Mandatory
                    //authProviderRawString: JSON.stringify(profile),
                    //authProviderName:      provider.name,
                    authProviderId:        profile.id,
                    name:                  profile.name,
                    email:                 profile.email,
                };
                return user;
            }

            userHandler = new api.lib.auth.UserHandler(
                provider,
                records,
                collectUser,
                Record
            );
        });

        it('Count records, shall be 0', (done)=>{
            records.count((err, count)=>{
                assert(!err, err);
                assert.equal(0, count);
                done();
            });
        });

        const profileIvan = {
            id: 'Ivan123',
            name: 'Ivan',
            email: 'Ivan@mail.com'
        };
        it('UserHandler.handle, new Ivan', (done)=>{
            userHandler.handle(
                'accessToken',
                'refreshToken',
                profileIvan,
                (err, user)=>{
                    assert(!err, err);
                    assert(user);
                    done();
                }
            );
        });

        it('Count records, shall be 1', (done)=>{
            records.count((err, count)=>{
                assert(!err, err);
                assert.equal(1, count);
                done();
            });
        });

        it('Find Ivan', (done)=>{
            const params = {where:{}};
            params.where[Record.dbKeys.authProviderId] = profileIvan.id;
            records.query(params, (err, user)=>{
                assert(!err, err);
                assert(user);
                user = user[Object.keys(user)[0]];
                assert.equal(profileIvan.id, user.authProviderId);
                assert.equal(profileIvan.name, user.name);
                assert.equal(profileIvan.email, user.email);
                done();
            });
        });

        it('UserHandler.handle, existing Ivan', (done)=>{
            userHandler.handle(
                'accessToken',
                'refreshToken',
                profileIvan,
                (err, user)=>{
                    assert(!err, err);
                    assert(user);
                    done();
                }
            );
        });

        it('Count records, shall be 1', (done)=>{
            records.count((err, count)=>{
                assert(!err, err);
                assert.equal(1, count);
                done();
            });
        });

        it('Find Ivan', (done)=>{
            const params = {where:{}};
            params.where[Record.dbKeys.authProviderId] = profileIvan.id;
            records.query(params, (err, user)=>{
                assert(!err, err);
                assert(user);
                user = user[Object.keys(user)[0]];
                assert.equal(profileIvan.id, user.authProviderId);
                assert.equal(profileIvan.name, user.name);
                assert.equal(profileIvan.email, user.email);
                done();
            });
        });

        const profileNatali = {
            id: 'Natali123',
            name: 'Natali',
            email: 'Natali@email.com',
        };
        it('UserHandler.handle, new Natali user', (done)=>{
            userHandler.handle(
                'accessToken',
                'refreshToken',
                profileNatali,
                (err, user)=>{
                    assert(!err, err);
                    assert(user);
                    done();
                }
            );
        });

        it('Count records, shall be 2', (done)=>{
            records.count((err, count)=>{
                assert(!err, err);
                assert.equal(2, count);
                done();
            });
        });

        it('Find Natali', (done)=>{
            const params = {where:{}};
            params.where[Record.dbKeys.authProviderId] = profileNatali.id;
            records.query(params, (err, user)=>{
                assert(!err, err);
                assert(user);
                user = user[Object.keys(user)[0]];
                assert.equal(profileNatali.id, user.authProviderId);
                assert.equal(profileNatali.name, user.name);
                assert.equal(profileNatali.email, user.email);
                done();
            });
        });

        it('UserHandler.handle, existing Natali user', (done)=>{
            userHandler.handle(
                'accessToken',
                'refreshToken',
                profileNatali,
                (err, user)=>{
                    assert(!err, err);
                    assert(user);
                    done();
                }
            );
        });

        it('Count records, shall be 2', (done)=>{
            records.count((err, count)=>{
                assert(!err, err);
                assert.equal(2, count);
                done();
            });
        });

        it('Find Natali', (done)=>{
            const params = {where:{}};
            params.where[Record.dbKeys.authProviderId] = profileNatali.id;
            records.query(params, (err, user)=>{
                assert(!err, err);
                assert(user);
                user = user[Object.keys(user)[0]];
                assert.equal(profileNatali.id, user.authProviderId);
                assert.equal(profileNatali.name, user.name);
                assert.equal(profileNatali.email, user.email);
                done();
            });
        });
    });

});
