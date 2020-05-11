const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// async handler middleware
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

// Shows the full list of books
router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('index', {books});
}));

// Shows the create new book form
router.get('/new', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('new-book', {books});
}));

// Posts a new book to the database
router.post('/new', asyncHandler(async (req, res) => {
  try {
    let book = await Book.create(req.body);
    res.redirect('/books/');
  } catch (error) {
    if(error.name === "SequelizeValidationError") { 
      console.log(error.errors);
      res.render("new-book", { errors: error.errors });
    } else {
      throw error;
    }
  }
}));

// Shows book detail form
router.get('/:id', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', {book, title: book.title});
  } else {
    res.render('error');
  }
}));

// Updates book info in the database
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books');
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.findByPk(req.params.id);
      
      console.log(error.errors);
      res.render("update-book", {book, errors: error.errors, title: book.title});
    } else {
      throw error;
    }
  }
}));

// Deletes a book
router.post('/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    res.render('error');
  }
}));

module.exports = router;
