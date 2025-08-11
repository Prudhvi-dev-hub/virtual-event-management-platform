const express = require('express');
const app = express();
const adminAuthRouter = require('./routes/admin-auth-route');
const participantAuthRouter = require('./routes/participant-auth-route');
const adminAuthGuard = require('./middlewares/admin-auth');
const participantAuthGuard = require('./middlewares/participant-auth');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/admin',adminAuthRouter); //Mounting of auth route
app.use('/api/v1/participant',participantAuthRouter); //Mounting of auth route

//Health check
app.get('/',(req,res)=>{
    return res.status(200).send("System stable and working..");
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;