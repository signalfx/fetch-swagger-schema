# Fetch Swagger Schema

Given a url to a swagger api-docs spec, loads it and all related resource declarations into one JSON object. The Resource API Declartion JSON objects are added as a 'apiDeclaration' property to each api object in the resource listing.

## CLI Usage

```shell
npm install -g fetch-swagger-schema

# Fetch and save schema as a json file
fetch-swagger-schema http://petstore.swagger.io/api/api-docs petstore.json

# Fetch and output response to stdout
fetch-swagger-schema http://petstore.swagger.io/api/api-docs
```

## Library Usage

First install the package with `npm install fetch-swagger-schema`, then in your script:

```javascript
var fetchSchema = require('fetch-swagger-schema');

fetchSchema('http://petstore.swagger.io/api/api-docs', function(error, schema){
   if(error) return console.error(error);
   console.log('Schema:', schema); 
});
```