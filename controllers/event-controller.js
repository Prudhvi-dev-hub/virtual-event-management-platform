const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {db} = require('../db/connection');
const {eventManagement,eventRegistrations} = require('../db/schema');
const {eq} = require('drizzle-orm');
const { default: axios } = require('axios');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';

const createEvent = async (data)=>{
    try{
        //Insert user into database
        await db.insert(eventManagement).values(data);
    }catch (error) {
        console.error("Error inserting user into database:", error);
        return {status: 500, data: "Unable to create event"};
    }

    return {status: 201, data: "Event created successfully"};
}

const updateEvent = async(eventId,data)=>{ 
    try{   
        const event = await db.select().from(eventManagement).where(eq(eventManagement.id, eventId)).then(events => events[0]);

        if(!event){
            return {status: 404, data: "Event not found"};
        }
        // Prepare the update object
        // Only include fields that are provided in the data object
        // This allows partial updates
        // and avoids overwriting fields with undefined values
        const toUpdateEvent = {};

        const {name, description, startDate,endDate, status, location} = data;
        if(name !== undefined) toUpdateEvent.name = name;
        if(description !== undefined) toUpdateEvent.description = description;
        if(startDate !== undefined) toUpdateEvent.startDate = startDate;    
        if(endDate !== undefined) toUpdateEvent.endDate = endDate;
        if(status !== undefined) toUpdateEvent.status =
            status;
        if(location !== undefined) toUpdateEvent.location = location;

        if(Object.keys(toUpdateEvent).length === 0){
            return {status: 400, data: "No fields to update"};
        }
        //Fetch user from database
        await db.update(eventManagement)
            .set(toUpdateEvent)
            .where(eq(eventManagement.id, eventId));
    } catch (error) {
        console.error("Error during login:", error);
        return {status: 500, data: "Internal server error"};
    }
}

const registerEvent = async (eventId,data) => {
    try {
        // Insert event into database
        const existingEvent = await db.select().from(eventManagement).where(eq(eventManagement.id, eventId)).then(events => events[0]);
        if (!existingEvent) {
            return {status: 404, data: "Event not found"};
        }
        data.eventId = eventId; // Associate the registration with the event      
        data.status = 'registered'; // Set initial status to 'registered'        
        await db.insert(eventRegistrations).values(data);
        //Send Email to participant on successful registration
        await sendEmail(data.email, "Event Registration Confirmation", `You have successfully registered for the event: ${existingEvent.name}`);
        return {status: 201, data: "Event registered successfully"};
    } catch (error) {
        console.error("Error inserting event into database:", error);
        return {status: 500, data: "Unable to register event"};
    }
}

const sendEmail = async (to, subject, text) => {
    // Placeholder for email sending logic
    // This function should integrate with an email service provider
    console.log(`Sending email to ${to} with subject "${subject}" and text "${text}"`);
    await axios.post('https://send.api.mailtrap.io/api/send', {
        to,
        subject,
        text
    }, {
        headers: {
            'Api-Token': process.env.MAILTRAP_API_TOKEN // Ensure you have this token in your .env file
        },
    Body: 
    {
        to: [
        {
        "email": "john_doe@example.com",
        "name": "John Doe"
        }
    ]
},
        from: {
            email: "prudhvi@yopmail.com"
        }
    })
    .catch(error => {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
}

module.exports = {createEvent,updateEvent,registerEvent};