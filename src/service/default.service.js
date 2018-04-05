let fakeData = { 
    parties: {
        appellant: {
            name: 'Bruce Wayne',
            address: 'The Wayne Castle'
        },
        respondent: {
            name: 'Clark Kent',
            address: 'This guy does not need any'
        }
    }
};

var Service = function() {  
    this.apiUrl = undefined;
    this.serveLocalData = false;  
};

Service.prototype.setServeLocalData = function(flag) {    
    this.serveLocalData = flag;
};

Service.prototype.connect = function() {    
    return require('socket.io-client')(this.apiUrl);
};

Service.prototype.searchForm7 = function(file, callback) {
    if (this.serveLocalData) {
        callback(fakeData);
    } else {
        let socket = this.connect();
        socket.on('connect_error', function(error) {
            callback(undefined);
            socket.close();
        });
        socket.emit('form-7-search', { file:file }, function(data) {
            callback(data);
            socket.close();
        });
    }
};

Service.prototype.saveForm2 = function(form, callback) {    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", this.apiUrl + '/forms', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {     
        if(xhr.readyState == xhr.DONE && xhr.status==201) {
            callback(xhr.responseText);
        }
    }
    let params = 'data=' + JSON.stringify(form);
    xhr.send(params); 
};

Service.prototype.getMyCases = function(form, callback) {    
    let socket = this.connect();
    socket.on('connect_error', function(error) {
        callback(undefined);
        socket.close();
    });
    socket.emit('my-cases', { data:{} }, function(data) {        
        callback(data);
        socket.close();
    });
};

module.exports = Service;
module.exports.fakeData = fakeData;