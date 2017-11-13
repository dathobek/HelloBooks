'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllers = require('../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

var _middleware = require('../middleware/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _borrowBook = require('../middleware/borrowBook');

var _borrowBook2 = _interopRequireDefault(_borrowBook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userController = _controllers2.default.users;
var borrowBookControllers = _controllers2.default.borrowBook;
var router = _express2.default.Router();
//  sign up user
router.post('/users/signup', userController.create);
//  signin user
router.post('/users/signin', userController.signin);
// update user upon confirmation
router.put('/confimation/:key', userController.updateUser);
//  api route to allow user borrow book
router.post('/users/:userId/:bookId/books', _middleware2.default.checkAuthentication, _middleware2.default.authorizeUser, _borrowBook2.default.checkStar, _borrowBook2.default.checkDebt, borrowBookControllers.borrow);
// get list of borrowed books but not returned
router.get('/users/:userId/books', _middleware2.default.checkAuthentication, _middleware2.default.authorizeUser, borrowBookControllers.getBorrowedBooks);
// get list borrowed books, both borrowed and returned
router.get('/users/:userId/books/all-borrowed', _middleware2.default.checkAuthentication, _middleware2.default.authorizeUser, borrowBookControllers.getAllBorrowedBooks);
// pay back debt
router.put('/users/:userId/:bookId/book/payback', _middleware2.default.checkAuthentication, _middleware2.default.authorizeUser, borrowBookControllers.payBack);
// api route to allow user return a book;
router.put('/users/:userId/:bookId/books', _middleware2.default.checkAuthentication, _middleware2.default.authorizeUser, borrowBookControllers.returnBook);
// Api to set password
router.put('/users/setPassword/:id', _middleware2.default.checkAuthentication, _middleware2.default.authorizeUser, userController.setPassword);
// update usernamne
router.put('/users/updateUser/:id', _middleware2.default.checkAuthentication, _middleware2.default.authorizeUser, userController.updateName);

exports.default = router;