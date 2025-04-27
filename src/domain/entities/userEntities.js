class User {
    constructor({_id, name, email, password, createdAt = new Date()}){
        this._id = _id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }
    toJson(){
        return {
            _id: this._id,
            name: this.name,
            email: this.email,
            password: this.password,
            createdAt: this.createdAt
        }
    }
}

module.exports = User;