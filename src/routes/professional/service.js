import {
  BadRequestError,
  NotFoundError,
  errorHandler,
} from "../../lib/error.js";
import Service from "../../models/Service.js";

export async function addService(req, res) {
  try {
    const body = req.body;

    if (!body.name || !body.description || !body.price || !body.category) {
      throw new BadRequestError("All fields are required");
    }
    const add = await Service.create({
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      professionalId: req.id,
    });

    res.json({
      message: "Service was added",
      data: add,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function allService(req, res) {
  try {
    const sort = req.query.sort;
    const isNewest = sort === "newest";

    const services = await Service.find(
      {
        professionalId: req.id,
      },
      undefined,
      {
        sort: {
          createdAt: isNewest ? -1 : 1,
        },
      }
    );

    const totalServices = await Service.countDocuments({
      professionalId: req.id,
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

export async function serviceById(req, res) {
  try {
    const id = req.params.id;

    const service = await Service.findOne({
      professionalId: req.id,
      _id: id,
    });
    if (!service) {
      throw new NotFoundError("Not Found");
    }
    res.json({
      message: "Service fetched",
      data: service,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function toggleService(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;

    if (typeof body.isPublished !== "boolean") {
      throw new BadRequestError("Invalid input");
    }

    const service = await Service.findOneAndUpdate(
      {
        professionalId: req.id,
        _id: id,
      },
      {
        isPublished: body.isPublished,
      },
      {
        new: true,
      }
    );

    if (!service) {
      throw new NotFoundError("Not Found");
    }

    res.json({
      message: "Service toggled",
      data: service,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}

export async function updateService(req, res) {
  try {
    const id = req.params.id;
    const body = req.body;
    if (!body.name || !body.description || !body.price || !body.category) {
      throw new BadRequestError("All fields are required");
    }
    const newService = await Service.findByIdAndUpdate(
      {
        professionalId: req.id,
        _id: id,
      },
      {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
      },
      {
        new: true,
      }
    );

    if (!newService) {
      throw new NotFoundError("Not Found data");
    }
    res.json({
      message: "Service update",
      data: newService,
    });
  } catch (error) {
    errorHandler(error, res);
  }
}
