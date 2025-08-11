const validator = require('validator');
const bcrypt = require('bcrypt');
const hashRounds = 5;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {db} = require('../db/connection');
const {participants} = require('../db/schema');
const {eq} = require('drizzle-orm');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';

const register = async (data)=>{
    try{
        let toCreateParticipant = {};

        if(data?.email && validator.isEmail(data.email)){
            const toHashPassword = data.password;                 
            const hashedPassword = await bcrypt.hash(toHashPassword,hashRounds);        
            toCreateParticipant = {            
                email: data.email,
                password: hashedPassword,  
            };
        }else{        
            return {status: 400,data: "Invalid Email"};
        }
            
        await db.insert(participants).values(toCreateParticipant);
    }catch (error) {
        console.error("Error inserting user into database:", error);
        return {status: 500, data: "Email already exists"};
    }

    return {status: 200, data: "Participant registered successfully"};
}

const login = async(data)=>{ 
    try{   
        const {email, password} = data;
        if(!email || !password){
            return {status: 400, data: "Email and password are required"};
        }
        //Fetch user from database
        let participant = await db.select().from(participants).where(eq(participants.email, email)).then(participants => participants[0]);
        
        if(!participant){
            return {status: 404, data: "User not found"};
        }

        const dbHashedPassword = participant?.password;                
        const passwordMatch = await bcrypt.compare(data.password,dbHashedPassword);

        if(!passwordMatch){                    
            return {status: 401,data: "Invalid Credentials"};
        }else{
            const token = jwt.sign({username: data.email,user_id: participant.id,role: 'participant'},JWT_SECRET,{expiresIn: JWT_EXPIRATION});                    
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