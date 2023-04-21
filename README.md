# TinyApp Project

Ever wanted to share a URL with friends, family, or coworkers, but the link was simply too long to do so? That's where TinyApp comes in!

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of URLs page."](https://github.com/adkmcphee/tinyapp/blob/master/docs/TinyApp_URLsIndex.png)
!["Screenshot of registration page."](https://github.com/adkmcphee/tinyapp/blob/master/docs/TinyApp_Register.png)
!["Screenshot of TinyURL maker page."](https://github.com/adkmcphee/tinyapp/blob/master/docs/TinyApp_CreateTinyURL.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session
- Morgan


## Setup

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Directions
1. Visit localhost:8080/register
2. Provide a valid email and password to create your account.
3. You will be automatically logged in and redirected to your URL index page.
4. Select "Create New URL" in the navigation bar found in the app header.
5. Fill out the form with a valid URL and click submit to shorten.
6. Share the shortened URL with friends, family, coworkers, or whoever!
7. Select My URLs in the navigation bar to see your list of shortened URLs.