const express = require('express')
const DeckService = require('../deck/deck-service')

const deckIdRouter = express.Router()
const jsonParser = express.json()
const bodyParser = express.json();


deckIdRouter
  .route('/:id')
  .get(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get('db')
    let id = req.params.id

    DeckService.getDecks(knexInstance)
      .then(response => res.json(response))
  })

module.exports = deckIdRouter