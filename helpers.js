function getUserByEmail(email, database) {
  for (const userID in database) {
    const user = database[userID];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}
function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
};

function urlsForUser(id, urlDatabase) {
  let userUrlDatabase = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrlDatabase[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrlDatabase;
};


module.exports = {getUserByEmail, generateRandomString, urlsForUser}