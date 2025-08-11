const { randomUUID } = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');
const fs = require('fs');
const hashRounds = 5;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {db} = require('../db/connection');
const {admins} = require('../db/schema');
const {eq} = require('drizzle-orm');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';

const register = async (data)=>{
    try{
        let toCreateUser = {};

        if(data?.email && validator.isEmail(data.email)){
            const toHashPassword = data.password;                 
            const hashedPassword = await bcrypt.hash(toHashPassword,hashRounds);        
            toCreateUser = {            
                email: data.email,
                password: hashedPassword,            
            };
        }else{        
            return {status: 400,data: "Invalid Email"};
        }

        //Insert user into database
        try {
            await db.insert(admins).values(toCreateUser);
        } catch (error) {
            console.error("Error inserting user into database:", error);
            return {status: 500, data: "Unable to register user"};
        }
    }catch (error) {
        console.error("Error inserting user into database:", error);
        return {status: 500, data: "Email already exists"};
    }

    return {status: 200, data: "User registered successfully"};
}

const login = async(data)=>{ 
    try{   
        const {email, password} = data;
        if(!email || !password){
            return {status: 400, data: "Email and password are required"};
        }
        //Fetch user from database
        let user = await db.select().from(admins).where(eq(admins.email, email)).then(users => users[0]);

        if(!user){
            return {status: 404, data: "User not found"};
        }

        const dbHashedPassword = user.password;                
        const passwordMatch = await bcrypt.compare(data.password,dbHashedPassword);

        if(!passwordMatch){                    
            return {status: 401,data: "Invalid Credentials"};
        }else{
            const token = jwt.sign({username: data.email,user_id: user.id,role: 'admin'},JWT_SECRET,{expiresIn: JWT_EXPIRATION});                    
            return {status: 200,data:{
                token,
                message: "Logged in successfully"
            }};
        }
    } catch (error) {
        console.error("Error during login:", error);
        return {status: 500, data: "Internal server error"};
    }
}

module.exports = {register,login};