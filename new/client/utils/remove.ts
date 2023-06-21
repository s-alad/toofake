function remove() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("uid");
    localStorage.removeItem("is_new_user");
    localStorage.removeItem("token_type");
    localStorage.removeItem("myself")
}