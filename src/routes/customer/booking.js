import {
  BadRequestError,
  errorHandler,
  NotFoundError,
} from "../../lib/error.js";
import Booking from "../../models/Booking.js";
import Service from "../../models/Service.js";

export async function addBooking(req, res, _id) {
  try {
    const body = req.body;

    if (
      !body.serviceDate ||
      !body.bookingDate ||
      !body.collectedAmount ||
      !body.serviceId
    ) {
      throw new BadRequestError("All fields are required");
    }

    const isExists = Service.findOne({ _id });
    if (!isExists) {
      throw new NotFoundError("Service is not found");
    }

    const add = await Booking.create({
      serviceDate: body.serviceDate,
      bookingDate: body.bookingDate,
      customerId: req.id,
      serviceId: body.serviceId,
      collectedAmount: body.collectedAmount,
    });

    res.json({
      message: "Booking added",
      data: add,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function allBooking(req, res) {
  try {
    const sort = req.query.sort;
    const isNewest = sort === "newest";

    const bookings = await Booking.find(
      {
        customerId: req.id,
      },
      undefined,
      {
        sort: {
          createdAt: isNewest ? -1 : 1,
        },
      }
    );
    const totalBookings = await Booking.countDocuments({
      customerId: req.id,
    });

    res.json({
      message: "All service fetched",
      sort: isNewest ? "newest" : "oldest",
      total: totalBookings,
      data: bookings,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function bookingById(req, res) {
  try {
    const id = req.params.id;

    const booking = await Booking.findOne({
      customerId: req.id,
      _id: id,
    });
    if (!booking) {
      throw new NotFoundError("Not Found");
    }
    res.json({
      message: "Service fetched",
      data: booking,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function cancelBooking(req, res) {
  try {
    const id = req.params.id;

    const body = req.body;
    if (!body.cancellationReason)
      throw new BadRequestError("Please provide a cancellation reason");

    const booking = await Booking.findOne({
      customerId: req.id,
      _id: id,
    });
    if (!booking) {
      throw new NotFoundError("Not Found");
    }
    if (
      ["COMPLETED", "CUSTOMER_CANCELED", "PROFESSIONAL_CANCELLED"].includes(
        booking.status
      )
    ) {
      throw new BadRequestError("This booking can't be cancelled");
    }

    const updated = await Booking.findByIdAndUpdate(
      booking._id,
      {
        status: "CUSTOMER_CANCELED",
        note: body.cancellationReason,
      },
      {
        new: true,
      }
    );

    res.json({
      message: "Booking cancelled",
      data: updated,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function servicechangeBooking(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    if (!body.datechangeReason)
      throw new BadRequestError("Please provide a date change reason");

    const booking = await Booking.findOne({
      customerId: req.id,
      _id: id,
    });
    if (!booking) {
      throw new NotFoundError("Not Found");
    }
    if (booking.status !== "PENDING") {
      throw new BadRequestError("This booking can't be date change");
    }

    const updateServiceDate = await Booking.findByIdAndUpdate(
      booking._id,
      {
        status: "CONFIRMED",
        serviceDate: body.serviceDate,
        note: body.datechangeReason,
      },
      {
        new: true,
      }
    );

    res.json({
      message: "Booking date Updated",
      data: updateServiceDate,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
