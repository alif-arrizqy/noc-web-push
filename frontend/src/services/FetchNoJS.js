import http from "../http-common";

class FetchNoJsService {
    fetchNoJs() {
        return http.get("/getnojs");
    }
}

export default new FetchNoJsService();
