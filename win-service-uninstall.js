// https://github.com/coreybutler/node-windows

var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Ep eService web backend Server [node.js]',
  description: 'mssql <-> web api [node.js BO] \ web app server [angular 7].',
  script: require('path').join(__dirname,'\\app.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

svc.uninstall();