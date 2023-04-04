import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface RequestWithUser extends Request {
  	user?: any;
}

const authMiddleware = (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const token = req.header("x-auth-token");

	if (!token) {
		return res.status(401).json({ msg: "No token, authorization failed" });
	}

	try {
		const decoded = jwt.verify(token, process.env.jwtToken) as { user: any };
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};

export default authMiddleware;