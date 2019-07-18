const express = require('express')
const CardService = require('./card-services')
const { requireAuth } = require('../middleware/jwt-auth')

const cardRouter = express.Router()
const jsonParser = express.json()
const bodyParser = express.json();

cardRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    CardService.getAllCards(knexInstance)
      .then(cards => {
        res.json(cards)
      })
      .catch(next)
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
  .patch(bodyParser, (req, res, next) => {
    const { card_id, card_active } = req.body
    const cardToUpdate = {   card_active }

    CardService.updateUser(
      req.app.get('db'),
      card_id,
      cardToUpdate
    )

      .then(numRowsAffected => {
        res.status(204).json({
          updated: true
        })
      })
      .catch(next)
  })



module.exports = cardRouter