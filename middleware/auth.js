const jwt  = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const token  = req.headers.authorization?.split("")[1];

    if(!token){ res.sendStatus(401)};

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next();
        req.user = decoded
    } catch (error) {
        res.sendStatus(401)
    }
}