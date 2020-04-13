import jwt from 'jsonwebtoken';
export const getUserId = (request, requireAuth = true) => {
    const header = request.request ?
     request.request.headers.authorization :
     request.connection.context.Authorization; 
    if(header){
        const token = header.replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisisasecret');
        return decoded.userId;
    }

    if(requireAuth){
        throw new Error('Authorization required');
    }
    return null;
}