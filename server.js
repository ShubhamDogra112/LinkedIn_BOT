const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');
const pup = require("puppeteer");
const dir = "./companies/";
const LinkedInScript = require("./script.js");

let finalData;
let br;

//middlewares
app.use(express.static("public"));
app.set('view engine', 'ejs');


//routes
app.get("/", (req, res , next) => {
    let data = [];
    if(fs.existsSync("./data/data.json")){ 
        data = fs.readFileSync("./data/data.json")
        data = JSON.parse(data);
    }
    res.render('home', {data : data});
})

app.get("/sendInvites", (req,res,next) => {
    LinkedInScript.run(br)
    .then(() => {
        res.status(200).send("Done");
    })
    .catch(err => {
        console.error(err);
    })
})


//server
app.listen(port , () => {
    console.log(`Server started on port ${port}`)
})


const browser = pup.launch({
    headless: false,  //false means browser is going to visible
    defaultViewport: false
});

browser.then(async br => {

    for(let file of fs.readdirSync(dir)){
        let f = require(dir + file);
        finalData = await f.run(br);
    }
    fs.writeFileSync('./data/data.json', JSON.stringify(finalData));
    let tab = await br.newPage();   
    tab.goto("http://localhost:3000");
})
.catch(err => {
    console.error(err);
})
