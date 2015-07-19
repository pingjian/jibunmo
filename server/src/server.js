'use strict';

let PeerServer = require('peer').PeerServer;
let server = PeerServer({
  port: 9000,
  path: '/',
  allow_discovery: true
});
