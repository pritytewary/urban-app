import express from "express";
import registerProfessional from "./register.js";
import { UnauthorizedError, errorHandler } from "../../lib/error.js";
import { verify } from "../../lib/jwt.js";
import loginProfessional from "./login.js";
import {
  addService,
  allService,
  serviceById,
  toggleService,
  updateService,
} from "./service.js";
import {
  allBooking,
  cancelBooking,
  confirmBooking,
  completeBooking,
} from "./booking.js";

const router = express.Router();

function authMiddleware(req, res, next) {
  try {
    const token = req.headers.token;
    const user = verify(token);
    if (user.type !== "professional")
      throw new UnauthorizedError("This token is only for professional");

    req.id = user.id;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
}

router.post("/register", registerProfessional);
router.post("/login", loginProfessional);
router.post("/service", authMiddleware, addService);
router.get("/service", authMiddleware, allService);
router.get("/service/:id", authMiddleware, serviceById);
router.patch("/service/:id/toggle", authMiddleware, toggleService);
router.patch("/service/:id/update", authMiddleware, updateService);
router.get("/bookings", authMiddleware, allBooking);
router.patch("/bookings/:id/cancel", authMiddleware, cancelBooking);
router.patch("/bookings/:id/confirm", authMiddleware, confirmBooking);
router.patch("/bookings/:id/complete", authMiddleware, completeBooking);

export default router;
