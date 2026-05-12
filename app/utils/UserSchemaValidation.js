const Joi = require("joi");

const StatusCode = require("./StatusCode");

const UserSchemaValidation = Joi.object({
  //name validation
  name: Joi.string().min(5).max(30).required(),

  //email validation
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "in"] },
    })
    .required(),

  //password valiation
  password: Joi.string()
    .min(4)
    .max(6)
    .pattern(/(?=.*[a-z])/, "lowercase")
    .pattern(/(?=.*[A-Z])/, "uppercase")
    .pattern(/(?=.*[0-9])/, "number")
    .pattern(/(?=.*[!@#$%^&*])/, "special character")
    .required(),

  //about validation
  about: Joi.string().min(4).max(100).required(),
});

const validateRegister = (req, res, next) => {
  const { error, value } = UserSchemaValidation.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(StatusCode.BAD_REQUEST).json({
      success: false,
      message: error.details[0].message,
    });
  }

  req.body = value;

  next();
};

module.exports = validateRegister;
