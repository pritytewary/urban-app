import {
  BadRequestError,
  errorHandler,
  NotFoundError,
} from "../../lib/error.js";

import Review from "../../models/Review.js";
import Booking from "../../models/Booking.js";

export async function bookingReview(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    const booking = await Booking.findOne({
      customerId: req.id,
      _id: id,
    });
    if (!booking) {
      throw new NotFoundError("Not Found");
    }

    if ("!COMPLETED".includes(booking.status)) {
      throw new BadRequestError(" You Can not write a Review");
    }
    const review = await Review.create({
      comment: body.comment,
      rating: body.rating,
      bookingId: booking._id,
    });
    res.json({
      message: "Review Added",
      data: review,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
