import jwt from "jsonwebtoken";
const SECRET_KEY=process.env.JWT_SECRET;
const EXPIRES_IN=process.env.JWT_EXPIRES_IN || '1h';


export const generateJWTtoken=(user)=>{
    console.log("This is the detail to create jwt token  ", user.id)

    return jwt.sign(
        {
        id:user.id,
        employee_id :user.employee_id ,
        name:user.name,
        email:user.email,
        role:user.role
    },
    SECRET_KEY,
    {expiresIn:EXPIRES_IN}
)
}


// VERIFY JWT TOKEN
export const verifyToken=async(token)=>{
    try{
        return jwt.verify(token,SECRET_KEY);
    }
    catch(error){
        throw new Error('Invalide token  or erpired token');
    }
};