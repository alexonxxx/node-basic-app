const express= require('express');
const exphbs = require('express-handlebars');
const fs= require('fs');


const app= express();
const PORT = 3000;

//MidleWare
// app.set("views", __dirname + '/views');


//Sets handlebars configurations
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

//Db

const users= JSON.parse(fs.readFileSync('db.json'));

//Routes

app.get("/", (req,res)=>{
    res.redirect('/home')
})

app.get("/home", (req,res)=>{
    res.send("home");
})

app.get("/login", (req,res)=>{
    res.render("login");
})

app.post('/login', (req,res)=>{
    console.log(req.body);

})

// app.get("*", (req, res) => {
  
//     // Here user can also design an
//     // error page and render it 
//     res.send("PAGE NOT FOUND");
//   });


//Server

app.listen(PORT, () =>{ console.log("Listening on port", PORT)});