import http from "../http-common";

class DeleteFilesService {
    delete(req) {
        return http.delete(`/files/${req}`);
    }
}

export default new DeleteFilesService();