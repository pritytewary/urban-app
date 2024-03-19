import express from "express";
import registerCustomer from "./register.js";
import loginCustomer from "./login.js";
import { UnauthorizedError, errorHandler } from "../../lib/error.js";
import { verify } from "../../lib/jwt.js";
import {
  addBooking,
  allBooking,
  bookingById,
  cancelBooking,
  servicechangeBooking,
} from "./booking.js";
import { allService } from "./service.js";
import { bookingReview } from "../customer/review.js";

const router = express.Router();

function authMiddleware(req, res, next) {
  try {
    const token = req.headers.token;
    const user = verify(token);
    if (user.type !== "customer")
      throw new UnauthorizedError("This token is only for customer");
    req.id = user.id;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
}

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/services", allService);
router.post("/bookings", authMiddleware, addBooking);
router.get("/bookings", authMiddleware, allBooking);
router.get("/bookings/:id", authMiddleware, bookingById);
router.patch("/bookings/:id/cancel", authMiddleware, cancelBooking);
router.patch(
  "/bookings/:id/change-servicedate",
  authMiddleware,
  servicechangeBooking
);
router.post("/bookings/:id/review", authMiddleware, bookingReview);

export default router;
