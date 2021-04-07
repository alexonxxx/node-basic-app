const express= require('express');
const exphbs = require('express-handlebars');
const session= require('express-session');
const fs= require('fs');


const app= express();
const PORT = 3000;

//MidleWare
// app.set("views", __dirname + '/views');

app.use(express.urlencoded({extended: true}));
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.use(session({
    secret:"test",
    resave:false,
    saveUninitialized: false
}));

app.set('view engine', 'hbs');

const login = (req,res,next) =>{
    if(!req.session.userId){
        res.redirect("/login");
    }else{
        next();
    }
}

//Db

const users= JSON.parse(fs.readFileSync('db.json'));

//Routes

app.get("/", (req,res)=>{
    res.redirect('/home');
})


app.get("/home", login, (req,res)=>{
    res.render("home");
})

app.get("/login", (req,res)=>{
    res.render("login");
})

app.post('/login', (req,res)=>{
    const user= users.find(user => user.email === req.body.email);
    if(!user || user.password!==req.body.password){
        return res.status(400).send("Invalid credentials");
    }
    req.session.userId=user.id;
    res.render("home");
    console.log(req.session);

})

// app.get("*", (req, res) => {
  
//     // Here user can also design an
//     // error page and render it 
//     res.send("PAGE NOT FOUND");
//   });


//Server

app.listen(PORT, () =>{ console.log("Listening on port", PORT)});