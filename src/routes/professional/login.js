import {
  BadRequestError,
  NotFoundError,
  errorHandler,
} from "../../lib/error.js";
import { sign } from "../../lib/jwt.js";

import bcrypt from "bcryptjs";
import Professional from "../../models/Professional.js";

export default async function loginProfessional(req, res) {
  try {
    const body = req.body;
    if (!body.email || !body.password) {
      throw new BadRequestError("All fields are required");
    }

    const email = body.email.toLowerCase().trim();

    const professional = await Professional.findOne({
      email: email,
    });
    if (!professional) {
      throw new NotFoundError("Professional not found");
    }

    const isSame = await bcrypt.compare(body.password, professional.password);
    if (!isSame) {
      throw new BadRequestError("Wrong password provided");
    }

    const signedToken = sign(
      {
        type: "professional",
        id: professional._id,
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
