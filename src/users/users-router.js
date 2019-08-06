const express = require('express')
const UsersService = require('./users-service')
const usersRouter = express.Router()
const jsonBodyParser = express.json()
const CardService = require('../cards/card-services')
const path = require('path')

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { password, user_name } = req.body
        for (const field of ['user_name', 'password'])
            if (!req.body[field])
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            })
            const passwordError = UsersService.validatePassword(password)

        if(passwordError)
            return res.status(400).json({ error: passwordError })

        UsersService.hasUserWithUserName( 
            req.app.get('db'),
            user_name
        )
            .then(hasUserWithUserName => {
                if(hasUserWithUserName)
                    return res.status(400).json({ error: `Username already taken` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => { 
                        const newUser = {
                            user_name,
                            password : hashedPassword,
                            date_created: 'now()',
                        }
                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )

                            .then(user => {
                                res 
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                                    return user    
                            } 
                            ).then(user => {return CardService.getStarterCards(req.app.get('db'))
                                    .then(response => {
                                            let newUser = []
                                            response.forEach((card, index) => {
                                                newUser[index]={deck_id:card.deck_id, card_id: card.card_id, users: user.id}
                                            })          
                                            return newUser;
                                    })
                                    .catch(next)
                                        .then(newUser => {return CardService.updateDeck_card(req.app.get('db'), newUser)})
                                        .then(response => {return null})
                                        .catch(next)
                            }) 
                        })
            })
            .catch(next)
    })


module.exports = usersRouter