import {
  BadRequestError,
  NotFoundError,
  errorHandler,
} from "../../lib/error.js";
import { sign } from "../../lib/jwt.js";
import Customer from "../../models/Customer.js";
import bcrypt from "bcryptjs";

export default async function loginCustomer(req, res) {
  try {
    const body = req.body;
    if (!body.email || !body.password) {
      throw new BadRequestError("All fields are required");
    }

    const email = body.email.toLowerCase().trim();

    const customer = await Customer.findOne({
      email: email,
    });
    if (!customer) {
      throw new NotFoundError("Customer not found");
    }

    const isSame = await bcrypt.compare(body.password, customer.password);
    if (!isSame) {
      throw new BadRequestError("Wrong password provided");
    }

    const signedToken = sign(
      {
        type: "customer",
        id: customer._id,
      },
      60 * 60 * 24
    );

    res.json({
      message: "Successfully logged in",
      data: signedToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
