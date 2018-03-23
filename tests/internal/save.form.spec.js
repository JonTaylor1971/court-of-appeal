var expect = require('chai').expect;
var Database = require('../../app/database');
var Migrator = require('../../app/migrations/migrator');
var Truncator = require('../support/truncator');
var { localhost } = require('../support/postgres.client.factory');

describe('Save form', function() {

    var database;

    beforeEach(function(done) {
        database = new Database(localhost);
        var migrator = new Migrator(localhost);
        migrator.migrateNow(function() {
            var truncator = new Truncator(localhost);
            truncator.truncateTablesNow(function() {
                done();
            });
        });
    });

    it('defaults status to draft', function(done) {
        var form = {
            type: 'form-2',
            data: { value:42 }
        };
        database.saveForm(form, function(id) {            
            expect(id).not.to.equal(undefined);
            var client = localhost();
            client.connect(function(err) {                
                expect(err).to.equal(null);
                var sql = 'SELECT id, type, status, data FROM forms';
                client.query(sql, function(err, result) {
                    expect(err).to.equal(null);
                    expect(result.rows.length).to.equal(1);
                    var { type, status } = result.rows[0];
                    
                    expect(type).to.equal('form-2');
                    expect(status).to.equal('draft');
                    client.end();
                    done();
                });
            });
        });
    });
});