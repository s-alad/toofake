export function logout(router: any, ls: any) {
    



        function removeStorage() {
            ls.removeItem("token");
            ls.removeItem("refresh_token");
            ls.removeItem("expiration");
            ls.removeItem("uid");
            ls.removeItem("is_new_user");
            ls.removeItem("token_type");
            ls.removeItem("myself")
        }

        removeStorage();
        router.push("/");

}