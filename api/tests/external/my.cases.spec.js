var expect = require('chai').expect;
var Server = require('../../app/server/server');
var Database = require('../../app/store/database');
var Migrator = require('../../app/migrations/migrator');
var Truncator = require('../support/truncator');
var { execute } = require('../../app/libs/yop.postgresql');
var { request, localhost5000json } = require('../support/request');

describe('My cases endpoint', function() {

    var server;
    var database;
    var mycases = localhost5000json({
        path: '/api/cases',
    });

    beforeEach(function(done) {
        server = new Server();
        database = new Database();
        server.useDatabase(database);
        var migrator = new Migrator();
        migrator.migrateNow(function() {
            var truncator = new Truncator();
            truncator.truncateTablesNow(function() {
                server.start(5000, 'localhost', done);
            });
        });
    });

    afterEach(function(done) {
        server.stop(done);
    });

    it('is a rest service', function(done){
        var background = [
            'alter sequence person_id_seq restart',
            { sql:'insert into person(login) values ($1)', params:['bob'] },
            { sql:'insert into person(login) values ($1)', params:['max'] },
            { sql: 'insert into forms(person_id, type, status, data) values($1, $2, $3, $4);', params:[1, 'crazy-bob', 'new', JSON.stringify({value:'bob'})] },
            { sql: 'insert into forms(person_id, type, status, data) values($1, $2, $3, $4);', params:[2, 'crazy-max', 'new', JSON.stringify({value:'max'})] },
            'select last_value from forms_id_seq'
        ];
        execute(background, function(err, rows) {
            var newId = parseInt(rows[0].last_value);
            request(mycases, (err, response, body)=> {
                expect(response.statusCode).to.equal(200);
                let theCase = JSON.parse(body).cases[0];

                expect(theCase.id).to.equal(newId);
                expect(theCase.type).to.equal('crazy-max');
                expect(theCase.status).to.equal('new');
                expect(theCase.data).to.deep.equal({value:'max'});
                expect(new Date()-new Date(theCase.modified)).to.be.lessThan(2000);
                done();
            });
        });
    });

    it('ignores archived case', function(done){
        var background = [
            'alter sequence person_id_seq restart',
            { sql:'insert into person(login) values ($1)', params:['max'] },
            { sql: 'insert into forms(person_id, type, status, data) values($1, $2, $3, $4);', params:[1, 'crazy-max', 'archived', JSON.stringify({value:'max'})] },
            'select last_value from forms_id_seq'
        ];
        execute(background, function(err, rows) {
            var newId = parseInt(rows[0].last_value);
            request(mycases, (err, response, body)=> {
                expect(response.statusCode).to.equal(200);
                let cases = JSON.parse(body).cases;

                expect(cases.length).to.equal(0);
                done();
            });
        });
    });

});
