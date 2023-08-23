// // Middleware to check user role
// const checkUserRole = (requiredRoles) => {
//     return (req, res, next) => {
//         const userRole = req.user.role; // Assuming user role is stored in req.user.role after authentication

//         if (requiredRoles.includes(userRole)) {
//             // User has the required role, allow access
//             next();
//         } else {
//             // User does not have the required role, deny access
//             res.status(403).json({ error: `Access denied. You need to be a ${requiredRoles} to do this action` });
//         }
//     };
// };

// Middleware to check user role based on cookies
const checkUserRole = (requiredRoles) => {
    return (req, res, next) => {
        const userRole = req.cookies.userRole; // Read user's role from cookies

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