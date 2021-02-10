import Vue from "vue";

export default class WorktimeWS {
    async getAllWorktimes() {
        let link = "http://localhost:8080/worktimes/1/query";
        let worktimes = "";
        await Vue.axios.get(link)
            .then((resp) => {
                worktimes = this.getPreparedWorktimes(resp.data);
            })
            .catch(e => {
                console.error(e.toString());
                return false;
            })
        return worktimes;
    }

    async search(company, userIds, date_from) {

        if(date_from)
            date_from+=' 00:00:00'
        let link = "http://localhost:8080/worktimes/"+company+"/query?user_ids="+userIds+"&date_from="
            + date_from;
        console.log(link)
        let worktimes = "";
        await Vue.axios.get(link)
            .then((resp) => {
                if (resp.data.length) {
                    worktimes = "";
                    worktimes = this.getPreparedWorktimes(resp.data);
                } else {
                    worktimes = "";
                }
            })
            .catch(e => {
                e;
                return false;
            });
        return worktimes;
    }

    getPreparedWorktimes(worktimes) {
        let preparedWorktimes = [];
        if (worktimes.length) {
            worktimes.sort((a, b) => {
                return new Date(b.dateFrom) - new Date(a.dateFrom);
            });
            let actualDateAndUser = "";
            for (const wt of worktimes) {
                const jsDate = new Date(wt.dateFrom);
                const month = jsDate.getMonth() + 1; //months from 1-12
                const day = jsDate.getDate();
                const year = jsDate.getFullYear();
                const date = year + "/" + month + "/" + day;
                if ((date != actualDateAndUser) ) {
                    preparedWorktimes.push({
                        "idUser": wt.userId,
                        "date": date,
                        "details": [
                            {
                                "dateFrom": wt.dateFrom,
                                "dateTo": wt.dateTo
                            }
                        ]
                    });
                }else {
                    for(const preparedWorktime of preparedWorktimes){
                        const pwId = preparedWorktime["date"]+"/"+preparedWorktime["idUser"];
                        if(pwId==date+"/"+wt.userId){
                            preparedWorktime.details.push({
                                "dateFrom": wt.dateFrom,
                                "dateTo": wt.dateTo
                            })
                        }
                    }
                }
                actualDateAndUser = date;
            }
        }
        return preparedWorktimes;
    }
}