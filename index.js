const express= require('express');
const exphbs = require('express-handlebars');
const session= require('express-session');
const fs= require('fs');


const app= express();
const PORT = 3000;

//MidleWare
// app.set("views", __dirname + '/views');
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/public'));
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
    const user= users.find(user => user.id === req.session.userId);
    res.render("home",{name:user.name});
})

app.get("/login", (req,res)=>{
    res.render("login");
})

app.post('/login', (req,res)=>{
    const user= users.find(user => user.email === req.body.email);
    if(!user || user.password!==req.body.password){
        // return res.status(400).send("Invalid credentials");
        return res.render("login",{error:"Invalid credentials"})
    }
    req.session.userId=user.id;
    res.render("home",{user: user});
    console.log(req.session);

})
app.get('/edit',login,(req,res) => {
    const user= users.find(user => user.id === req.session.userId);
    res.render("edit",{email:user.email});
})


app.post('/edit',login,(req,res) => {
    const user= users.find(user => user.id === req.session.userId);
    user.email=req.body.email;
  
    fs.writeFile("db.json",JSON.stringify(users),(err) => {
        if(err) return console.log(error)
        console.log(`User ${user.id} email changed to ${user.email}`);
    })
    res.render("edit",{email: user.email, changed: "User changed"});
})
app.get("*", (req, res) => {
  
    // Here user can also design an
    // error page and render it 
    res.render("error");
  });


//Server

app.listen(PORT, () =>{ console.log("Listening on port", PORT)});