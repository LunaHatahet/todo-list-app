const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    jwt.verify(token, 'd1b41c94f57ce66f9020b70f6bad485d3dcd4a73ffa7cd9643754535c7896ef7db2e2040772773d2efd00fde1eb4089b2a38a75e626d7d16042821c4b2a4a2bb', (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized');
        }
        req.user = { id: decoded.userId };
        next();
    });
};
