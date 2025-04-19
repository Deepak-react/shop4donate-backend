import express from 'express';
const router = express.Router();
import  checkuser from '../controller/login/loginuser.js';
import  { createUser, editSysUser, fetchAllSysUser, fetchSysUserById } from '../controller/systemuser/systemuser.js';
import upload from '../middlewares/uploads.js';
import { readOnlyAcess, roleAuth } from '../middlewares/RBAC/authorization.js';
<<<<<<< HEAD
import {addCategory,editCategory,fetchAllCategories, fetchCategoryById } from '../controller/categories/categories.js';
import {  addAffilatePartner, editAffiliPartner, fetchAffiliPartnerById, fetchAllAffiliPartner } from '../controller/affiliate_partners/affiliate_partners.js';
import { addSmtp, editSmtpSettings, fetchAllSmtp, fetchSmtpById } from '../controller/smtpsettings/smtpsettings.js';
import { addEmailContent,  editEmailContent,  fetchAllEmailContent, fetchEContentById } from '../controller/email_content/email_content.js';

=======
import {addCategory,fetchAllCategories, fetchCategoryById } from '../controller/categories/categories.js';
import {  addAffilatePartner, fetchAffiliPartnerById, fetchAllAffiliPartner } from '../controller/affiliate_partners/affiliate_partners.js';
import addSmtp from '../controller/smtpsettings/smtpsettings.js';
import addEmailContent from '../controller/email_content/email_content.js';
import { visitors_signup, getAllVisitors,getVisitorById,updateVisitor} from '../controller/visitors_signup/visitors_signup.js';// for visitors signup
import { roles_create, roles_get, roles_update } from '../controller/roles/roles.js';
import visitors_login from '../controller/visitors_login/visitors_login.js';
>>>>>>> 44c36db (Added new controllers, models, and updated existing files)

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
 
// post - Website visitors signup
router.post('/visitors_signup', upload.fields([{ name: 'profile_image', maxCount: 1 },
    { name: 'bg_image', maxCount: 1 },]),
    async (req, res) => {
    try {
      await visitors_signup(req, res); // let the controller handle the response
    } catch (error) {
      console.error('Route Error:', error.message);
      res.status(500).json({ message: 'Internal server error from route.' });
    }
  }
);



// Protected Route: Only role 1 or 2 can access
router.post('/roles', async (req, res) => {
  try {
    await roleAuth(req); // Verify token and role here 
    await roles_create(req, res); // Proceed to controller
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});



// post visitors Login Route
router.post('/visitors_login', async (req, res) => {
  try {
    console.log("Visitor login request body:", req.body);
    const response = await visitors_login(req.body);
    console.log("Login success response:", response);
    return res.status(200).json(response);

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

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
  await readOnlyAcess(req);
  let response;
  try {
    if(req.query.id){
     response=await fetchCategoryById(req.query.id)
    }
    else{
     response=await fetchAllCategories();
    }
    return res.status(200).json(response);
  } 
  
  catch (e) {
    return res.status(401).json({e:e.message})
  }
 })

 //fetch affiliate partners
 router.get('/affilate-products',async(req,res)=>{
  await readOnlyAcess(req);
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
 });

<<<<<<< HEAD

 //fetch SMTP settings 
router.get('/smtp-list',
  async(req,res)=>{
    await readOnlyAcess(req);
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
    await readOnlyAcess(req);
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
      const response=await editSysUser(req.query.id,userData);
      return res.status(200).json(response)
    } catch (e) {
       return res.status(400).json({e:e.message})
    }
  }
)



//edit affiliate partners 
router.put('/edit-affiliatepartners',upload.fields([{name:'logo',maxCount:1}]),
async(req,res)=>{
  try {
    
  const {id:userId}=await roleAuth(req);
  const logoPath=req.files['logo']?.[0]?.path;
  const reqbody={
    ...req.body,
    logo:logoPath
  }
  const response=await editAffiliPartner(userId,req.query.id,reqbody)
  return res.status(200).json(response);
  } catch (e) {
   return res.status(400).json({e:e.message})
  }
})

//edit SMTP settings

router.put('/edit-smtpsettings',async(req,res)=>{
  try {
    const {id:userId}=await roleAuth(req);
    const response=await editSmtpSettings(userId,req.query.id,req.body);
    return res.status(200).json(response)
  } catch (e) {
    return res.status(400).json({e:e.message})
  }
})


//edit email content 

router.put('/edit-emailcontent',async(req,res)=>{
  try {
    const {id:userId}=await roleAuth(req);
    const response=await editEmailContent(userId,req.query.id,req.body)
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({e:e.message})
  }
})

//edit category 
router.put('/edit-category',async(req,res)=>{
  try {
    const {id:userId}=await roleAuth(req);
    const response=await editCategory(userId,req.query.id,req.body);
    return res.status(200).json(response)
  } catch (e) {
    return res.status(400).json({e:e.message})
  }
})


  export default router;
=======
 
 
// GET- Route to get all roles with roleAuth + controller logic
router.get('/roles', async (req, res) => {
  try {
    await roleAuth(req); // Verify token and role
    await roles_get(req, res); // Custom controller logic for all roles
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});

// GET- Route to get a specific role by ID (without using optional `?`)
router.get('/roles/:id', async (req, res) => {
  try {
    await roleAuth(req); // Token and role verification
    await roles_get(req, res); // Use same controller to handle single role logic
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
});


//  GET all visitors
router.get('/visitors_signup', async (req, res) => {
  try {
    await roleAuth(req); //  Token and role verification
    await getAllVisitors(req, res);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//  GET visitor by ID
router.get('/visitors_signup/:id', async (req, res) => {
  try {
    await getVisitorById(req, res);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});




// PUT method

router.put('/roles/:id', async (req, res) => {
  try {
    await roleAuth(req); //  Token and role verification
    await roles_update(req, res); //  Call controller
  } 
  catch (error) {
    return res.status(401).json({ error: error.message });
  }
});


router.put('/visitors_signup/:id', upload.fields([{ name: 'profile_image', maxCount: 1 },
  { name: 'bg_image', maxCount: 1 },]),
   async (req, res) => {
  try {
    await updateVisitor(req.params.id,req, res);
     // let the controller handle the response

  }
      catch (error) {
        console.error('Route Error:', error.message);
        res.status(500).json({ message: 'Internal server error from route.' });
      }
    });

   
export default router;
>>>>>>> 44c36db (Added new controllers, models, and updated existing files)
