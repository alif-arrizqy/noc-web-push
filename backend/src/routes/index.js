const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.get("/files", controller.getListFiles);
  router.get("/files/:name", controller.download);
  router.delete("/files/:name", controller.remove);
  router.post("/push", controller.pushData);
  router.get('/getnojs', controller.getNoJS);

  app.use(router);
};

module.exports = routes;
