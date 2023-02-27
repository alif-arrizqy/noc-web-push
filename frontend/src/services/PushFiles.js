import http from "../http-common";

class PushFilesService {
    push(req) {
        const body = {
            filename: req.filename,
            nojs: req.nojs
        }
        return http.post("/push", body);
    }
}

export default new PushFilesService();