import { createCategory,getAllCategories, getCategoryById, updateCategory } from "../../prisma/model/categories/categories.js";

export  async function addCategory(cName,userId){
    if(!cName||!userId){
        throw new Error("No category or no user id")
    }
    try {
        const result=await createCategory(cName,userId);
        return result;
    } catch (error) {
        console.log(`The error is ${error.message}`)
        throw new Error(error.message);
    }
}

export async function fetchAllCategories(){
    try {
        const result=await getAllCategories();
        return result;
        
    } catch (e) {
        throw new Error(e.message)
    }
}

export async function fetchCategoryById(req){
    try {
        const result=await getCategoryById(req)
        return result;
    } catch (e) {
        throw new Error(e.message)
    }
}


//edit category 


export async function editCategory(userId,reqId,reqbody){
    try {
        if(!userId){
            throw new Error("UserId required")
        }
        else if(!reqId){
            throw new Error("reqId required")
        }
        else if(!reqbody.name){
            throw new Error("All fields are required")
        }else{
            const result=await updateCategory(userId,reqId,reqbody);
            return result;
        }
    } catch (e) {
        throw new Error(e.message)
    }
}