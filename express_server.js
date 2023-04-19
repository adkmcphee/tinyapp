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

let users = {
  abc: {
    id: "abc",
    email: "a@a.com",
    password: "1234",
  },
  def: {
    id: "def",
    email: "b@b.com",
    password: "asdf",
  },
};
////////////
////BROWSE//
////////////
app.get("/", (req, res) => {
  res.send("Hello!");
});

/////////
///ADD///
/////////
app.post("/urls", (req, res) => {
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`); 
});
///Login\\\
app.post("/login", (req, res) => {
  ///below may cause bug for now...///
  const loginID = req.body.login
  res.cookie('user_id', loginID)
  res.redirect('/urls/'); 
})
///Logout\\\
app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect('/urls/'); 
})

///Registration\\\
app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"]

  const templateVars = {
    user: users[userID],
  };
  res.render("register", templateVars); 
})

///Registration POST\\\
app.post("/register", (req, res) => {
  let id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  users[id] = {
    id: id,
    email: email,
    password: password
  }
  res.cookie("user_id", users[id].id)
  res.redirect('/urls')

});

//////////
///READ///
//////////
app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"]

  const templateVars = {
    user: users[userID],
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
  const userID = req.cookies["user_id"]
  const templateVars = {
    id: id, 
    longURL: urlDatabase[id],
    user: users[userID]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"]
  const templateVars = {
    urls: urlDatabase,
    user: users[userID]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


//////////
///EDIT///
//////////
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

///////////
///DELETE//
///////////
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete(urlDatabase[id]);
  
  res.redirect(`/urls/`); 
});


////////////\\\\\\\\\\\\\
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

