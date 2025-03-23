const { JsonWebTokenError } = require("jsonwebtoken");

const roleMiddleware = (roles) => {
    return(req, res, next) =>{
        const token = req.cookies.token || req.cookies.adminToken;

        if(!token){
            return res.status(401).json({
                message: "Access denied!"
            })
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Access denied', error: err.message });
        }
    }
}

module.exports  = roleMiddleware