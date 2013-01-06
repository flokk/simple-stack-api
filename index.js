var pns = require("pack-n-stack")
  , express = require("express");

module.exports = function(config) {
  if (!config) config = {};

  // Create a pack
  var pack = pns();

  // Add some default middleware
  pack.use(express.logger(config.logger || 'dev'));
  pack.use(function fqdn(req, res, next) {
    req.fqdn = req.protocol+"://"+req.headers.host;
    next();
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