const ipAddressFromRequest = req =>
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    'unknown remote ip';

module.exports = {
    ipAddressFromRequest
};
