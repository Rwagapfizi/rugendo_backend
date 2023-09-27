require('dotenv').config()
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY

const authenticateMiddleware = (req, res, next) => {
    // Retrieve the token from the cookie
    // console.log(req.cookies)
    // console.log(req.headers.authorization?.split(' ')[1])
    const authToken = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    // Verify and decode the token
    jwt.verify(authToken, jwtSecretKey, (verifyError, decoded) => {
        if (verifyError) {
            // Handle verification error
            res.status(401).json({ error: 'Unauthorized, You are not logged in' });
        } else {
            // Token is valid, attach the decoded payload to the request
            req.authUser = decoded;

            // Set the user's role in the cookies after successful authentication
            const userRole = decoded.role;
            res.cookie('userRole', userRole);

            // Store the user's role in the request object for further middleware
            req.user = {
                id: decoded.id,
                role: decoded.role,
                companyID: decoded.companyID
            };

            next();
        }
    });
};

module.exports = authenticateMiddleware;
