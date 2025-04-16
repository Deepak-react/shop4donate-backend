import { z } from "zod";
import createsystemuser from "../../prisma/model/create_systemuser/create_systemuser.js";
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

export default async function createUser(userdata) {
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
    throw new Error(error.message); // or handle it as per your use-case
  }
}
