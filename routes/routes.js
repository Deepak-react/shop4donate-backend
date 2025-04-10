const express= require(express)
const router=express.Router();
const checkuser=require('../controller/loginuset')

router.post('/login',checkuser);




export default router;