import {
  BadRequestError,
  errorHandler,
  NotFoundError,
} from "../../lib/error.js";
import Booking from "../../models/Booking.js";
import Service from "../../models/Service.js";

export async function allBooking(req, res) {
  try {
    const sort = req.query.sort;
    const isNewest = sort === "newest";

    const professionalServices = await Service.find(
      {
        professionalId: req.id,
      },
      {
        _id: 1,
      }
    );
    let findFilter = {
      serviceId: { $in: professionalServices.map((p) => p._id) },
    };
    if (req.query.status) {
      findFilter.status = req.query.status;
    }

    const bookings = await Booking.find(findFilter, undefined, {
      sort: {
        createdAt: isNewest ? -1 : 1,
      },
    });
    const totalBookings = await Booking.countDocuments(findFilter);

    res.json({
      message: "All bookings fetched",
      sort: isNewest ? "newest" : "oldest",
      total: totalBookings,
      data: bookings,
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
      _id: id,
    }).populate("serviceId");

    if (!booking) {
      throw new NotFoundError("Not Found");
    }

    if (booking.serviceId.professionalId.toString() !== req.id) {
      throw new BadRequestError("This is not your service");
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
        status: "PROFESSIONAL_CANCELLED",
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

export async function confirmBooking(req, res) {
  try {
    const id = req.params.id;

    const booking = await Booking.findOne({
      _id: id,
    }).populate("serviceId");

    if (!booking) {
      throw new NotFoundError("Not Found");
    }

    if (booking.serviceId.professionalId.toString() !== req.id) {
      throw new BadRequestError("This is not your service");
    }

    if (
      [
        "COMPLETED",
        "CUSTOMER_CANCELED",
        "PROFESSIONAL_CANCELLED",
        "CUSTOMER_CANCELED",
      ].includes(booking.status)
    ) {
      throw new BadRequestError("This booking  can not  be Confirmed");
    }

    const update = await Booking.findByIdAndUpdate(
      booking._id,
      {
        status: "CONFIRMED",
      },
      {
        new: true,
      }
    );

    res.json({
      message: "Booking Confirmed",
      data: update,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function completeBooking(req, res) {
  try {
    const id = req.params.id;

    const booking = await Booking.findOne({
      _id: id,
    }).populate("serviceId");

    if (!booking) {
      throw new NotFoundError("Not Found");
    }

    if (booking.serviceId.professionalId.toString() !== req.id) {
      throw new BadRequestError("This is not your service");
    }

    if (
      [
        "PENDING",
        "CUSTOMER_CANCELED",
        "PROFESSIONAL_CANCELLED",
        "CUSTOMER_CANCELED",
      ].includes(booking.status)
    ) {
      throw new BadRequestError("This booking  can not  be Completed");
    }

    const updated = await Booking.findByIdAndUpdate(
      booking._id,
      {
        status: "COMPLETED",
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );

    res.json({
      message: "Booking Completed",
      data: updated,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
