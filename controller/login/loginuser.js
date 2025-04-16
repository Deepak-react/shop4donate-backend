import { getAllUsers } from "../../prisma/model/loginuser/loginuser.js";
import { generateJWTtoken } from "../../utils/jwt.js";
import bcrypt from 'bcrypt'
export default async function loginuser(login_user){
  console.log("The db check the login user data",login_user);
      try {  
           const is_user=await getAllUsers(login_user);
           console.log("The login user is  in controller ",is_user);
           if(!is_user) throw new Error("User not found");
           const comparepwt=await bcrypt.compare(login_user.password,is_user.password);
           if(!comparepwt){
            throw Error("Invalid password");
           }
           if(!is_user.is_active===true) throw new Error ("User is not active")
          //generate JWT token 
          const jwttoken=generateJWTtoken(is_user);
          return {user:is_user,token:jwttoken}
           } catch (error) {
            console.error(`${error.message}`)
           throw new Error(`${error.message}`)
          }
 
}