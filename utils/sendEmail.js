const SibApiV3Sdk = require('sib-api-v3-sdk');
const dotenv = require('dotenv');

dotenv.config();
async function sendEmail(receiverEmail, firstName, lastName) {
    try {    
    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    // Configure API key authorization: api-key
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_EMAIL_API_KEY; // Ensure you have this key in your .env file

    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

    sendSmtpEmail = {
        to: [
            {
                email: receiverEmail,
                name: `${firstName} ${lastName}`
            }
        ],
        templateId: 1,
        params: {
            contact:{
                FIRSTNAME: firstName,
                LASTNAME: lastName
            },
        },
        headers: {
            'api-key': process.env.BREVO_EMAIL_API_KEY, // Ensure you have this key in your .env file
            'content-type': "application/json",
            'accept': "application/json"
        }
    };

    console.log("Sending email to:", receiverEmail, "with name:", `${firstName} ${lastName}`);

    const emailSent = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", emailSent);
    return emailSent;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
}

module.exports = { sendEmail };