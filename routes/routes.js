import express from 'express';
const router = express.Router();
import  checkuser from '../controller/login/loginuser.js';
import createUser from '../controller/create_systemuser/create_systemuser.js';
import upload from '../middlewares/uploads.js';
import { roleAuth } from '../middlewares/RBAC/authorization.js';

// checking system login user
router.post('/adminsidelogin', async (req, res) => {
  try {
    console.log("The email check",req.body)
    const response = await checkuser(req.body);
    
    console.log("The response is :", response);

    return res.status(200).json(response)
    

  } catch (error) {
     return res.status(400).json({ error: error.message })
  }
});


//creating system users
  router.post('/system-user',
    upload.fields([
        {name:'profile_image',maxCount:1},
        {name:'bg_image',maxCount:1}
    ]),
    async(req,res)=>{
        try {
            console.log("the req body ", req.body);
            const rbac=await roleAuth(req);
        
            //extract file path
            const profileImagePath=req.files['profile_image']?.[0]?.path;
            const bgImagePath=req.files['bg_image']?.[0]?.path;
        
            const userData={
                ...req.body,
                profile_image:profileImagePath,
                bg_image:bgImagePath
            };
            console.log("the user data ", userData);
            const response =await createUser(userData);
            console.log("The response is ",response);
            return res.status(201).json(response);
        } catch (error) {
            console.log(`the error is  ${error.message}`)
            return res.status(400).json({error:error.message});
        }
    }
  )

  export default router;