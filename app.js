const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");



const app = express();

app.use(bodyParser.urlencoded({extended: true}))  //url encoded request
app.use(express.static("public"));   //we will keep all our files in static folder i.e. css, images etc
// remember to change the link ref in signup.html
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
// remember to add action and POST method in form of signup.html
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    var data = {                    //mailchimp data which they expect us to send them
        members: [             //memebers need to be an array
            {                     // single object in array since one subdcriber at a time
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);   // converting js to json
    //X below is replaced by api key server number which was 13 (can be 1-20) of mailchimp and at last List id/audience id is added

    const url = "https://us13.api.mailchimp.com/3.0/lists/62acfb7cc8"

    const options = {
        method: "POST",   //most important option
        auth: "arya:9b91ed04bef9365c48c2b73cee6f5604-us13" //authentication, HTTP basic authentication (string: APIkey)
    }

    //creating a post request using https module
    
    const request = https.request(url, options, function(response){ //callback which will give response back from mailchimp server
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } 
        else{
            res.sendFile(__dirname + "/failure.html")
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);   //requesting mailchimp server
    request.end();             // doe with request
})

app.post("/failure", function(req, res){ // after clicking try again it will be redirected to the main sign up page
    res.redirect("/");    // redirect to home page, triggers the signup.html
})

app.listen(3000, function() {
    console.log("Server is running on port 3000");
})
