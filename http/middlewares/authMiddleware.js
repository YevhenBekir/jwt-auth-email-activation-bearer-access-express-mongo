import ApiError from "../exceptions/apiErrorException.js";
import TokensService from "../services/tokensService.js";

export default async (req, res, next) => {
    const tokenService = new TokensService();

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userDataFromToken = await tokenService.validateAccessToken(accessToken);
        if (!userDataFromToken) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userDataFromToken;
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
}