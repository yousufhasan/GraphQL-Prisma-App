import bcrypt from 'bcryptjs';
export const hashPassword = (password) => {
    if(password.length < 8){
        throw new Error('Invalid password length. Password should be atleast 8 characters long.');
    }
   return bcrypt.hash(password, 10);
}