import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
   return jwt.sign({
        userId: userId
    }, process.env.AUTH_SECRET, {'expiresIn': '7 days'});
}