import {validationResult} from "express-validator";

import AuthService from "../services/authService.js";
import MailService from "../services/mailService.js";

import {calculateDaysInMilliseconds} from "../helpers/helper.js";

import ApiError from "../exceptions/apiErrorException.js";

const API_URL = process.env.API_URL;
const WEB_URL = process.env.WEB_URL;

class AuthController {
    authService;
    mailService;

    constructor() {
        this.authService = new AuthService();
        this.mailService = new MailService();
    }

    register = async (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return next(ApiError.ValidationError(validationErrors.array()));
        }

        try {
            const {email, password, name} = req.body;

            const {user, userToken} = await this.authService.register(email, name, password);
            const userActivationLink = `${API_URL}/auth/activate/${user.activation_link}`;

            await this.mailService.sendActivationMessage(user.email, userActivationLink);

            const refreshTokenDaysValidity = calculateDaysInMilliseconds(30);
            res.cookie("refreshToken", userToken.refreshToken, {
                maxAge: refreshTokenDaysValidity,
                httpOnly: true,
                // secure: true         For HTTPS
            });

            return res.status(200).json({
                message: `Welcome ${user.name}. Registration was successful !`,
                tokens: userToken
            });
        } catch (error) {
            next(error);
        }
    }

    login = async (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return next(ApiError.ValidationError(validationErrors.array()));
        }

        try {
            const {email, password} = req.body;

            const {user, userToken} = await this.authService.login(email, password);

            const refreshTokenDaysValidity = calculateDaysInMilliseconds(30);
            res.cookie("refreshToken", userToken.refreshToken, {
                maxAge: refreshTokenDaysValidity,
                httpOnly: true,
                // secure: true         For HTTPS
            });
            return res.status(200).json({message: `${user.name}, you're successfully logged in !`, tokens: userToken});
        } catch (error) {
            next(error);
        }
    }

    logout = async (req, res, next) => {
        try {
            const {refreshToken} = req.cookies;

            await this.authService.logout(refreshToken);
            res.clearCookie("refreshToken");

            res.status(200).json({message: "You are logged out of your account !"});
        } catch (error) {
            next(error);
        }
    }

    activate = async (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return next(ApiError.ValidationError(validationErrors.array()));
        }

        try {
            const userActivationLink = req.params.link;

            const user = await this.authService.activate(userActivationLink);

            // return res.redirect(WEB_URL);
            return res.status(200).json({message: `Congratulations, ${user.name}, your account has been activated !`});
        } catch (error) {
            next(error);
        }
    }

    refresh = async (req, res, next) => {
        try {
            const {refreshToken} = req.cookies;

            const {user, userToken} = await this.authService.refresh(refreshToken);

            const refreshTokenDaysValidity = calculateDaysInMilliseconds(30);
            res.cookie("refreshToken", userToken.refreshToken, {
                maxAge: refreshTokenDaysValidity,
                httpOnly: true,
                // secure: true         For HTTPS
            });

            return res.status(200).json({message: "The token has been successfully updated !", tokens: userToken});
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;