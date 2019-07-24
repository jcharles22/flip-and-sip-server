const express = require('express')
const CardService = require('./card-services')
const AuthSerivce = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const cardRouter = express.Router()
const jsonParser = express.json()
const bodyParser = express.json();

cardRouter
  .route('/')
  .get( bodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    let userId = req.get("userName")
      CardService.getAllCards(knexInstance, userId)
      .then(cards => {
        res.json(cards)
      })
      .catch(next)
     }
  )

  .patch(requireAuth, bodyParser, (req, res, next) => {
    const { card_id, active, userName, deck_id } = req.body
    let user_id = req.user.id
    CardService.updateUser(
      req.app.get('db'),
      deck_id,
      card_id,
      user_id, 
      active, 
    )

      .then(numRowsAffected => {
        res.status(204).json({
          updated: true
        })
      })
      .catch(next)
  })

cardRouter
    .route('/:userId')
    .get(bodyParser, (req, res, next) =>{
      console.log(req.get("user"))
      res.send('ahoy')

    })



    .post(requireAuth, jsonParser, (req, res, next) => {
      const { card_title, card_desc, card_active } = req.body
      const newCard = {  card_title, card_desc, card_active }
      
     newCard.author = req.user.id
      CardService.insertCard(
         req.app.get('db'),
         newCard
       )
       .then(card => {
         res
           .status(201)
           .json(card)
       })
  })
    



module.exports = cardRouter