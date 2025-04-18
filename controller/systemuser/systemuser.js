import { z } from "zod";
import {createsystemuser,getAllSysUsers,getSysUserById, UpdatedUser} from "../../prisma/model/systemuser/systemuser.js";
import bcrypt from 'bcrypt';

const systemuser = z.object({
  employee_id: z.string()
    .regex(/[a-zA-Z0-9]+$/)
    .max(10, 'Maximum user id length is 10'),
  name: z.string().max(20, "Maximum name length is 20").min(3, "Minimum name length is 3"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(7, "Minimum password length is 7"),
  role: z.enum(['Admin', 'Super Admin', 'User']),
  profile_image: z.string(),
  bg_image: z.string()
});

export  async function createUser(userdata) {
  console.log("The user data in controller", userdata);
  try {
    const parsed = systemuser.safeParse(userdata);
    if (!parsed.success) {
      throw new Error(parsed.error.issues.map(
        issue => `${issue.path.join('.')} - ${issue.message}`
      ).join(', '));
    }
    const validatedUserData = parsed.data;
    const hashedPwd = await bcrypt.hash(validatedUserData.password, 10);

    const userToCreate = {
      ...validatedUserData,
      password: hashedPwd
    };

    const result = await createsystemuser(userToCreate);
    return result;

  } catch (error) {
    throw new Error(error.message); 
  }
}

//fetch  all system user
export  async function fetchAllSysUser(){
  try {
    const allUser=await getAllSysUsers();
    return allUser;
  } catch (e) {
    throw new Error(e.message)
  }

}

//fetch system user By Id 
export  async function fetchSysUserById(req){
  try {
    const getSysUser=await getSysUserById(req)
    return getSysUser;
  } catch (e) {
    throw new Error(e.message)
  }
}

export async function editSysUser(reqId,req) {
  try {
    const parsed=systemuser.safeParse(req);
    if(!parsed.success) {
      throw new Error(parsed.error.issues.map(issue=>
             `${issue.path.join('.')}-${issue.message}`
      ).join(', ')
      )
    }
    const validatedUserData = parsed.data;
    const hashedPwd = await bcrypt.hash(validatedUserData.password, 10);

    const userToUpdate = {
      ...validatedUserData,
      password: hashedPwd
    };
      const result=await UpdatedUser(reqId,userToUpdate);
      return result;
  } catch (e) {
    throw new Error(e.message)
  }
}