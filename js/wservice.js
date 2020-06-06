var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Wavenergy service',
  description: 'The nodejs wevenergy web server',
  script: 'P:/Atlas/js/app.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();