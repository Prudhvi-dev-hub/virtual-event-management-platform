const express = require("express");
const router = express.Router();
const {createEvent,updateEvent,registerEvent} = require('../controllers/event-controller');

router.use(express.json());

router.post('/create',async (req,res)=>{
    const toCreateEvent = req.body;
    const eventStatus = await createEvent(toCreateEvent);
    return res.status(eventStatus.status).send(eventStatus.data);
});

router.post('/:id/update',async(req,res)=>{
    const eventId = req.params.id;
    const toUpdateEvent = req.body;
    const eventStatus = await updateEvent(eventId, toUpdateEvent);
    return res.status(eventStatus.status).send(eventStatus.data);
});

router.post('/:id/register',async(req,res)=>{
    const eventId = req.params.id;
    const toRegisterEvent = req.body;
    const eventStatus = await registerEvent(eventId, toRegisterEvent);
    return res.status(eventStatus.status).send(eventStatus.data);
});

module.exports = router;