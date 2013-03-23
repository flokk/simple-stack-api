/**
 * Module dependencies
 */

/**
 * Returns an empty favicon
 */
module.exports = function() {
  return function notFound(req, res, next) {
    var err = new Error("'"+req.url+"' not found");
    err.code = 404;
    next(err);
  };
};
