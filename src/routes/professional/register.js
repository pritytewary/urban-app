import { BadRequestError, errorHandler } from "../../lib/error.js";
import Professional from "../../models/Professional.js";

import bcrypt from "bcryptjs";

export default async function registerProfessional(req, res) {
  try {
    const body = req.body;
    if (
      !body.email ||
      !body.name ||
      !body.password ||
      !body.phoneNumber ||
      !body.skill
    ) {
      throw new BadRequestError("All fields are required");
    }

    const email = body.email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const isExists = await Professional.findOne({
      email: email,
    });
    if (isExists) {
      throw new BadRequestError("Professional already exists, please login");
    }

    const professional = await Professional.create({
      email: email,
      name: body.name,
      password: hashedPassword,
      phoneNumber: body.phoneNumber,
      skill: body.skill,
    });

    res.json({
      message: "Professional is created",
      data: professional,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
