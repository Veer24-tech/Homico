const joi = require('joi');
module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.object({
            url:joi.string().allow("", null),
            filename:joi.string().allow("",null),
    }).optional(),
 }).required(),                        // joi objext me jab bhi req aaye to use me listing object honi hi honi chiaye
});