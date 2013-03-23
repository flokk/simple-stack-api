
/**
 * Module dependencies.
 */
var stack = require("simple-stack-common");

/**
 * Expose the stack
 */
module.exports = exports = function(config) {
  if (!config) config = {};

  // Create a simple-stack-common app
  var pack = stack(config);

  pack
    .useAfter("base", cors(config.cors || null))
    .use(require("./lib/not-found")())
    .use(require("./lib/error-handler")());

  // Return the pack
  return pack;
};

/**
 * Expose connect.middleware as stack.*
 */
stack.middleware(exports);
