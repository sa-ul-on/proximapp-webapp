import Vue from "vue";

export default class GatheringsWS {

    getPreparedGatherings(gatherings) {
        let gatheringsData = {};
        if (gatherings.length){
            gatherings.sort((a,b) => { return new Date(b.start) - new Date(a.start); });
            for (const gg of gatherings) {
                const date = new Date(gg.start);
                const dateStr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
                if (gatheringsData[dateStr] === undefined)
                    gatheringsData[dateStr] = [];
                gatheringsData[dateStr].push(gg);
            }
        }
        return gatheringsData;
    }

    async getAllGatherings(){
        let link="http://localhost:8080/api/find";
        let gatherings ="";
        await Vue.axios.get(link)
            .then((resp) => {
                gatherings = this.getPreparedGatherings(resp.data);
            })
            .catch(e => {
                console.error(e.toString());
                return false;
            })
        return gatherings;
    }

    async search(date_from, date_to, trackings, places) {
        let link = "http://localhost:8080/api/find?date_from="
            + date_from + "&date_to=" + date_to
            + "&trackings=" + trackings + "&places=" + places;
        let gatherings = "";
        await Vue.axios.get(link)
            .then((resp) => {
                if (resp.data.length) {
                    gatherings = "";
                    gatherings = this.getPreparedGatherings(resp.data);
                } else {
                    gatherings = "";
                }
            })
            .catch(e => {
                e;
                return false;
            });
        return gatherings;
    }

    async fillPersone(){
        let link="http://localhost:8080/trackings";
        let tracking_options=[];
        await Vue.axios.get(link)
            .then((resp) => {
                for (let p of resp.data){
                    tracking_options.push(
                        {
                            id: p.id,
                            label: p.nome+" "+p.cognome,
                        }
                    )
                }
            })
            .catch(e => {
                console.error(e.toString());
                return false;
            })
        return tracking_options;
    }

    async fillStanze(){
        let link="http://localhost:8080/places";
        let places_options=[];
        await Vue.axios.get(link)
            .then((resp) => {
                for (let p of resp.data){
                    places_options.push(
                        {
                            id: p.id,
                            label: p.name,
                        }
                    )
                }
            })
            .catch(e => {
                console.error(e.toString());
                return false;
            })
        return places_options;
    }
}