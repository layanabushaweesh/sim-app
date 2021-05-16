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
app.get('/', renderHome)
app.post('/save' , saveFav)
app.get('/favorite-quotes',renderFav)
app.post('/favorite-quotes/:quote_id', showDetalis)
app.put('/favorite-quotes/:quote_id' , updateQ)
app.delete('/favorite-quotes/:quote_id' , deleteQ)
// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function renderHome(req,res) {
    const url ='https://thesimpsonsquoteapi.glitch.me/quotes?count=10'
    superagent.get(url).set('User-Agent', '1.0').then((dataFromApi =>{
        const apiData = dataFromApi.body.map(data =>{
            return new Character(data)
        })
        res.render('index' , {characters : apiData})
    })).catch(error =>(console.log(error)))
}

function saveFav(req,res) {
    const {quote,character,image,characterDirection}=req.body
    const sql ='INSERT INTO users(quote,character,image,characterDirection) VALUES ($1,$2,$3,$4)'
    const value =[quote,character,image,characterDirection]
    client.query(sql,value).then (()=>{
        res.redirect('/favorite-quotes')

    })
}
function renderFav(req,res) {
    const sql ='SELECT * FROM users'
    client.query(sql).then((dataFromDb =>{
        res.render('favorite', { fav :dataFromDb .rows})
    }))
    
}
function showDetalis(req,res) {
    const id = req.params.quote_id
    const sql = 'SELECT * FROM users WHERE id=$1'
    const value =[id]
    client.query(sql,value).then((dataFromDb =>{
        res.render('detalis' , { datalis : dataFromDb.rows})
    }))
    
}
function updateQ(req,res) {
    const id =req.params.quote_id
    const qout =req.body.qoute
    const sql ='UPDATE users SET quote=$1 WHERE id=$2'
    const value=[qout,id]
    client.query(sql,value).then(()=>{
        res.redirect(`/favorite-quotes/${id}`)
    })
    
}
function deleteQ(req,res) {
    const id = req.params.quote_id
    const sql ='DELETE FROM users WHERE id=$1 '
    const value =[id]
    client.query(sql,value).then(()=>{
        res.redirect('/favorite-quotes')
    })
    
}
// helper functions
function Character(data) {
   this.quote=data.quote
   this.character=data.character
   this.image =data.image
   this.characterDirection=data.characterDirection
    
}
// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);