const CardService = {
    getAllCards(knex) {
        return knex('cards')
            .select('card_id','card_title','card_desc','card_active','user_name')
            .join('users', 'cards.author', 'users.id')
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
    // getById(knex, id) {
    //     return knex 
    //         .from('cards')
    //         .select('*')
    //         .where('id', id)
    //         .first()
    // },
    // deleteUser(knex, id) {
    //     return knex('cards')
    //         .where({id})
    //         .delete()
    // },
    updateUser(knex, card_id, updateCard) {
        console.log(updateCard)
        return knex('cards')
            .where({card_id})
            .update(updateCard)
    },
}

module.exports = CardService;