var pns = require("pack-n-stack")
  , express = require("express");

module.exports = function(config) {
  if (!config) config = {};

  // Create a pack
  var pack = pns();

  // Add some default middleware
  pack.use(express.logger(config.logger || 'dev'));
  pack.use(function fqdn(req, res, next) {
    // TODO 'X-Forwarded-Host'
    // TODO 'X-Forwarded-Port'
    // TODO 'X-Forwarded-Path'
    // TODO 'X-Forwarded-Is-SSL'
    req.fqdn = req.protocol+"://"+req.headers.host;
    next();
  });
  var compressFun = express.compress();
  pack.use(function compress(req, res, next) {
    compressFun(req, res, next);
  });
  pack.use(express.bodyParser());
  pack.use(express.methodOverride());

  // Use the express router
  if(config.router) pack.use(config.router);

  // Error handling
  if(config.notFound) pack.use(function notFound(req, res, next) {
    res.status(404);
    config.notFound(res, res, next);
  });
  pack.use(express.errorHandler());

  // Return the pack
  return pack;
};
