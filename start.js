#!/usr/bin/env node

const readdir = require('fs').readdirSync;
const exec = require('child_process').exec;
const p = {};
let i = 0;

let ports = (process.env['PORTS'] || '').split(/\s+/).filter(s => (s || '').length > 0).map(s => s.split(':'));
let vpns = readdir('/etc/snet/').filter(s => s !== '.' && s !== '..').map(c => c.replace('/etc/snet/', '').replace(/\.conf$/, '')).filter(s => (s || '').length > 0);

console.log(ports);
console.log(vpns);

/*
  PORTS=3306:mysql:3306 3306:mysql:3306 3306:mysql:3306
*/

let forever = async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 365 * 86400 * 5));
    await forever();
};

let openvpn = async (config) => {
    let ii = i ++;
    
    await new Promise((resolve, reject) => {
        p[ii] = exec('openvpn --config /etc/snet/' + config + '.conf', error => {
            if (error) return reject(error);
            reject(new Error('Openvpn closed unexpectedly.'))
        });
        p[ii].stdout.on('data', data => console.log('_vpn:' + config, data['toString']('utf8')));
        p[ii].stderr.on('data', data => console.log('_vpn:' + config, data['toString']('utf8')));
    });
};

let socat = async (portFrom, hostTo, portTo) => {
    let ii = i ++;
    
    await new Promise((resolve, reject) => {
        p[ii] = exec('socat tcp-l:' + portFrom + ',fork,reuseaddr tcp:' + hostTo + ':' + portTo, error => {
            if (error) return reject(error);
            reject(new Error('Socat closed unexpectedly.'))
        });
        p[ii].stdout.on('data', data => console.log(hostTo + ':' + portTo, data['toString']('utf8')));
        p[ii].stderr.on('data', data => console.log(hostTo + ':' + portTo, data['toString']('utf8')));
    });
};


let promises = [forever()];
for (let vpn of vpns) promises.push(openvpn(vpn));
for (let port of ports) promises.push(socat(port[0], port[1], port[2]));

Promise.all(promises).then(() => {
    console.log('Unexpected finish without an error.');
}).catch(e => {
    console.error('Error: ' + e.message);
});

