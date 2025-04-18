import prisma from '../../index.js';

export  async function createCategory(cName,userId){
    
     try {
        console.log("the user id is", userId)
       
        const createdUser=await prisma.adminside_user.findUnique({
            where: {
                id: userId, 
            },
        })
        if(!createdUser) throw new Error("User id not found");
        return await prisma.categories.create({
            data:{
                name : cName,
                created_by  :createdUser.id
            }
        })        
     } catch (error) {
        console.log(`The error is ${error.message}`)
        throw new Error(error.message);
     }
}

//fetch all categories 
export async function getAllCategories() {
    try {
        const result=await prisma.categories.findMany({
            include:{
                adminside_user_categories_created_byToadminside_user:{
                    select:{
                        name:true
                    }
                },
                    adminside_user_categories_updated_byToadminside_user:{
                    select:{
                        name:true
                    }
                   }
                
            }
        });
        if(result.length===0) throw new Error("No categories")
        return result.map(category=>({
           ...category,
           created_by:  category.adminside_user_categories_created_byToadminside_user?.name,
           updated_at:category.updated_at?.updated_at||"Not yet updated",
           updated_by:category.adminside_user_categories_updated_byToadminside_user?.name||'No one updated',
           adminside_user_categories_created_byToadminside_user:undefined,
           adminside_user_categories_updated_byToadminside_user:undefined
        }));
    } catch (error) {
        console.log(error.message)
        throw new Error(error.message)
    }  
}


export async function getCategoryById(req){
    try {
        const result=await prisma.categories.findUnique({
            where:{
                id:Number(req)
        },
        include:{
            adminside_user_categories_created_byToadminside_user:{
                select:{
                  name:true
                }
            },
            adminside_user_categories_updated_byToadminside_user:{
                select:{
                    name:true
                }
            }
            
        }
    })
        if(!result) throw new Error("Category not found")
        return {
    ...result,
    created_by:  result.adminside_user_categories_created_byToadminside_user?.name,
    updated_at:category.updated_at?.updated_at||"Not yet updated",
    updated_by:result.adminside_user_categories_updated_byToadminside_user?.name||'No one updated',
    adminside_user_categories_created_byToadminside_user:undefined,
    adminside_user_categories_updated_byToadminside_user:undefined
    };
    } catch (e) {
      
        throw new Error(e.message)
    }
}

export async function updateCategory(userId,reqId,reqbody){
    try {
        const result=await prisma.categories.update({
            where:{
                id:Number(reqId)
            },
            data:{
                name : reqbody.name,
                updated_by:userId,
                updated_at:new Date(),
                is_active:reqbody.is_active
            }
        })
        return result;
    } catch (e) {
        console.log(e.message)
        throw new Error(e.message)
    }
}