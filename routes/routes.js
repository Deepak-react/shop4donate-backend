const express= require(express)
const router=express.Router();
const checkuser=require('../controller/loginuset')

router.post('/login',checkuser);


router.post('/demo-data', (req, res)=>{

const response = checkuser(req);
return response;

})




export default router;