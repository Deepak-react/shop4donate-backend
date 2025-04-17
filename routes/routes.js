import express from 'express';
const router = express.Router();
import  checkuser from '../controller/login/loginuser.js';
import  { createUser, fetchAllSysUser, fetchSysUserById, updateSysUser } from '../controller/systemuser/systemuser.js';
import upload from '../middlewares/uploads.js';
import { readOnlyAcess, roleAuth } from '../middlewares/RBAC/authorization.js';
import {addCategory,fetchAllCategories, fetchCategoryById } from '../controller/categories/categories.js';
import {  addAffilatePartner, fetchAffiliPartnerById, fetchAllAffiliPartner } from '../controller/affiliate_partners/affiliate_partners.js';
import { addSmtp, fetchAllSmtp, fetchSmtpById } from '../controller/smtpsettings/smtpsettings.js';
import { addEmailContent,  fetchAllEmailContent, fetchEContentById } from '../controller/email_content/email_content.js';


//POST METHODS 

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
            await roleAuth(req);
        
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

//categories 
  router.post('/categories', async (req, res) => {
    try {
      const { id: userId } = await roleAuth(req); 
      if (!userId) {
        throw new Error("User ID is missing in auth response");
      }
      const { name: cName } = req.body;
      console.log("The request body is ", cName);
      const response = await addCategory(cName, userId);
      return res.status(201).json(response);
    } catch (error) {
      console.error("Error in /categories:", error);
      return res.status(400).json({ error: error.message });
    }
  });

//affiliatepartners
  router.post('/affiliatepartners',
    upload.fields([
    {name:'logo',maxCount:1},
      ]),async(req,res)=>{
     try {
      const {id:userId}=await roleAuth(req);
      const logoPath=req.files['logo']?.[0]?.path;
      const requestData={
        ...req.body,
        logo:logoPath
      }
       const response=await addAffilatePartner(requestData,userId);
      return res.status(201).json(response)
     }catch (error) {
      return res.status(400).json({ error: error.message });
     }
  })

//smtp-settings
  router.post('/smtp-settings',
    async(req,res)=>{
    try {
      const {id:userId}=await roleAuth(req);
      const response=await addSmtp(req.body,userId);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(400).json({error:error.message})
    }
    } )


    //email content 
    router.post('/email-content',async(req,res)=>{
      try {
        const {id:userId}=await roleAuth(req);
        const response=await addEmailContent(req.body,userId);
        return res.status(201).json(response)
      } catch (e) {
        res.status(400).json({e:e.message})
      }
    })
    

//GET METHODS 

//fetch system user 
router.get('/system-userlist',async(req,res)=>{
  let response;
  try {
    
    await readOnlyAcess(req);
    
    if (req.query.id) {
      response=await fetchSysUserById(req.query.id);
    } else {
      response=await fetchAllSysUser();
    }
    return res.status(200).json(response)
  } catch (e) {
    console.log(e.message)
    return  res.status(401).json({e:e.message})

  }
})

//fetch categories 
 router.get('/categorylist',async(req,res)=>{
  let response;
  try {
    if(req.query.id){
     response=await fetchCategoryById(req.query.id)
    }else{
     response=await fetchAllCategories();
    }
    return res.status(200).json(response);
  } catch (e) {
    return res.status(401).json({e:e.message})
  }
 })

 //fetch affiliate partners
 router.get('/affilate-products',async(req,res)=>{
  let response;
try {
  if (req.query.id) {
  response=await fetchAffiliPartnerById(req.query.id)
    
  } else {
    response = await fetchAllAffiliPartner();
  }
  return res.status(200).json(response);
} catch (e) {
  return res.status(401).json({e:e.message});
}
 })


 //fetch SMTP settings 

router.get('/smtp-list',
  async(req,res)=>{
   let response;
   try {
    if(req.query.id){
      response=await fetchSmtpById(req.query.id)
    }else{
      response=await fetchAllSmtp();
    }
    return res.status(200).json(response);
   } catch (e) {
     return res.status(401).json({e:e.message})
   }
})

//fetch email contents
router.get('/email-contentlist',
  async(req,res)=>{
    let response;
    try {
      if (req.query.id) {
        response = await fetchEContentById(req.query.id);
      } else {
        response=await fetchAllEmailContent();
      }
      return res.status(200).json(response);
    } catch (e) {
      return res.status(401).json({e:e.message})
    }
  }
)


//PUT METHODS

//Update system user details 
router.put('/edit-system-user',
  upload.fields([
    {name:'profile_image',maxCount:1},
    {name:'bg_image',maxCount:1}
]),
  async(req,res)=>{
    try {
      await roleAuth(req);
      const profileImagePath=req.files['profile_image']?.[0]?.path;
            const bgImagePath=req.files['bg_image']?.[0]?.path;
        
            const userData={
                ...req.body,
                profile_image:profileImagePath,
                bg_image:bgImagePath
            };
      const response=await updateSysUser(req.query.id,userData);
      return res.status(200).json(response)
    } catch (e) {
       return res.status(400).json({e:e.message})
    }
  }
)


  export default router;