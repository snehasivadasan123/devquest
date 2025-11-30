import  jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET=process.env.JWT_SECRET!
export interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}


if (!JWT_SECRET) {
  throw new Error('Please define JWT_SECRET in .env.local');
}

export async function hashedPassword(password:string){
    const val=await bcrypt.genSalt(10)
    return bcrypt.hash(password,val)
}

export async function comparePassword(password: string, hashedPassword: string){
   return bcrypt.compare(password,hashedPassword)
}

export function generateToken(payload:TokenPayload):string{
    return jwt.sign(payload,JWT_SECRET,{expiresIn:"7d"})
}

export function verifyToken (token:string):TokenPayload|null{
    try {
                return jwt.verify(token, JWT_SECRET) as TokenPayload;

    } catch (error) {
                return null;

    }

}