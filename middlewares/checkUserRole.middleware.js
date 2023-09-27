
// Middleware to check user role based on cookies
const checkUserRole = (requiredRoles) => {
    return (req, res, next) => {
        const userRole = req.cookies.userRole || req.headers.userrole; // Read user's role from cookies
        // console.log(userRole)
        // console.log(req.headers)

        // const authToken = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

        if (userRole && requiredRoles.includes(userRole)) {
            // User has the required role, allow access
            next();
        } else {
            // User does not have the required role or not authenticated, deny access
            res.status(403).json({ error: `Access denied. You need to be logged in as a ${requiredRoles} to perform this action` });
        }
    };
};

module.exports = checkUserRole;