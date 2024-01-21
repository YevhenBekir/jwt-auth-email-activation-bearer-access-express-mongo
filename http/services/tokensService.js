import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import Tokens from "../models/tokensModel.js";
import ApiError from "../exceptions/apiErrorException.js";

dotenv.config();

class TokensService {
    JWT_ACCESS_SECRET;
    JWT_REFRESH_SECRET;

    constructor() {
        this.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
        this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
    }

    findRefreshToken = async (refreshToken) => {
        const token = await Tokens.findOne({refresh_token: refreshToken});

        return token;
    }

    generateTokens = async (payload) => {
        try {
            const accessToken = await jwt.sign(payload, this.JWT_ACCESS_SECRET, {
                expiresIn: '1h'
            });
            const refreshToken = await jwt.sign(payload, this.JWT_REFRESH_SECRET, {
                expiresIn: '30d'
            });

            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            return ApiError.BadRequestError(error.message);
        }
    }

    updateOrCreateUserToken = async (userId, refreshToken) => {
        const isUserExist = await Tokens.findOne({user: userId});
        if (isUserExist) {
            isUserExist.refresh_token = refreshToken;
            await isUserExist.save();

            return isUserExist;
        }

        const token = await new Tokens({user: userId, refresh_token: refreshToken});
        await token.save();

        return token;
    }

    validateAccessToken = async (token) => {
        try {
            const userInfo = await jwt.verify(token, this.JWT_ACCESS_SECRET);

            return userInfo
        } catch (error) {
            return false;
        }
    };

    validateRefreshToken = async (token) => {
        try {
            const userInfo = await jwt.verify(token, this.JWT_REFRESH_SECRET);

            return userInfo
        } catch (error) {
            return false;
        }
    };

    deleteToken = async (refreshToken) => {
        const result = await Tokens.deleteOne({refresh_token: refreshToken});

        return result;
    }
}

export default TokensService;