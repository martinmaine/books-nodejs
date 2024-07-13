import express from "express";
const router = express.Router();
import Book from "../models/books.models.js";

//Middleware
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      message: "El ID del libro no es válido",
    });
  }
  
  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        message: "El libro no fue encontrado",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  res.book = book;
  next();
};

// VER: Obtener los libros [GET]
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    console.log("Get All", books);
    if (books.length === 0) {
      //si no hay ningún book
      return res.status(204).json([]);
    }
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET POR ID

router.get('/:id', getBook, async (req, res) => {
  res.json(res.book);
})

// CREATE: Crear un nuevo libro [POST]
router.post("/", async (req, res) => {
  const { title, author, gender, publication_date } = req?.body;
  if (!title || !author || !gender || !publication_date) {
    return res.status(400).json({
      messege:
        "Los campos title, author, gender, publication_date son obligatorios",
    });
  }
  const book = new Book({
    title,
    author,
    gender,
    publication_date,
  });
  try {
    const newBook = await book.save();
    console.log(newBook);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({
      messege: err.message,
    });
  }
});

//Modificar [PUT]

router.put('/:id', getBook, async (req, res) => {
  try {
      const book = res.book
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.genre = req.body.genre || book.genre;
      book.publication_date = req.body.publication_date || book.publication_date;

      const updatedBook = await book.save()
      res.json(updatedBook)
  } catch (error) {
      res.status(400).json({
          message: error.message
      })
  }
})

//Modificaciones parciales [PATCH]
router.patch('/:id', getBook, async (req, res) => {

  if (!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date) {
      res.status(400).json({
          message: 'Al menos uno de estos campos debe ser enviado: Título, Autor, Género o fecha de publicación'
      })

  }

  try {
      const book = res.book
      book.title = req.body.title || book.title;
      book.author = req.body.author || book.author;
      book.genre = req.body.genre || book.genre;
      book.publication_date = req.body.publication_date || book.publication_date;

      const updatedBook = await book.save()
      res.json(updatedBook)
  } catch (error) {
      res.status(400).json({
          message: error.message
      })
  }
})

//Borrar parciales [DELETE]
router.delete('/:id', getBook, async (req, res) => {
  try {
      const book = res.book
      await book.deleteOne({
          _id: book._id
      });
      res.json({
          message: `El libro ${book.title} fue eliminado correctamente`
      })
  } catch (error) {
      res.status(500).json({
          message: error.message
      })
  }
})

export default router;