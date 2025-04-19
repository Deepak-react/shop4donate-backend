import prisma from '../../index.js';

export async function findVisitorByEmail(user) {
  const { user_email } = user;
  console.log("Checking for user email:", user_email);

  try {
    const userdata = await prisma.users.findUnique({
      where: { user_email: user_email },
    });

    console.log("Visitor from DB:", userdata);
    return userdata;

  } 
  catch (error) {
    throw new Error(`User not found: ${error.message}`);
  }
}
