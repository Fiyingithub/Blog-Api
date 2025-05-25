import { body, validationResult } from "express-validator";

export const createUserValidator = [
  body("firstname")
    .notEmpty()
    .withMessage("Firstname field is required")
    .isLength({ min: 3 })
    .withMessage("Firstname must be at least 3 character long"),
  body("lastname")
    .notEmpty()
    .withMessage("Firstname field is required")
    .isLength({ min: 3 })
    .withMessage("Firstname must be at least 3 character long"),
    body("emailAddress").notEmpty().withMessage("Email Address field is required").isEmail().withMessage("Enter a valid email"),
    body('password').notEmpty().withMessage('Password field is required')
];

export const createBlogValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title field is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 character long"),
  body("body")
    .notEmpty()
    .withMessage("Body field is required")
    .isLength({ min: 10 })
    .withMessage("Body must be at least 10 character long"),
];


export const validateError = (req, res, next)=>{
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
        return res.status(422).json({
            status: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
}
