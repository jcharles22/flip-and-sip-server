const CardService = {
    getAllCards(knex, userId) {
        return (
            knex
            .from('deck_card_connection')
            .where({'users.user_name': userId})
            .select('deck_title', 'deck_card_connection.deck_id', 'cards.card_id', 'card_title', 'card_desc', 'author','users', 'user_name','active')
            .join('decks', 'deck_card_connection. deck_id', 'decks.deck_id')
            .join('cards', 'deck_card_connection.card_id', 'cards.card_id')
            .join('users', 'deck_card_connection.users', 'users.id')
        )
    },
    getAllUsersByIds(knex){
        return knex('users')
        .select('id')
    },
    getUserId(knex, id) {
        return knex('users')
            .where({id: id})
    },
    insertCard(knex, newCard) {
        return knex
            .insert(newCard)
            .into('cards')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getAllCardsInDeck(knex, id) {
        return knex('cards')
             .where('card_id', id)
            .select('card_id', 'card_desc')
    },
    updateUser(knex, deck_id, card_id, user_id, active) {
        return (knex('deck_card_connection')
        .join('users', 'deck_card_connection.users', 'users.user_name')
            .where({
                'users': user_id,
                'deck_id' : deck_id,
                'card_id' : card_id,   
            })
            .update({active})
        )    
    },
     updateDeck_card(knex, card){
         return (
             knex('deck_card_connection')
             .insert(
                card
             )
             
             
         )
     },

     getStarterCards(knex){
         return knex('deck_card_connection')
         .where({'users':8})
     }
}

module.exports = CardService;