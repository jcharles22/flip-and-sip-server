const knex = require('knex');
const app = require('../src/app');
require('dotenv').config();

describe('App', () => {
    it('GET / responds with 200 contating "Hello, world!"', () => {
        return supertest(app)
          .get('/')
          .expect(200, "Hello, world!")
    })
})

describe('Card service', function() {
  let db;
  let testCards = [{
    card_title: 'TEST',
    card_desc: 'test test',
    author: 1
  }]
  let testUsers=[{
    user_name: 'test',
    password: 'Password1!'
  }]
  let testNewUser = [
    {
      user_name: 'test1',
      password: 'TestPassword1!'
    }
  ]
  let testDeck = [{
    deck_id: 1,
    deck_title: 'test deck'
  }]
let testConnection = [{
  deck_id: 1,
  card_id: 1,
  users: 1,
  active: true
}]



  before('make knex instance', ()=> {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  before('clean the table', () => db.raw('TRUNCATE deck_card_connection, decks, cards, users RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE deck_card_connection, decks, cards, users RESTART IDENTITY CASCADE'))

  after(() => db.destroy())

  describe(``, () => {
    context(`seed the database`, () => {
      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('cards')
              .insert(testCards)
          })
          .then(() => {
            return db
              .into('decks')
              .insert(testDeck)
          })
          .then(() => {
            return db
              .into('deck_card_connection')
              .insert(testConnection)
          })
      })
      it(`responds with 200 and deck`, () => {
        return supertest(app)
          .get('/api/deck')
          .expect(200, testDeck)
      })
    })

    it('responds with 200 and all of the cards', () => {
      return supertest(app)
        .get('/api/card')
        .expect(200, [])
     })
    })

    it('responds with something', ()=> {
      return supertest(app)
        .get('/api/')
    })
   
})
