require('app-module-path').addPath(__dirname);
const config = require('./app/config/environment');
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var Database = require('./app/store/database');
var database = new Database();
var Migrator = require('./app/migrations/migrator');
var migrator = new Migrator();

var Server = require('./app/server/server');
var server = new Server();

if (process.env.HUB_URL !=='undefined' && process.env.HUB_URL !==undefined) {
    console.log('hub is ' + process.env.HUB_URL);
    let timeout = (process.env.HUB_TIMEOUT!=='undefined' && process.env.HUB_TIMEOUT!==undefined) ?
                parseInt(process.env.HUB_TIMEOUT):2000;
    if (isNaN(timeout)) { timeout = 2000; }
    console.log('hub timeout is ' + timeout);
    var Hub = require('./app/hub/hub');
    var hub = new Hub(process.env.HUB_URL, timeout);
    server.useService(hub);
}
server.useDatabase(database);

console.log('migrating...');
migrator.migrateNow(function(error) {
    if (error)
        console.log('Error: ' + error);
    console.log('migrations done');
    server.start(port, ip, function() {
        console.log(ip + ' listening on port ' + port);
    });
});

module.exports = server;
module.exports.port = port;
module.exports.ip = ip;
