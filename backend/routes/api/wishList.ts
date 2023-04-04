import express from "express";
import { Request, Response } from "express";

import authMiddleware from "../../middleware/auth";
import User, { IUser } from "../../models/User";

const wishListRouter = express.Router();

// @route   POST api/wishList
// @desc    Register user
// @access  Private
wishListRouter.post("/", authMiddleware, async (req: Request, res: Response) => {

    const { userId, bookId } = req.body;

    try {
        let user: IUser | null = await User.findById(userId);
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "User dosent exists" }] });
        }
        if (user.wishList.includes(bookId)) {
            return res
                .status(400)
                .json({ errors: [{ msg: "Book is already in your wish list" }] });
        }
        user.wishList.push(bookId);
        await user.save();
        res.json({ user });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   Delete api/wishList
// @desc    Register user
// @access  Private
wishListRouter.delete("/", authMiddleware, async (req: Request, res: Response) => {

    const { userId, bookId } = req.body;
    
    try {
        let user: IUser | null = await User.findById(userId);
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "User dosent exists" }] });
        }
        const tempWishList = user.wishList;
        const deleteIndex = tempWishList.findIndex((book: string) => book === bookId);
        if (deleteIndex > -1) {
            tempWishList.splice(deleteIndex, 1);
            user.wishList = tempWishList;
            await user.save();
            res.json({ user });
        } else {
            return res
                .status(400)
                .json({ errors: [{ msg: "The book is not in your wish list" }] });
        }        
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default wishListRouter;