import express, { Request, Response } from "express";
import axios from "axios";
import config from "config";

import authMiddleware from "../../middleware/auth";

const booksRouter = express.Router();

// @route   GET api/books
// @desc    get all fiction books
// @access  Private

booksRouter.get("/:pageIndex", authMiddleware, async (req: Request, res: Response) => {
	try {
        const { pageIndex } = req.params;
        const startIndex = (parseInt(pageIndex) - 1) * 20;
        let url = `${config.get("googleBooksUrl")}?q=subject:fiction&startIndex=${startIndex}&maxResults=${config.get("maxBooksPerCall")}`;

        let response = await axios.get(url);
        let books = response.data;

        res.json(books);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});


// @route   GET api/books
// @desc    get all books by title search term
// @access  Private

booksRouter.get("/:pageIndex/titleSearch/:titleSearchTerm", authMiddleware, async (req: Request, res: Response) => {
	try {
        const { pageIndex, titleSearchTerm } = req.params;
        const startIndex = (parseInt(pageIndex) - 1) * 20;

        let url = `${config.get("googleBooksUrl")}?q==intitle:${titleSearchTerm}&startIndex=${startIndex}&maxResults=${config.get("maxBooksPerCall")}`;

        let response = await axios.get(url);
        let books = response.data;

        res.json(books);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});


// @route   GET api/books
// @desc    get book by id
// @access  Private

booksRouter.get("/bookId/:id", authMiddleware, async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		let url = `${config.get("googleBooksUrl")}/${id}`;

		let response = await axios.get(url);
		let books = response.data;

		res.json(books);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

export default booksRouter;