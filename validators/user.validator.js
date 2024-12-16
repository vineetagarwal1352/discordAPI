const Joi = require("joi");
const logger = require("../utils/logger");

/**
 * Validate the user signup data
 */
exports.validateSignup = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
      "string.base": "Username should be a string.",
      "string.empty": "Username cannot be empty.",
      "string.min": "Username should have a minimum length of 3 characters.",
      "string.max": "Username should have a maximum length of 30 characters.",
      "any.required": "Username is required.",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email should be a string.",
      "string.empty": "Email cannot be empty.",
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.base": "Password should be a string.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password should have a minimum length of 6 characters.",
      "any.required": "Password is required.",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.error(`Signup validation error: ${error.details[0].message}`);
    return res
      .status(400)
      .json({ message: "Validation error", error: error.details[0].message });
  }

  next();
};

/**
 * Validate the user login data
 */
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "Email should be a string.",
      "string.empty": "Email cannot be empty.",
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.base": "Password should be a string.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password should have a minimum length of 6 characters.",
      "any.required": "Password is required.",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.error(`Login validation error: ${error.details[0].message}`);
    return res
      .status(400)
      .json({ message: "Validation error", error: error.details[0].message });
  }

  next();
};

/**
 * Validate the password update data
 */
exports.validateUpdatePassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required().messages({
      "string.base": "Password should be a string.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password should have a minimum length of 6 characters.",
      "any.required": "Password is required.",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    logger.error(
      `Password update validation error: ${error.details[0].message}`
    );
    return res
      .status(400)
      .json({ message: "Validation error", error: error.details[0].message });
  }

  next();
};
