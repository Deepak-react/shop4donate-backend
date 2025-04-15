import { getAllUsers } from "../prisma/tablesqueries/selectdata";
import { generateJWTtoken, verifyToken } from "../utils/jwt";

export default async function loginuser(login_user){
 
      try {  
           const is_user=await getAllUsers(login_user);
           console.log("The db check the login user data",login_user.email);
           if(!is_user) throw new Error("User not found")
           const comparepwt=await bcript.compare(login_user.password,is_user.password);
          if(!comparepwt) throw new Error("Invalid password")
          if(!is_user.is_active===ture) throw new Error ("User is not active")
            const jwttoken=generateJWTtoken(is_user);
          const verify_logged_token=await verifyToken(jwttoken);
          if(!verify_logged_token) throw new Error(`Authentication failed: ${error.message}`)
          return {user:is_user,jwttoken}
           } catch (error) {
           throw new Error(`${error.message}`)
          }
     
}