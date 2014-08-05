#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  fetch = require('../'),
  url = process.argv[2],
  destination = process.argv[3];

fetch(url, function(err, schema){
  if(err) return console.error(err);

  if(destination){
    destination = path.resolve(process.cwd(), destination);
    fs.writeFileSync(destination, JSON.stringify(schema));
  } else {
    process.stdout.write(JSON.stringify(schema));
  }
});