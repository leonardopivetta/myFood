var test = require('tape');
var request = require('supertest');
var app = require('../');
// const { json } = require('body-parser');

const id_ristorante = "ristorante_testing";

// TODO group tests in decribe statements
// const post = await Post.create({ title: "Post 1", content: "Lorem ipsum" });
  test("Correct menu returned", async () => {
  
    await supertest(app).get(id_ristorante + '/api/menu')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        // check type and length
        expect(response.body.length).toEqual(1);
        expect(Array.isArray(response.body.apertura)).toBeTruthy()
        expect(Array.isArray(response.body.categorie)).toBeTruthy()

        // check data
        expect(response.body[0].id_ristorante).toBe(id_ristorante)
        // todo check more data
      });
  });


// describe('Inserting in the DB', () => {
//     const user =  { id: "1", name: "Username", login: "user"};
//     test('Get all users', (done) => {
//         const expectedResponse = []
//         request(app)
//         .get('/')
//         .expect(200)
//         .end((err, res) => {
//             expect(res.body).toEqual(expectedResponse)
//             done();
//         })
//     })
//     it('Create a user', (done) => {
//         const expectedResponse = [user]
//         request(app)
//         .post('/user')
//         .send(user)
//         .expect(200)
//         .end((err, res) => {
//             expect(res.body).toEqual(expectedResponse)
//             done();
//         })
//     })
//     it('Get user record by id', (done) => {
//         const expectedResponse = {...user}
//         request(app)
//         .get('/user/1')
//         .expect(200)
//         .end((err, res) => {
//             expect(res.body).toEqual(expectedResponse)
//             done();
//         })
//     })
//     it('Update a user record', (done) => {
//         const updateUser = {name: 'Updated name'}
//         const expectedResponse = {...user, ...updateUser}
//         request(app)
//         .put('/user/1')
//         .send(updateUser)
//         .expect(200)
//         .end((err, res) => {
//             expect(res.body).toEqual(expectedResponse)
//             done();
//         })
//     })
//     it('Get user record which does not exists', (done) => {
//         const expectedResponse = {
//             message: 'No user found with given ID'
//         }
//         request(app)
//         .get('/user/2')
//         .expect(400)
//         .end((err, res) => {
//             expect(res.body).toEqual(expectedResponse)
//             done();
//         })
//     })
// })