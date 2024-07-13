import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    gender: String,  // Asegúrate de que esto esté correctamente como "gender" si te refieres a "género"
    publication_date: String,
  });
  
  const Book = mongoose.model('Book', bookSchema);
  
  export default Book;