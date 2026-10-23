import { body } from "express-validator";

export const registerValidation = [

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isStrongPassword({
      minLength: 8,
      maxLength: 30,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage("Password must be between 8 and 30 Characters, 1 Uppercase, 1 Symbol, and 1 Number"),
];  

export const updatePasswordValidation = [
  body("password")
    .isStrongPassword({
      minLength: 8,
      maxLength: 30,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage("Password must be between 8 and 30 Characters, 1 Uppercase, 1 Symbol, and 1 Number"),
];

export const emailValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
]