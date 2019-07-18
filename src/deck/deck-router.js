const express = require('express')
const DeckService = require('./deck-service')
const { requireAuth } = require('../middleware/jwt-auth')

const deckRouter = express.Router()
const jsonParser = express.json()
const bodyParser = express.json();

deckRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    req.query
    DeckService.getDecks(knexInstance)

        .then(decks => {
            res.json(decks)
        })
      .catch(next)
  })




module.exports = deckRouter