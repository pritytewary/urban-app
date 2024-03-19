import { errorHandler } from "../../lib/error.js";
import Service from "../../models/Service.js";

export async function allService(req, res) {
  try {
    const sort = req.query.sort;
    const isNewest = sort === "newest";

    const services = await Service.find(
      {
        isPublished: true,
      },
      undefined,
      {
        sort: {
          createdAt: isNewest ? -1 : 1,
        },
      }
    ).populate("professionalId", {
      name: 1,
      email: 1,
    });

    const totalServices = await Service.countDocuments({
      isPublished: true,
    });

    res.json({
      message: "All service fetched",
      sort: isNewest ? "newest" : "oldest",
      total: totalServices,
      data: services,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
