class User {
    static #user = null;
  
    static set user(newUser) {
      User.#user = newUser;
    }
  
    static get user() {
      return User.#user;
    }

    static getUserData = () => {
      if (!this.user) {
        this.user = JSON.parse(localStorage.getItem("userData"));
      }
      return this.user;
    }
    
  }
  
  export default User;
  