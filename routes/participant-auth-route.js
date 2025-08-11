const express = require("express");
const router = express.Router();
const {register,login} = require('../controllers/participant-auth-controller');

router.use(express.json());

router.post('/signup',async (req,res)=>{
    const toRegisterUser = req.body;
    const registerStatus = await register(toRegisterUser);
    return res.status(registerStatus.status).send(registerStatus.data);
});

router.post('/login',async(req,res)=>{
    const toLoginUser = req.body;    
    const loginStatus = await login(toLoginUser);
    return res.status(loginStatus.status).send(loginStatus.data);
});

module.exports = router;