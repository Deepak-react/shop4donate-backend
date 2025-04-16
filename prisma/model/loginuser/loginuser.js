import prisma from '../../index.js';

export async function getAllUsers(user){
    console.log("The user data are", user)
    const {email}=user;
    console.log("This is email ",email);
    try {
        const userdata=await prisma.adminside_user.findUnique({
            where:{email:email},
        })
        console.log("The login user  is ",userdata);
        return userdata;
        
    } catch (error) {
        throw new Error(`User not found ${error.message}`)
        
    }
}


