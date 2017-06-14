"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceLayer = (function () {
    function ServiceLayer() {
    }
    ServiceLayer.httpGetAsync = function (route, query, callback) {
        var fetchRequest = new Request(this.URL + route + '?' + query, {
            method: 'GET',
            body: null,
        });
        fetch(fetchRequest).then(function (res) {
            //res.json() returns a promise of a parsed json object
            return res.json();
        }).then(function (resObj) {
            //Once the object is resolved run the callback with the received object as the parameter
            console.log(resObj);
            callback(resObj);
            console.log('Get Success');
        }).catch(function (ex) {
            console.log('Get Request Error');
            console.error(ex);
        });
    };
    ServiceLayer.httpPostAsync = function (route, data, callback) {
        var fetchRequest = new Request(this.URL + route, {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data),
        });
        console.log(JSON.stringify(data));
        fetch(fetchRequest).then(function (res) {
            return res.json();
        }).then(function (json) {
            callback(json);
            console.log('Post Success');
        }).catch(function (ex) {
            console.log('Post Request Error');
            console.error(ex);
        });
    };
    ServiceLayer.httpDeleteAsync = function (route, query, callback) {
        var fetchRequest = new Request(this.URL + route + '?' + query, {
            method: 'DELETE',
            body: null,
        });
        fetch(fetchRequest).then(function (res) {
            callback(res);
            return res.json();
        }).then(function (json) {
            console.log('Delete Success');
            console.log(json);
        }).catch(function (ex) {
            console.log('Delete Request Error');
            console.error(ex);
        });
    };
    return ServiceLayer;
}());
ServiceLayer.URL = 'http://192.168.100.186:3000';
exports.ServiceLayer = ServiceLayer;
