'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS funct9ionality to parse the body of the request
app.use(express.urlencoded({extended : true}))
// Specify a directory for static resources
app.use(express.static('public'))
// define our method-override reference
app.use(methodOverride('_method'))
// Set the view engine for server-side templating
app.set('view engine', 'ejs')

// Use app cors
app.use(cors())

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --


// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --

// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);