const DeckService = {
    getDecks(knex) {
        return knex('cards')
            .whereRaw('deck = ?', "{House Party}" )
    },

}

module.exports = DeckService;