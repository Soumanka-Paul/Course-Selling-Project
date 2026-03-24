import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
    try {
        const cookieToken = req.cookies?.jwt;
        const headerToken = req.headers.authorization?.split(" ")[1];

        const token = cookieToken || headerToken;

        if (!token) {
            return res.status(401).json({
                message: "No token provided. Access denied."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        req.admin = decoded;
        req.adminId = decoded.adminId;

        next();

    } catch (error) {
        console.log("Token verification error:", error.message);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired. Please login again."
            });
        }

        return res.status(401).json({
            message: "Invalid or expired token.",
            error: error.message
        });
    }
};