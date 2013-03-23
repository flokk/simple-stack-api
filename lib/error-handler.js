/**
 * Module dependencies
 */

module.exports = function() {
  return function errorHandler(err, req, res, next) {
    var code = err.code || 500
      , title = err.title || "Server Error"
      , message = (process.env.NODE_ENV !== "production") ? err.message : err.stack;
    
    // TODO merge into a default message
    var response = {
      _links: {
        self: {href: req.resolve(req.url)}
      },
      _error: {
        title: title,
        code: code,
        message: message
      }
    };
    res.status(code);
    res.send(response);
  }
};
