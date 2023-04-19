const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080
function generateRandomString(){
 return Math.random().toString(36).substring(2,8);
};

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

///DATA///

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


///BROWSE///
app.get("/", (req, res) => {
  res.send("Hello!");
});

///ADD///

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`); 
});

app.post("/login", (req, res) => {
  const loginID = req.body.login
  res.cookie('username', loginID)
  res.redirect('/urls/'); 
})
app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect('/urls/'); 
})

///READ///
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/u/:id", (req, res) =>{
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
})

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const templateVars = {
    id: id, 
    longURL: urlDatabase[id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

///EDIT///

app.post("/urls/:id", (req,res) =>{
  const longURL = req.body.longURL
  const id = req.params.id

  urlDatabase[id] = longURL;
  console.log(urlDatabase);
  
  res.redirect("/urls");
})

app.post("/urls/:id/edit", (req,res) =>{
  const id = req.params.id;
res.redirect(`/urls/${id}`)
})

///DELETE//
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete(urlDatabase[id]);
  
  res.redirect(`/urls/`); 
});


////////////\\\\\\\\\\\\\
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

