import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import bcrypt from 'bcrypt';

import model from '../models';
import app from '../server';

chai.use(chaiHttp);

const User = model.Users;
const salt = bcrypt.genSaltSync(10); // Generate salt for password

const { expect } = chai;
const userName = `${faker.fake('{{name.lastName}}')}johnDoe`;
const email = `${faker.fake('{{name.firstName}}')}@email.com`;
const userName1 = `${faker.fake('{{name.lastName}}')}johnDoee`;
const email1 = `${faker.fake('{{name.firstName}}')}e@email.com`;
let token = '';
let key = '';
const adminName = `${faker.fake('{{name.lastName}}')}janDoe`;
const adminEmail = `${faker.fake('{{name.firstName}}')}@email.com`;

let adminToken = '';
let userId = '';
const user1 = {
  name: userName,
  email,
  password: 'jonbullish',
  confirmPassword: 'jonbullish'
};
const user2 = {
  name: userName,
  password: 'jonbullis',
};
const userName3 = {
  name: 'johnbosco'
};
const user3 = {
  name: userName1,
  email: email1,
  password: 'jonbullishki',
};
const admin = {
  name: adminName,
  email: adminEmail,
  password: 'jonbullish',
};
const user = {
  name: 'jon bull',
  email: 'jonbull@email.com',
  password: 'jonbullish',
};
const book = {
  cover: 'sdhdsjcdssnbdsdsbhjsb',
  pdf: 'bssskskjhdb',
  title: 'Eze go to school',
  author: 'Chinua Achebe',
  description: 'A young boy from the village who finally goes to school',
  quantity: 5,
  genre: 'Educational',
};
const book2 = {
  cover: 'sdhdsjcdsssjkssjksnbdsdsbhjsb',
  pdf: 'bssskskjhdkjsnjksb',
  title: 'Ali and Simbi',
  author: 'Joy chinelo',
  description: 'Ali is a boy and Simbi is a girl',
  quantity: 0,
  genre: 'Educational',
};
const book3 = {
  cover: '',
  pdf: 'bssskskjhdb',
  title: 'Ali and Simbi',
  author: '',
  description: 'Ali is a boy and Simbi is a girl',
  quantity: 0,
  genre: 'Educational',
};
const genre = {
  bookGenre: 'endghcvdshgj'
};
const Admin = {
  email: 'admin@hellobooks.com',
  password: 'silver',
};
const hash = bcrypt.hashSync(Admin.password, salt);


User.create({
  email: Admin.email,
  password: hash,
  isAdmin: true,
  star: 'admin',
  confirmed: true,
  key: 'admin',
  name: 'admin'
}).then(createdUser => createdUser)
  .catch(error => error.message);

describe('Users', () => {
  it('should get a message and key on successful signup', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user1)
      .set('Accept', 'application/json')
      .end((error, response) => {
        const { key: confirmationKey } = response.body;
        key = confirmationKey;
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.equal('A mail has been sent to your email');
        expect(response.body).to.have.property('key');
        if (error) return done(error);
        done();
      });
  });
  it('should not sign up with existing emails', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user1)
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) {
          expect(error.response.status).to.equal(409);
          expect(error.response.body)
            .to.have.property('message');
          expect(error.response.body.message)
            .to.equal('Sorry email has already been taken');
        }
        done();
      });
  });
  it('should not sign up with non-emails', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send({ email: 'user1' })
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) {
          expect(error.response.status).to.equal(400);
          expect(error.response.body).to.have.property('message');
          expect(error.response.body.message)
            .to.equal('This is not an email');
        }
        done();
      });
  });
  it('should have email to signup', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send('')
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) {
          expect(error.response.status).to.equal(400);
          expect(error.response.body).to.have.property('message');
          expect(error.response.body.message)
            .to.equal('Email is required');
        }
        done();
      });
  });

  it('should get a token and id on successful confirmation', (done) => {
    chai.request(app)
      .put(`/api/v1/confirmation/${key}`)
      .send(user1)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Successfully updated');
        expect(response.body).to.have.property('myToken');
        expect(response.body).to.have.property('userId');
        expect((response.body.userId)).to.equal(2);
        if (error) return done(error);
        done();
      });
  });
  it('should have name, password and confirmPassword for confirmation', (done) => {
    chai.request(app)
      .put(`/api/v1/confirmation/${key}`)
      .send(user2)
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) {
          expect(error.response.status).to.equal(400);
          expect(error.response.body).to.have.property('message');
          expect(error.response.body.message)
            .to.equal('All fields are required');
        }
        done();
      });
  });
  it('should have the correct key for confirmation', (done) => {
    chai.request(app)
      .put(`/api/v1/confirmation/gsB0dghVs47ngNMLQGd5VXWpHUqF`)
      .send(user1)
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) {
          expect(error.response.status).to.equal(404);
          expect(error.response.body).to.have.property('message');
          expect(error.response.body.message).to.equal('User not found');
        }
        done();
      });
  });
  it('should not update details without required fields', (done) => {
    chai.request(app)
      .put(`/api/v1/confirmation/${key}`)
      .send(user2)
      .set('Accept', 'application/json')
      .end((error, response) => {
        if (error) {
          expect(error.response.status).to.equal(400);
          expect(error.response.body).to.have.property('message');
          expect(error.response.body.message)
            .to.equal('All fields are required');
        }
        done();
      });
  });
});
// signin user
describe('User', () => {
  it('should get a message and key on successful signin', (done) => {
    chai.request(app)
      .post('/api/v1/users/signin')
      .send(user1)
      .set('Accept', 'application/json')
      .end((error, response) => {
        token = response.body.myToken;
        const { userId: id } = response.body;
        userId = id;
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('myToken');
        expect(response.body).to.have.property('userId');
        expect(response.body.userId).to.equal(2);
        if (error) return done(error);
        done();
      });
  });
  // signin admin
  it('should get a message, id and key on successful signin', (done) => {
    chai.request(app)
      .post('/api/v1/users/signin')
      .send(Admin)
      .set('Accept', 'application/json')
      .end((error, response) => {
        adminToken = response.body.myToken;
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('myToken');
        expect(response.body).to.have.property('userId');
        expect(response.body.userId).to.equal(1);
        if (error) return done(error);
        done();
      });
  });
  it('should be able to create a book admin', (done) => {
    chai.request(app)
      .post(`/api/v1/books/`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send(book)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Book successfully created');
        expect(response.body).to.have.property('newBook');
        expect(response.body.newBook).to.have.property('id');
        expect(response.body.newBook).to.have.property('cover');
        expect(response.body.newBook).to.have.property('pdf');
        expect(response.body.newBook).to.have.property('author');
        expect(response.body.newBook).to.have.property('quantity');
        expect(response.body).to.have.property('message');
        expect(response.body.newBook.cover).to.equal(book.cover);
        expect(response.body.newBook.pdf).to.equal(book.pdf);
        expect(response.body.newBook.title).to.equal(book.title);
        expect(response.body.newBook.author).to.equal(book.author);
        expect(response.body.newBook.genre).to.equal(book.genre);
        expect(response.body.newBook.description).to
          .equal(book.description);
        expect(response.body.newBook.quantity).to.equal(book.quantity);
        if (error) return done(error);
        done();
      });
  });
  it('should be able to create a book admin', (done) => {
    chai.request(app)
      .post(`/api/v1/books/`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send(book)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Book successfully created');
        expect(response.body).to.have.property('newBook');
        expect(response.body.newBook.cover).to.equal(book.cover);
        expect(response.body.newBook.pdf).to.equal(book.pdf);
        expect(response.body.newBook.title).to.equal(book.title);
        expect(response.body.newBook.author).to.equal(book.author);
        expect(response.body.newBook.genre).to.equal(book.genre);
        expect(response.body.newBook.description).to
          .equal(book.description);
        expect(response.body.newBook.quantity).to.equal(book.quantity);
        if (error) return done(error);
        done();
      });
  });
  it('should get an error when creating a book with 0 quantity', (done) => {
    chai.request(app)
      .post(`/api/v1/books/`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send(book2)
      .end((error, response) => {
        expect(error.response.status).to.equal(400);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message)
          .to.equal('This proposed quantity is too small to create a new book');
        done();
      });
  });
  it('should get an error when creating a book without cover', (done) => {
    chai.request(app)
      .post(`/api/v1/books/`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send(book3)
      .end((error, response) => {
        expect(error.response.status).to.equal(400);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message)
          .to.equal('Invalid photo!. Please try uploading another photo');
        done();
      });
  });
  it('should be able to delete a book as admin', (done) => {
    chai.request(app)
      .put(`/api/v1/books/1/delete`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.equal('Book successfully deleted');
        if (error) return done(error);
        done();
      });
  });
  it('should be able to edit a book as an admin', (done) => {
    chai.request(app)
      .put(`/api/v1/books/1`)
      .set('x-access-token', adminToken)
      .send(book)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.equal('Book updated successfully');
        if (error) return done(error);
        done();
      });
  });
  it('should not be able to edit a book that does not exist', (done) => {
    chai.request(app)
      .put(`/api/v1/books/10`)
      .set('x-access-token', adminToken)
      .send(book)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error.response.status).to.equal(404);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message)
          .to.equal('Book not found');
        done();
      });
  });
  it('should be able to get all books', (done) => {
    chai.request(app)
      .get(`/api/v1/books`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.length).to.equal(1);
        expect(response.body[0]).to.have.property('id');
        expect(response.body[0]).to.have.property('cover');
        expect(response.body[0]).to.have.property('pdf');
        expect(response.body[0]).to.have.property('author');
        expect(response.body[0]).to.have.property('quantity');
        expect(response.body[0].cover).to.equal(book.cover);
        expect(response.body[0].pdf).to.equal(book.pdf);
        expect(response.body[0].title).to.equal(book.title);
        expect(response.body[0].author).to.equal(book.author);
        expect(response.body[0].description)
          .to.equal(book.description);
        expect(response.body[0].quantity).to.equal(5);
        expect(response.body[0].genre).to.equal(book.genre);
        if (error) return done(error);
        done();
      });
  });
  it('should get a book', (done) => {
    chai.request(app)
      .get(`/api/v1/books/2`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('cover');
        expect(response.body).to.have.property('pdf');
        expect(response.body).to.have.property('author');
        expect(response.body).to.have.property('quantity');
        expect(response.body.cover).to.equal(book.cover);
        expect(response.body.pdf).to.equal(book.pdf);
        expect(response.body.title).to.equal(book.title);
        expect(response.body.author).to.equal(book.author);
        expect(response.body.description)
          .to.equal(book.description);
        expect(response.body.quantity).to.equal(5);
        expect(response.body.genre).to.equal(book.genre);
        done();
      });
  });
  it('should get error for a book that does not exist', (done) => {
    chai.request(app)
      .get(`/api/v1/books/1`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error.response.status).to.equal(404);
        expect(error.response.body.message).to.equal('Book not found');
        done();
      });
  });
  it('should get an error when deleting a book that does not exist', (done) => {
    chai.request(app)
      .put(`/api/v1/books/10/delete`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error.response.status).to.equal(404);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message).to.equal('Book is not found');
        done();
      });
  });
  it('should be able to create a book as an admin', (done) => {
    chai.request(app)
      .post(`/api/v1/books/`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .send(book)
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body.newBook).to.have.property('id');
        expect(response.body.newBook).to.have.property('cover');
        expect(response.body.newBook).to.have.property('pdf');
        expect(response.body.newBook).to.have.property('author');
        expect(response.body.newBook).to.have.property('quantity');
        expect(response.body.newBook.cover).to.equal(book.cover);
        expect(response.body.newBook.pdf).to.equal(book.pdf);
        expect(response.body.newBook.title).to.equal(book.title);
        expect(response.body.newBook.author).to.equal(book.author);
        expect(response.body.newBook.description)
          .to.equal(book.description);
        expect(response.body.newBook.quantity).to.equal(5);
        expect(response.body.newBook.genre).to.equal(book.genre);
        if (error) return done(error);
        done();
      });
  });
  it('should get an error message on incorrect details', (done) => {
    chai.request(app)
      .post('/api/v1/users/signin')
      .send(user)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error.response.status).to.equal(404);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message)
          .to.equal('Looks like you have not registered this account with us');
        done();
      });
  });
  it('should get an error message on incorrect details', (done) => {
    chai.request(app)
      .post('/api/v1/users/signin')
      .send({
        email,
        password: 'jonbullishffe',
      })
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error.response.status).to.equal(403);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message)
          .to.equal('Incorrect credentials');
        done();
      });
  });
  it('should get message when password is successfully updated', (done) => {
    chai.request(app)
      .put(`/api/v1/users/change-password/${userId}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({
        oldPassword: 'jonbullish',
        password: 'jonbullishffe',
        confirmPassword: 'jonbullishffe',
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.equal('Password successfully changed');
        if (error) return done(error);
        done();
      });
  });
  it('should get message and key when reset link is sent to email', (done) => {
    chai.request(app)
      .post(`/api/v1/users/send-password-reset-link`)
      .set('Accept', 'application/json')
      .send({
        email: user1.email
      })
      .end((error, response) => {
        const { key: confirmationKey } = response.body;
        key = confirmationKey;
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.equal('A password reset link has been sent to your email');
        expect(response.body).to.have.property('key');
        if (error) return done(error);
        done();
      });
  });
  it('should get message when password is successfully reset', (done) => {
    chai.request(app)
      .put(`/api/v1/users/reset-password/${key}`)
      .set('Accept', 'application/json')
      .send({
        password: 'jhbsjhbdshjbsd',
        confirmPassword: 'jhbsjhbdshjbsd'
      })
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.equal('Password successfully changed');
        if (error) return done(error);
        done();
      });
  });
  it('should get an error message for wrong password', (done) => {
    chai.request(app)
      .put(`/api/v1/users/change-password/${userId}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({
        oldPassword: 'jonbullishds',
        password: 'jonbullishffe',
        confirmPassword: 'jonbullishffe',
      })
      .end((error, response) => {
        expect(error.response.status).to.equal(403);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message).to.equal('Incorrect Password');
        done();
      });
  });
  it('should get an error message for password mismatch', (done) => {
    chai.request(app)
      .put(`/api/v1/users/change-password/${userId}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({
        oldPassword: 'jonbullish',
        password: 'jonbullishffe',
        confirmPassword: 'jonbullishffdscse',
      })
      .end((error, response) => {
        expect(error.response.status).to.equal(400);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message)
          .to.equal('Passwords do not match');
        done();
      });
  });
  it('should fill all details', (done) => {
    chai.request(app)
      .put(`/api/v1/users/change-password/${userId}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({
        oldPassword: 'jonbullish',
        password: 'jonbullishffe',
      })
      .end((error, response) => {
        expect(error.response.status).to.equal(400);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message).to.equal('Password field missing');
        done();
      });
  });
  it('should have password greater than 5', (done) => {
    chai.request(app)
      .put(`/api/v1/users/change-password/${userId}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({
        oldPassword: 'jonbullish',
        password: 'jo',
        confirmPassword: 'jo',
      })
      .end((error, response) => {
        expect(error.response.status).to.equal(400);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message).to.equal('Password is too short');
        done();
      });
  });
  it('should get a message if name is updated', (done) => {
    chai.request(app)
      .put(`/api/v1/users/update-user/${userId}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send(userName3)
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Successfully updated Name');
        if (error) return done(error);
        done();
      });
  });
  it('should have a name not less than 4', (done) => {
    chai.request(app)
      .put(`/api/v1/users/update-user/${userId}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .send({
        name: 'joh'
      })
      .end((error, response) => {
        expect(error.response.status).to.equal(400);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message).to.equal('Name is too short');
        done();
      });
  });
  it('should be able to get his/her details', (done) => {
    chai.request(app)
      .get(`/api/v1/users/${userId}`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('email');
        expect(response.body.name).to.equal(userName3.name);
        expect(response.body.email).to.equal(user1.email);
        if (error) return done(error);
        done();
      });
  });
  it('should not be able to create a book', (done) => {
    chai.request(app)
      .post(`/api/v1/books/`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error.response.status).to.equal(403);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message)
          .to.equal('This page is for Admins only');
        done();
      });
  });
  it('should be able to borrow book', (done) => {
    chai.request(app)
      .post(`/api/v1/users/2/2/books`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('borrowed');
        expect(response.body).to.have.property('message');
        expect(response.body.message)
          .to.equal('Book successfully borrowed');
        if (error) return done(error);
        done();
      });
  });
  it('should not borrow book when borrowed is not returned', (done) => {
    chai.request(app)
      .post(`/api/v1/users/2/2/books`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error.response.status).to.equal(401);
        expect(error.response.body).to.have.property('message');
        expect(error.response.body.message)
          .to.equal('Sorry!!! This action cannot be\
 completed due to your current star level');
        done();
      });
  });
  it('should be able to return borrowed book', (done) => {
    chai.request(app)
      .put(`/api/v1/users/2/2/books`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.updated).to.have.property('id');
        expect(response.body.updated).to.have.property('userId');
        expect(response.body.updated).to.have.property('bookId');
        expect(response.body.updated).to.have.property('returned');
        expect(response.body.updated.id).to.equal(1);
        expect(response.body.updated.userId).to.equal(2);
        expect(response.body.updated.bookId).to.equal(2);
        expect((response.body.updated.returned)).to.equal(true);
        done();
      });
  });
  it('should be able to get all borrowed books', (done) => {
    chai.request(app)
      .get(`/api/v1/users/2/books/all-borrowed`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.length).to.above(0);
        done();
      });
  });
  it('should be able to get all borrowed but not returned books', (done) => {
    chai.request(app)
      .get(`/api/v1/users/2/books`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(404);
        expect(response.body.message)
          .to.equal('You have no book pending to be returned');
        expect(Object.keys(response.body).length).to.above(0);
        done();
      });
  });
  it('should be able to borrow book', (done) => {
    chai.request(app)
      .post(`/api/v1/users/2/2/books`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('borrowed');
        expect(response.body).to.have.property('message');
        if (error) return done(error);
        done();
      });
  });
  it('should be able to get a borrowed book', (done) => {
    chai.request(app)
      .get(`/api/v1/book/2/2`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body.bookId).to.equal(2);
        expect(response.body.userId).to.equal(2);
        expect(response.body.returned).to.equal(false);
        expect(response.body.owing).to.equal(false);
        done();
      });
  });
  it('should get notifications', (done) => {
    chai.request(app)
      .get(`/api/v1/notifications/user/2`)
      .set('x-access-token', token)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect((response.body.length)).to.equal(0);
        done();
      });
  });
  it('should get notifications as an admin', (done) => {
    chai.request(app)
      .get(`/api/v1/notifications/admin`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect(response.body[0].message)
          .to.equal('johnbosco, just borrowed the book \'Eze go to school\'');
        expect(response.body[0].type).to.equal('admin');
        expect(response.body[0].from).to.equal(userName3.name);
        expect(response.body[0].userId).to.equal(2);
        expect(response.body[0].bookId).to.equal(2);
        expect((response.body.length)).to.above(0);
        done();
      });
  });
  it('should add new genre as Admin', (done) => {
    chai.request(app)
      .post(`/api/v1/books/genre`)
      .send(genre)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(201);
        expect((response.body)).to.have.property('message');
        expect((response.body)).to.have.property('createdGenre');
        expect((response.body.message)).to.equal('Genre created');
        expect((response.body.createdGenre))
          .to.equal(genre.bookGenre.toUpperCase());
        done();
      });
  });
  it('should recieve error when add new genre fails', (done) => {
    chai.request(app)
      .post(`/api/v1/books/genre`)
      .send({
        bookGenre: 'gh'
      })
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(error.response.status).to.equal(400);
        expect((error.response.body))
          .to.have.property('message');
        expect((error.response.body.message))
          .to.equal('Length of Genre is too short');
        done();
      });
  });
  it('should get all genres', (done) => {
    chai.request(app)
      .get(`/api/v1/books/genre`)
      .set('x-access-token', adminToken)
      .set('Accept', 'application/json')
      .end((error, response) => {
        expect(response.status).to.equal(200);
        expect((response.body)).to.have.property('genre');
        expect((response.body.genre[0]))
          .to.equal(genre.bookGenre.toUpperCase());
        done();
      });
  });
});
