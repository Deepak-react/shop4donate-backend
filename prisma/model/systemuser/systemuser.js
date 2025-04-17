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
      


      //Update system user data
      export async function UpdatedUser(reqId,req){
        try {

          const role=await prisma.roles.findFirst({
            where:{
              role:req.role
            }
          })
          if(!role){
            throw new Error("Entered unknow role")
          }
          const result=await prisma.adminside_user.update({
            where:{
              id:Number(reqId)
            },
           data:{

            employee_id:req.employee_id,
            name:req.name,
            email:req.email,
            password:req.password,
            role:role.id,
            profile_image:req.profile_image,
            bg_image:req.bg_image,
            updated_at:new Date(),
            is_active:req.is_active
           }
          })
          return result;
        } catch (e) {
          console.log(e.message)
          throw new Error(e.message)
        }
      }