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
    .post(requireAuth, jsonParser, (req, res, next) => {
      let { card_title, card_desc, deck } = req.body
      console.log(req.body)
      const newCard = {  card_title, card_desc}
      newCard.author = req.user.id
      console.log('req.user ' +req.user.id)
      let card=[];
        CardService.insertCard(
          req.app.get('db'),
          newCard
       ) .then(cardId => {
         console.log('cardId = '+ cardId )
          return CardService.getAllUsersByIds(req.app.get('db'))
            .then(users=> {
                let card=[]
                let counter = 0
                deck.forEach((deck, count) => { 
                  console.log('countet: ' + counter)
                  let deckId =parseInt(deck)
                  users.forEach((user, index)=> {
                    return(
                      card[counter]={users:user.id, card_id: cardId.card_id, deck_id:deckId},
                      counter++
                    )
                  })
                })

                return CardService.updateDeck_card(req.app.get('db'), card)
                  .then(response=> res.status(204).send())
            }).catch(error => console.error(error))

        }) .then(response =>{return null})
            .catch(error => console.log(error))
  })
    



module.exports = cardRouter