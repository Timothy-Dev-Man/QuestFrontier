import { body } from "express-validator";

export const questDescriptionValidation = [
    body("newDescription")

        .trim()

        .isLength({ max: 300 })

        .withMessage("Quest description must not be greater than 300 characters")

];