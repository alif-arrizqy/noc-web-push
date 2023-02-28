const uploadFile = require("../middleware/upload");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");
const env = dotenv.config().parsed;
const {nojsUserModel} = require("../../models");

// const baseUrl = "http://localhost:8080/files/";
const baseUrl = env.BASE_URL;
const APT2_URL = env.APT2_URL;

const getNoJS = async (req, res) => {
  try {
    const ResultNoJS = await nojsUserModel.findAll();
    return res.status(200).json({
      status: "success",
      msg: "Data Berhasil Di GET",
      jumlah_data: ResultNoJS.length,
      data: ResultNoJS,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      msg: "Data Gagal Di GET",
    });
  }
};

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const pushData = async (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  const url = APT2_URL;
  const filename = req.body.filename;
  const nojs = req.body.nojs;

  fs.readFile(directoryPath + filename, "utf8", async (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ status: false, message: "Unable to scan files!" });
    }

    const datas = [];
    const json = JSON.parse(data);
    json.forEach((item) => {
      datas.push(item);
    });

    const body = {
      status: "success",
      nojs: nojs,
      data: datas,
    };
    // axios interceptors
    axios.interceptors.request.use((x) => {
      // to avoid overwriting if another interceptor
      // already defined the same object (meta)
      x.meta = x.meta || {};
      x.meta.requestStartedAt = new Date().getTime();
      return x;
    });

    axios.interceptors.response.use(
      (x) => {
        const millis = new Date().getTime() - x.config.meta.requestStartedAt;
        const timeResponse = new Date(millis);
        const time = `${timeResponse.getMinutes()} m ${timeResponse.getSeconds()} s`;
        console.error(`Execution time for: ${x.config.url} - ${time}`);
        return x;
      },
      // Handle 4xx & 5xx responses
      (x) => {
        const millis = new Date().getTime() - x.config.meta.requestStartedAt;
        const timeResponse = new Date(millis);
        const time = `${timeResponse.getMinutes()} m ${timeResponse.getSeconds()} s`;
        console.error(`Execution time for: ${x.config.url} - ${time}`);
        throw x;
      }
    );

    // axios config
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // axios post
    const mills = new Date().getTime()
    await axios
      .post(url, body, config, config, { timeout: 100000 })
      .then((response) => {
        const finishTime = new Date().getTime() - mills
        const timeResponse = new Date(finishTime);
        const duration = `${timeResponse.getMinutes()} m ${timeResponse.getSeconds()} s`;
        
        const resp = response.data
        // update object response
        resp.duration = duration
        return res.status(200).json(resp);
      })
      .catch((error) => {
        const finishTime = new Date().getTime() - mills
        const timeResponse = new Date(finishTime);
        const duration = `${timeResponse.getMinutes()} m ${timeResponse.getSeconds()} s`;
        // console.log(duration);
        const resp = error
        resp.duration = duration
        return res.status(500).json({ status: false, message: resp });
      });
  });
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const remove = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }

    res.status(200).send({
      message: "File is deleted.",
    });
  });
};

const removeSync = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  try {
    fs.unlinkSync(directoryPath + fileName);

    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};

module.exports = {
  upload,
  getListFiles,
  download,
  remove,
  removeSync,
  pushData,
  getNoJS,
};
