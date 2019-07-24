const express = require('express')
const DeckService = require('./deck-service')

const deckRouter = express.Router()
deckRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    DeckService.getDecks(knexInstance)
      .then(response => res.json(response))
  
  
    })
  .post((req, res, next) => {
    const knexInstance = req.app.get('db')
    DeckService.getCardsByDeckId(knexInstance)
      .then(response => res.json(response))
  })

module.exports = deckRouter