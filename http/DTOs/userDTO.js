export default class UserDTO {
    id;
    email;
    name;
    is_activated;
    activation_link;

    constructor(user) {
        this.id = user._id;
        this.email = user.email;
        this.name = user.name;
        this.is_activated = user.is_activated;
        this.activation_link = user.activation_link;
    }
}