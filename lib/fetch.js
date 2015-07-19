'use strict';

var https = require('https');
var http = require('http');
var url = require('url');

module.exports = function getSchema(listingUrl, callback){
  var getListing = function(error, resourceListing){
    if (!resourceListing.apis && resourceListing.swagger === '2.0')
      return console.error('Unfortunately this tool was designed for swagger v1.2');

    if (error) return callback(error, resourceListing);

    var apis = resourceListing.apis;
    var waitCounter = apis.length;

    apis.map(function(resourceObject){
      function apiDeclarationHandler(error, apiDeclaration){
        if (error) return callback(error);
        resourceObject.apiDeclaration = apiDeclaration;
        waitCounter--;
        if(waitCounter === 0) callback(null, resourceListing);
      }

      var declarationUrl = resourceObject.path.replace('{format}', 'json');
      getApiDeclarations(listingUrl, declarationUrl, apiDeclarationHandler);
    });

  };

  getJson(listingUrl, getListing);
};

function getApiDeclarations(listingUrl, declarationUrl, callback){
  var apiDeclarationUrl = getApiDeclarationUrl(listingUrl, declarationUrl);
  getJson(apiDeclarationUrl, callback);
}

// https://github.com/wordnik/swagger-spec/blob/master/versions/1.2.md#aePath
function getApiDeclarationUrl(listingUrl, declarationUrl) {
  listingUrl = url.parse(listingUrl);
  
  // declaration path should be relative, but may be absolute
  declarationUrl = url.parse(declarationUrl);
  if(declarationUrl.hostname) return url.format(declarationUrl);

  listingUrl.pathname += declarationUrl.path;
  return url.format(listingUrl);
}

function getJson(resource, callback){
  var protocolHandler = (url.parse(resource).protocol === 'https:')?https:http;
  protocolHandler.get(resource, function(res) {
    var data = '';

    res.setEncoding('utf8');
    res.on('data', function(chunk){
      data += chunk;
    });

    res.on('end', function(){
      try {
        callback(null, JSON.parse(data));
      }
      catch(e) {
        callback(e, data);
      }
    });
  }).on('error', callback);
}