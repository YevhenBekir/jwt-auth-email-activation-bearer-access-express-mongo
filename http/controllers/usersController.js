import UsersService from "../services/usersService.js";

class UsersController {
    userService;

    constructor() {
        this.userService = new UsersService();
    }


    getUsers = async (req, res, next) => {
        try {
            const users = await this.userService.getUsers();

            return res.status(200).json({users});
        } catch (error) {
            next()
        }
    }
}

export default UsersController;