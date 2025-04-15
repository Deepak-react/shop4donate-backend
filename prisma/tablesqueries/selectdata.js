import prisma from '../index';


export async function getAllUsers(user){
    const {email}=user;
    try {
        const user=await prisma.adminside_user.findUnique({
            where:{email:email},
        })
        console.log("The login user  is ",user);
        return user;
        
    } catch (error) {
        throw new Error(`User not found ${error.message}`)
        
    }
}


