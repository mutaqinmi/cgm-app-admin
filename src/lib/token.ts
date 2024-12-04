import jwt from "jsonwebtoken";

/**
 * This method is for generating token using JWT
 */

export function generateToken(payload: object){
    return jwt.sign(payload, process.env.JWT_SECRET_KEY as string);
}