import express, { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { check, validationResult } from "express-validator";

import authMiddleware from "../../middleware/auth";
import User, { IUser } from "../../models/User";

dotenv.config();

const usersRouter: Router = express.Router();

// @route   GET api/users
// @desc    auth user
// @access  Public
usersRouter.get("/auth", authMiddleware, async (req: any, res: Response) => {
    try {
		const user: IUser | null = await User.findById(req.user.id);
		res.json(user);
    } catch (err: any) {
		console.error(err.message);
		res.status(500).send("Server error");
    }
  }
);

// @route   GET api/users
// @desc    get user by userName, if userName dosent exist create new user
// @access  Public
usersRouter.get(
	"/:userName",
	[
		check("userName")
		.isLength({ min: 2, max: 20 })
		.withMessage("User name must be between 2 to 20 characters"),
	],
	async (req: Request, res: Response) => {
		const validationError = validationResult(req);
		if (!validationError.isEmpty()) {
			return res.status(400).json({ errors: validationError.array() });
		}

		try {
			const { userName } = req.params;
			let user: IUser | null = await User.findOne({ userName });

			if (!user) {
				user = new User({ userName });
				await user.save();
			}
			const payload = { user: { id: user.id } };

			jwt.sign(
				payload,
				process.env.jwtToken,
				{ expiresIn: 360000 },
				(err: Error | null, token: any) => {
				if (err) throw err;
				res.json({ token, user });
				}
			);
		} catch (err: any) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

export default usersRouter;