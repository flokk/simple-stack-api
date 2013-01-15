var pns = require("pack-n-stack")
  , express = require("express")
  , cors = require("connect-xcors")
  , base = require("connect-base");

module.exports = function(config) {
  if (!config) config = {};

  // Create a pack
  var pack = pns(express());

  pack.configure(function() {
    // Remove it for security
    pack.set("x-powered-by", false);
  });

  // Logger
  if(process.env.NODE_ENV !== "test") pack.use(express.logger(config.logger || 'dev'));
  // Base URL
  pack.use(base());
  // CORS Headers
  pack.use(cors(config.cors || null));
  // GZip
  var compressFun = express.compress();
  pack.use(function compress(req, res, next) {
    compressFun(req, res, next);
  });
  // Body Parser
  pack.use(express.bodyParser());
  // Method Override
  pack.use(express.methodOverride());

  // Router
  pack.use(pack.router);

  // Error handling
  pack.use(function notFound(req, res, next) {
    var err = new Error("'"+req.url+"' could not be found");
    err.code = 404;
    err.defaultMessage = "Not Found";
    next(err);
  });
  pack.use(function errorHandler(err, req, res, next) {
    if(process.env.NODE_ENV !== "test" && config.logErrors !== false) console.error(err.stack);

    res.status(err.code || 500);
    var response = {
      _links: {
        self: {href: req.base+req.url}
      },
      _error: {
        title: err.defaultMessage || "Server Error",
        code: err.code,
        message: err.message
      }
    };
    if (process.env.NODE_ENV !== "production") response._error.message = err.stack;
    res.send(response);
  });

  // Return the pack
  return pack;
};
