import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

import connectDB from "./config/db";

import usersRouter from './routes/api/users';
import booksRouter from './routes/api/books';
import wishListRouter from './routes/api/wishList';

dotenv.config();

const app: Application = express();

// connect database
connectDB();

// init middlware
app.use(express.json());

app.use(function (req: Request, res: Response, next: NextFunction) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
	next();
});

// define routes
app.use('/api/users', usersRouter);
app.use('/api/books', booksRouter);
app.use('/api/wishList', wishListRouter);

const PORT: string | number = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log("server listening on port: ", PORT);
});