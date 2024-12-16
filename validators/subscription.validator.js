const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Validate subscription creation data
 */
exports.validateSubscription = (req, res, next) => {
    const schema = Joi.object({
        serviceName: Joi.string().required().messages({
            'string.base': 'Service Name should be a string.',
            'any.required': 'Service Name is required.'
        }),
        serviceLink: Joi.string().uri().required().messages({
            'string.base': 'Service Link should be a string.',
            'string.uri': 'Service Link should be a valid URL.',
            'any.required': 'Service Link is required.'
        }),
        monthlyFee: Joi.number().required().messages({
            'number.base': 'Monthly Fee should be a number.',
            'any.required': 'Monthly Fee is required.'
        }),
        startDate: Joi.date().required().messages({
            'date.base': 'Start Date should be a valid date.',
            'any.required': 'Start Date is required.'
        }),
        userID: Joi.string().required().messages({
            'string.base': 'User ID should be a string.',
            'any.required': 'User ID is required.'
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        logger.error(`Validation error: ${error.message}`);
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

/**
 * Validate update subscription data
 */
exports.validateUpdateSubscription = (req, res, next) => {
    const schema = Joi.object({
        serviceName: Joi.string(),
        serviceLink: Joi.string().uri(),
        monthlyFee: Joi.number(),
        startDate: Joi.date(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        logger.error(`Validation error: ${error.message}`);
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};
