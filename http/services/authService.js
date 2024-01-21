import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";

import Users from "../models/usersModel.js";

import UserDTO from "../DTOs/userDTO.js";

import TokensService from "./tokensService.js";

import ApiError from "../exceptions/apiErrorException.js";

class AuthService {
    tokensService;

    constructor() {
        this.tokensService = new TokensService();
    }

    register = async (email, name, password) => {
        const isUserExist = await Users.findOne({email});
        if (isUserExist) {
            throw ApiError.BadRequestError(`A user with email ${email} already exists !`);
        }

        const hashedPassword = await bcrypt.hash(password, 3);
        const activationLink = uuidv4();

        const user = await new Users({
            email,
            name,
            password: hashedPassword,
            is_activated: false,
            activation_link: activationLink
        });
        await user.save();

        const userDTO = new UserDTO(user);

        const tokens = await this.tokensService.generateTokens({...userDTO});
        await this.tokensService.updateOrCreateUserToken(userDTO.id, tokens.refreshToken);

        return {
            user: userDTO,
            userToken: tokens
        };
    }

    login = async (email, password) => {
        const user = await Users.findOne({email});
        if (!user) {
            throw ApiError.BadRequestError(`User not found with email - ${email} !`);
        }

        const passwordsAreSimilar = await bcrypt.compare(password, user.password);
        if (!passwordsAreSimilar) {
            throw ApiError.BadRequestError("Wrong password !");
        }

        const userDTO = new UserDTO(user);
        const tokens = await this.tokensService.generateTokens({...userDTO});
        await this.tokensService.updateOrCreateUserToken(userDTO.id, tokens.refreshToken);

        return {
            user: userDTO,
            userToken: tokens
        }
    }

    logout = async (refreshToken) => {
        const result = await this.tokensService.deleteToken(refreshToken);

        return result;
    }

    activate = async (userActivationLink) => {
        const user = await Users.findOne({activation_link: userActivationLink});
        if (!user) {
            throw ApiError.BadRequestError("User not found in the system !");
        }
        if (user.is_activated) {
            throw ApiError.BadRequestError("The user is already activated !");
        }

        user.is_activated = true;
        await user.save();

        const userDTO = new UserDTO(user);

        return userDTO;
    }

    refresh = async (refreshToken) => {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userDataFromToken = await this.tokensService.validateRefreshToken(refreshToken);
        const isActiveToken = await this.tokensService.findRefreshToken(refreshToken);
        if (!userDataFromToken || !isActiveToken) {
            throw ApiError.UnauthorizedError();
        }

        const user = await Users.findById(userDataFromToken.id);

        const userDTO = new UserDTO(user);

        const tokens = await this.tokensService.generateTokens({...userDTO});
        await this.tokensService.updateOrCreateUserToken(userDTO.id, tokens.refreshToken);

        return {
            user: userDTO,
            userToken: tokens,
        };
    }
}

export default AuthService;