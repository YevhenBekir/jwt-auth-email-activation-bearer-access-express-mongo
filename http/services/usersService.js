import Users from "../models/usersModel.js";

import UserDTO from "../DTOs/userDTO.js";

class UsersService {
    getUsers = async () => {
        const users = await Users.find();
        const usersDTO = users.map(user => new UserDTO(user));

        return usersDTO;
    }
}

export default UsersService;