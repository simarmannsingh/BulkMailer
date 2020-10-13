const express = require('express');
const body_parser = require('body-parser');
const express_handlebars = require('express-handlebars');
const nodemailer = require("nodemailer");
const path = require('path');
const app = express();

// View Engine Setup
app.engine('handlebars', express_handlebars());
app.set('view engine', 'handlebars');

// static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser Middleware
app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.get('/', (req, res) => {    
    res.render('contact', {layout: false});
});

app.post('/', (req, res) => {

    let transporter = nodemailer.createTransport({
        // Please use your own SMTP mail credentials for sending 1 million Emails.
        host: "smtp.ethereal.email",                        // your.smtp.address
        port: 587,                                          // your.smtp.portnumber
        secure: false,                                      // true for port number: 465, false for other ports
        auth: {
            user: 'aidan.jones79@ethereal.email',                // your email used for authentication / ethereal user
            pass: 'kTJbgaYFNP6wcJW4tj',                     // your password for authentication / ethereal password
        },
        tls:{
            rejectUnauthorized: false                       // leave this to false if using GMAIL or service that advanced security enabled
        }
    });
    
    // HTML email template you receive in email
    let output = `
                <p>Hello ! You have a new email. Message Details are as follows :-</p>    
                <ul>
                    <li> Name : ${req.body.name} </li>
                    <li> Phone Number : ${req.body.phone} </li>
                    <li> Subject : ${req.body.subject} </li>
                    <li> Message : ${req.body.message} </li>
                    <li> Email : ${req.body.emaillist} </li>
                </ul>
                <p> Thanks. Have a nice Day </br></br>Best Regards, </br> A job seeker </p>
                `;

    let mailOptions = {
        from: '"Data4Life" <admin@data4life.de>',
        to: `${req.body.emaillist}`,                    
        subject: `${req.body.subject}`,                 
        text: `${req.body.message}`,                    
        html: output,                                   
    };

    // send mail with defined transport object
    transporter.sendMail( mailOptions, (error, info) => {
        if(error){
            return console.log(error);
        }        
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });

    res.render('contact', {layout: false});    

});

 app.listen(3000, () => { console.log('Server Started at http://localhost:3000/ ...')});
