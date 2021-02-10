import Vue from "vue";

export default class UserWS {
    async getUserById(companyId, userId) {
        let link = "http://localhost:3000/users/"+companyId+"/"+userId;
        let user = {};
        await Vue.axios.get(link)
            .then((resp) => {
                user = resp.data;
            })
            .catch(e => {
                console.error(e.toString());
                return false;
            })

        return user;
    }
}