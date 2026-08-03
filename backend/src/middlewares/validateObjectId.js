import mongoose from "mongoose";

// Guards routes with an :id-style param before hitting the DB.
const validateObjectId = (paramName = "id") => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    res.status(400);
    return next(new Error(`Invalid id: ${req.params[paramName]}`));
  }
  next();
};

export default validateObjectId;
