import prisma from '../../index.js';

export default async function createsystemuser(systemuserdata) {
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
                role: role.id // assuming role_id is the foreign key in adminside_user
            }
        });
    } catch (error) {
        return new Error(`${error.message}`);
    }
}
