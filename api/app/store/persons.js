let { execute } = require('yop-postgresql');

let Persons = function() {
};

Persons.prototype.create = function(options, callback) {
    execute('insert into person(login) values($1);',
        [options.login], ()=> {
            execute('SELECT last_value FROM person_id_seq;', [], callback);
        });
};
Persons.prototype.findByLogin = function(login, callback) {
    execute('select id, login, customization, client_id, account_id from person where login=$1', [login], callback);
};
Persons.prototype.saveCustomization = function(person, callback) {
    execute('update person set customization=$2 where login=$1', [person.login, person.customization], callback);
};

module.exports = {
    Persons:Persons
};
