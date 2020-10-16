
function parsecsv()
{

    const name_input = document.getElementById('name').value;
    const phone_input = document.getElementById('phone').value;
    const subject_input = document.getElementById('subject').value;
    const message_input = document.getElementById('message').value;
    
    // Uncomment this for testing the working with one single email request
    // sendData(name_input, phone_input, subject_input, message_input, 'abcd@gmail.com');
    
    Papa.parse(document.getElementById('upload-csv').files[0], {
        download: true,
        header: false,
        worker:true,
        step: function(results){

            for (let i of results.data){
                if(i !==  null && i !== ''){
                                        
                    // Sends post requests for all the email addresses in the .csv file
                    sendData(name_input, phone_input, subject_input, message_input, i);

                    // Printing out each Email address to console
                    console.log(i);
                    
                }                 
            }
        }
    })
}

const sendData = (name_input, phone_input, subject_input, message_input, emailAddress) => {
    sendHttpRequest(name_input, phone_input, subject_input, message_input, emailAddress)
    .then(responseData => {
        let resp = JSON.parse(responseData);
        console.log(resp)
    })
    .catch(err => {
        console.log(err);
    });
}

 sendHttpRequest = (name_input, phone_input, subject_input, message_input, dataObj) => {

    const promise = new Promise ((resolve, reject) => {
        // Initializing and Setting up XMLHttpRequest paramenters for sending POST request
        const xhr = new XMLHttpRequest();

        xhr.open('POST', 'http://localhost:3000/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onerror = () =>{
            console.log('Error Occured while using XHR method.')
        };

        // using 'onLoad' because of broader Browser support
        xhr.onload = () => { 
            if(xhr.status >= 400){
                reject(xhr.response);
            }
            else{                    
                resolve(xhr.response);
            }
        }
        
        emailRequest = {
            name: name_input,                    // Receiver's Name
            phone: phone_input,                  // Phone number of receiver
            subject: subject_input,              // Subject line
            message: message_input,              // Message Body
            emaillist: dataObj,                  // list of receivers email addresses  <<--- Important field
        }

        xhr.send(JSON.stringify(emailRequest));
        //xhr.close();
    })

    return promise;
};

