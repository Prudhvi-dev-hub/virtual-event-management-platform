const dotenv = require('dotenv');
const {db} = require('../db/connection');
const {eventManagement,eventRegistrations} = require('../db/schema');
const {and,eq} = require('drizzle-orm');
const { default: axios } = require('axios');
const {sendEmail} = require('../utils/sendEmail');
const {participants} = require('../db/schema');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1d';

const createEvent = async (data)=>{
    try{
        //Insert user into database
        const [createdEvent] = await db.insert(eventManagement).values(data);
        const insertedId = createdEvent?.insertId;
    
        const [insertedRow] = await db
        .select()
        .from(eventManagement)
        .where(eq(eventManagement.id, insertedId));
        console.log("Event created successfully:", createdEvent);
        return {status: 201, data: {data: insertedRow, message: "Event created successfully"}};
    }catch (error) {
        console.error("Error inserting user into database:", error);
        return {status: 500, data: "Unable to create event"};
    }
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
        return {status: 200, data: {message: "Event updated successfully"}};
    } catch (error) {
        console.error("Error during login:", error);
        return {status: 500, data: "Internal server error"};
    }
}

const registerEvent = async (eventId,authUser) => {
    try {
        // Insert event into database
        const [existingEvent] = await db.select().from(eventManagement).where(eq(eventManagement.id, eventId));
        if (!existingEvent) {
            return {status: 404, data: "Event not found"};
        }
        // Check if the user is already registered for the event
        const [existingRegistration] = await db
        .select()
        .from(eventRegistrations)
        .where(
            and(
            eq(eventRegistrations.eventId, eventId),
            eq(eventRegistrations.participantId, authUser.user_id)
            )
        )
        console.log("Existing registration:", existingRegistration);
        if (existingRegistration) {
            return {status: 400, data: "User already registered for this event"};
        }            
        const [participant] = await db
        .select()
        .from(participants)
        .where(eq(participants.id, authUser.user_id));

         if (!participant) {
            return {status: 404, data: "Participant not found"};
        }

        const data = {};
        data.eventId = eventId; // Associate the registration with the event 
        data.participantId = authUser.user_id; // Associate the registration with the participant
        data.status = 'registered'; // Set initial status to 'registered'        
        const [registeredEvent] = await db.insert(eventRegistrations).values(data);
        const insertedId = registeredEvent?.insertId;
    
        const [insertedRow] = await db
        .select()
        .from(eventRegistrations)
        .where(eq(eventRegistrations.id, insertedId));
        //Send Email to participant on successful registration
        await sendEmail(participant.email, participant?.firstName,participant?.lastName);
        return {status: 201, data: {message: "Event registered & email sent successfully", data: insertedRow}};
    } catch (error) {
        console.error("Error inserting event into database:", error);
        return {status: 500, data: "Unable to register event"};
    }
}

module.exports = {createEvent,updateEvent,registerEvent};