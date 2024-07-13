import express from 'express';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bookRoutes from './routes/book.routes.js';

config()


//Usamos express para los middlewares
const app = express();
app.use(bodyParser.json()); // Parseador de bodys

// Conectamos la base de datos
mongoose.connect(process.env.MONGO_URL, {dbName:  process.env.MONGO_DB_NAME})
const db = mongoose.connection;

app.use('/books', bookRoutes);

const port= process.env.PORT || 8000;


app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})