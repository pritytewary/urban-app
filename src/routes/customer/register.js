import { BadRequestError, errorHandler } from "../../lib/error.js";
import Customer from "../../models/Customer.js";
import bcrypt from "bcryptjs";

export default async function registerCustomer(req, res) {
  try {
    const body = req.body;
    if (!body.email || !body.name || !body.password || !body.phoneNumber) {
      throw new BadRequestError("All fields are required");
    }

    const email = body.email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const isExists = await Customer.findOne({
      email: email,
    });
    if (isExists) {
      throw new BadRequestError("Customer already exists, please login");
    }

    const customer = await Customer.create({
      email: email,
      name: body.name,
      password: hashedPassword,
      phoneNumber: body.phoneNumber,
    });

    res.json({
      message: "Customer is created",
      data: customer,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
