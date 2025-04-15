const express= require(express)
const router=express.Router();
const checkuser=require('../controller/loginuser.js')


router.post('/demo-data', (req,res)=>{


try {
    const response= checkuser(req);
    res.status(200).json(response);
} catch (error) {
    res.status(400).json({error:error.message})
}
})

export default router;