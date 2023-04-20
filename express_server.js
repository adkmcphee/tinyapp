const express = require("express");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
const bcrypt = require('bcryptjs');
const PORT = 8080; // default port 8080
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
};

function getUserByEmail(email) {
  for (const userID in users) {
    const user = users[userID];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

function urlsForUser(id) {
  let userUrlDatabase = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrlDatabase[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrlDatabase;
}

app.set("view engine", "ejs");

///Middleware\\\
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

///DATA///

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
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
  const userID = req.cookies["user_id"];
  console.log(req.body.longURL);
  if (!userID) {
    return res.send('Must be logged in to see this page');
  }

  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID: userID
  };



  res.redirect(`/urls/${id}`);
});
///Login\\\
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //if email address is located, but passwords don't match, return response with 403 status code.
  let foundUser = getUserByEmail(email);

  if (!foundUser) {
    return res.status(403).send('no user with that email found');
  }

  if (!bcrypt.compareSync(password, foundUser.password)) {
      return res.status(400).send('passwords do not match');
    }

  //if both pass, set user_id cookie with matching user's random id and redirect to /urls

  res.cookie("user_id", foundUser.id);
  res.redirect('/urls');
});

///Logout\\\
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

///Registration\\\
app.get("/register", (req, res) => {
  const userID = req.cookies["user_id"];

  if (userID) {
    return res.redirect('/urls');
  }

  const templateVars = {
    user: users[userID],
  };
  res.render("register", templateVars);
});

///Registration POST\\\
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  //if email or password are empty strings. Send back a res with 400 status code.
  if (!email || !password) {
    return res.status(400).send('Please fill out both fields properly.');
  }
  //if email already exists, send back res with 400 status code.
  if (getUserByEmail(email)) {
    return res.status(400).send('Sorry, that email is already in use.');
  };

  const hash = bcrypt.hashSync(password, 10)

  newUser = {
    id: id,
    email: email,
    password: hash
  };

  users[id] = newUser;
  console.log(users);
  res.cookie("user_id", users[id].id);
  res.redirect('/urls');

});

//////////
///READ///
//////////

app.get("/login", (req, res) => {

  const userID = req.cookies["user_id"];

  if (userID) {
    return res.redirect('/urls');
  }

  const templateVars = {
    user: users[userID],
  };
  res.render("login", templateVars);
});



app.get("/urls/new", (req, res) => {
  const userID = req.cookies["user_id"];

  if (!userID) {
    return res.redirect('/login');
  }

  const templateVars = {
    user: users[userID],
  };
  res.render("urls_new", templateVars);
});



app.get("/u/:id", (req, res) => {
  const id = req.params.id;

  if (!urlDatabase[id]) {
    return res.status(404).send('Error: URL does not exist');
  }

  res.redirect(urlDatabase[id].longURL);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const userID = req.cookies["user_id"];

  if (!userID) {
    return res.send('Please log in.');
  }

  if (!urlDatabase[id]) {
    return res.status(404).send('Error: URL does not exist');
  }


  if (urlDatabase[id].userID !== userID) {
    return res.send('You do not have access to this link');
  }

  const templateVars = {
    id: id,
    longURL: urlDatabase[id].longURL,
    user: users[userID]
  };
  res.render("urls_show", templateVars);
});



app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];

  if (!userID) {
    return res.send('Please register or log in.');
  }
  let urlDatabase = urlsForUser(userID);

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


app.post("/urls/:id", (req, res) => {
  const longURL = req.body.longURL;
  const id = req.params.id;
  const userID = req.cookies["user_id"];


  if (!userID) {
    return res.send('Please log in.');
  }


  if (!urlDatabase[id]) {
    return res.status(404).send('Error: URL does not exist');
  }

  if (urlDatabase[id].userID !== userID) {
    return res.send('You do not have access to this link');
  }

  urlDatabase[id].longURL = longURL;

  res.redirect("/urls");
});



///////////
///DELETE//
///////////
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const userID = req.cookies["user_id"];

  if (!userID) {
    return res.send('Please log in.');
  }


  if (!urlDatabase[id]) {
    return res.status(404).send('Error: URL does not exist');
  }

  if (urlDatabase[id].userID !== userID) {
    return res.send('You do not have access to this link');
  }


  delete (urlDatabase[id]);

  res.redirect(`/urls`);
});


////////////\\\\\\\\\\\\\
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

