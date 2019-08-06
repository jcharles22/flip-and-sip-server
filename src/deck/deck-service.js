const DeckService = {
    getDecks(knex) {
        return knex('decks')      
    },
    getCardsByDeckId(knex){
        return (knex('deck_card_connection')
            .select('deck_title', 'card_title', 'card_desc', 'author', 'user_name','active')
            .join('decks', 'deck_card_connection. deck_id', 'decks.deck_id')
            .join('cards', 'deck_card_connection.card_id', 'cards.card_id')
            .join('users', 'cards.author', 'users.id') 
        )
    }
}

module.exports = DeckService;