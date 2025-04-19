import { findVisitorByEmail } from '../../prisma/model/visitors_login/visitors_login.js';
import { generateJWTtoken } from '../../utils/jwt.js';
import bcrypt from 'bcrypt';

export default async function visitors_login(login_user) {
  console.log("Login user input:", login_user);

  try {
    const is_user = await findVisitorByEmail(login_user);
    console.log("User fetched from DB:", is_user);

    if (!is_user) throw new Error("User not found");

    const comparePwd = await bcrypt.compare(login_user.password, is_user.password);
    if (!comparePwd) throw new Error("Invalid password");

    if (is_user.is_active !== true) throw new Error("User is not active");

    // Generate JWT token
    const jwttoken = generateJWTtoken(is_user);

    return { message: 'Login successful!', user:{
      ...is_user,
      password: undefined, 
    } , token: jwttoken };

  } 
  catch (error) {
    console.error("Login error:", error.message);
    throw new Error(error.message);
  }
}
