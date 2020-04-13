import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
   return jwt.sign({
        userId: userId
    }, 'thisisasecret', {'expiresIn': '7 days'});
}