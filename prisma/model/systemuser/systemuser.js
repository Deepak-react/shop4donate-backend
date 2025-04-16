import prisma from '../../index.js';

export  async function createsystemuser(systemuserdata) {
    try {
        console.log("The data in db layer ", systemuserdata);
        //  Get the role ID from the role table
        const role = await prisma.roles.findFirst({
            where: {
                role: systemuserdata.role,
            },
        });
        if (!role) {
            throw new Error(`Role '${systemuserdata.role}' not found`);
        }
        //  Create user with foreign key
        return await prisma.adminside_user.create({
            data: {
                employee_id: systemuserdata.employee_id,
                name: systemuserdata.name,
                email: systemuserdata.email,
                password: systemuserdata.password,
                profile_image: systemuserdata.profile_image,
                bg_image: systemuserdata.bg_image,
                role: role.id 
            }
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

//fetch all users
export async function getAllSysUsers() {
    try {
      const result = await prisma.adminside_user.findMany({
        include: {
          roles: {  
            select: {
              role: true, 
            }
          }
        }
      });
  
      return result.map(user => ({
        ...user,
        role: user.roles?.role, 
        roles: undefined 
      }));
  
    } catch (e) {
      console.error("Error fetching all users:", e.message);
      throw new Error(e.message);
    }
  }
  

//fetch user By Id 
    export async function getSysUserById(userId) {
        try {
          const result = await prisma.adminside_user.findUnique({
            where: {
              id: Number(userId),
            },
            include: {
              roles: {  
                select: {
                  role: true,
                }
              }
            }
          });
      
          if (!result) {
            throw new Error("User not found");
          }
      
          return {
            ...result,
            role: result.roles?.role,
            roles: undefined
          };
      
        } catch (e) {
          console.error("Error fetching user by ID:", e.message);
          throw new Error(e.message);
        }
      }
      