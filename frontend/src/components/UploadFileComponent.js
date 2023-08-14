import React, { Component } from "react";
import { Spin, notification } from 'antd';
import UploadService from "../services/UploadFiles";
import FecthNoJsService from "../services/FetchNoJS";
import PushFilesService from "../services/PushFiles";
import DeleteFilesService from "../services/DeleteFiles";
import Select from 'react-select';
import {Modals, DeleteModals} from "./ModalsComponent";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);

    this.state = {
      showMessage: false,
      isLoading: false,
      nojs: '',
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      // message: "",
      progressInfos: [],
      message: [],

      fileInfos: [],
    };
  }

  componentDidMount() {
    UploadService.getFiles().then((response) => {
      this.setState({
        fileInfos: response.data,
      });
    });
    this.fetch();
  }

  selectFile(event) {
    this.setState({
      progressInfos: [],
      selectedFiles: event.target.files,
    });
  }

  upload(idx, file) {
    // let currentFile = this.state.selectedFiles[0];

    // this.setState({
    //   progress: 0,
    //   currentFile: currentFile,
    // });

    // UploadService.upload(currentFile, (event) => {
    //   this.setState({
    //     progress: Math.round((100 * event.loaded) / event.total),
    //   });
    // })
    //   .then((response) => {
    //     this.setState({
    //       message: response.data.message,
    //     });
    //     return UploadService.getFiles();
    //   })
    //   .then((files) => {
    //     this.setState({
    //       fileInfos: files.data,
    //     });
    //   })
    //   .catch(() => {
    //     this.setState({
    //       progress: 0,
    //       message: "Could not upload the file!",
    //       currentFile: undefined,
    //     });
    //   });

    // this.setState({
    //   selectedFiles: undefined,
    // });

    let _progressInfos = [...this.state.progressInfos];

    UploadService.upload(file, (event) => {
      _progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
      this.setState({
        _progressInfos,
      });
    })
      .then((response) => {
        this.setState((prev) => {
          let nextMessage = [...prev.message, "Uploaded the file successfully: " + file.name];
          return {
            message: nextMessage
          };
        });

        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch(() => {
        _progressInfos[idx].percentage = 0;
        this.setState((prev) => {
          let nextMessage = [...prev.message, "Could not upload the file: " + file.name];
          return {
            progressInfos: _progressInfos,
            message: nextMessage
          };
        });
      });
  }

  uploadFiles() {
    const selectedFiles = this.state.selectedFiles;

    let _progressInfos = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      _progressInfos.push({ percentage: 0, fileName: selectedFiles[i].name });
    }

    this.setState(
      {
        progressInfos: _progressInfos,
        message: [],
      },
      () => {
        for (let i = 0; i < selectedFiles.length; i++) {
          this.upload(i, selectedFiles[i]);
        }
      }
    );
  }

  push(req) {
    const filename = req.name

    const obj = {
      filename: filename,
      nojs: this.state.nojs,
    }
    console.log(obj);
    this.setState({
      pushData: obj,
      showPushModals: true,
      keyIndex: req.index,
      noJS: this.state.nojs,
      title: "Push Data ?"
    })
  }

  handleOk = () => {
    this.setState({
      showPushModals: false,
      isLoading: true
    })
    console.log(this.state.pushData);
    PushFilesService.push(this.state.pushData)
      .then((response) => {
        const codeStatusResponse = response.status
        codeStatusResponse === 200 ? this.setState({ isLoading: false }) : this.setState({ isLoading: true })
        // alert success
        // message.open({
        //   type: 'success',
        //   content: `file ${this.state.pushData.filename} ${response.data.data}, Execution time ${response.data.duration}`,
        //   duration: 15,
        // });

        notification.success({
          message: 'Push Data Success',
          description: `file ${this.state.pushData.filename} ${response.data.data}, Execution time ${response.data.duration}`,
          duration: 0,
        })
        console.log(`file ${this.state.pushData.filename} ${response.data.data}, Execution time ${response.data.duration}`);
      })
      .catch((e) => {
        // alert error
        // message.open({
        //   type: 'error',
        //   content: `${e.response.data.message.message}`,
        //   duration: 15,
        // });
        notification.error({
          message: 'Push Data Error',
          description: `${e.response.data.message.message}`,
          duration: 0,
        })
      })
  }

  handleSelect(event) {
    this.setState({ nojs: event.value });
  }

  fetch() {
    FecthNoJsService.fetchNoJs()
      .then((response) => {
        let resp = response.data.data
        resp = resp.map((item) => {
          return {value:item.nojs, label: `${item.nojs} - ${item.site}`}
        })
        this.setState({
          option: resp,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  delete(req) {
    const filename = req.name

    this.setState({
      filename: filename,
      showDeleteModals: true,
      keyIndex: req.index,
      title: "Delete Data ?"
    })
  }

  handleDelete = () => {
    this.setState({
      showDeleteModals: false,
      isLoading: true
    })
    console.log(this.state.filename);
    DeleteFilesService.delete(this.state.filename)
      .then((response) => {
        const codeStatusResponse = response.status
        codeStatusResponse === 200 ? this.setState({ isLoading: false }) : this.setState({ isLoading: true })
        // alert success
        // message.open({
        //   type: 'success',
        //   content: `${this.state.filename} ${response.data.message}`,
        //   duration: 10,
        // });
        notification.success({
          message: 'Delete Success',
          description: `${this.state.filename} ${response.data.message}`,
          duration: 0,
        })
        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch((e) => {
        // alert error
        // message.open({
        //   type: 'error',
        //   content: `${e.response.data.message}`,
        //   duration: 10,
        // });
        notification.error({
          message: 'Delete Error',
          description: `${e.response.data.message}`,
          duration: 0,
        })
      })
  }

  render() {
    const { selectedFiles, progressInfos, message, fileInfos } = this.state;
    
    return (
      <>
      <Modals
        titleModal={this.state.title}
        show={this.state.showPushModals}
        onClose={() => this.setState({ showPushModals: false })}
        onOk={this.handleOk}
      />
      <DeleteModals
        titleModal={this.state.title}
        show={this.state.showDeleteModals}
        onClose={() => this.setState({ showDeleteModals: false })}
        onOk={this.handleDelete}
      />
        
      <div>
      {progressInfos &&
          progressInfos.map((progressInfo, index) => (
            <div className="mb-2" key={index}>
              <span>{progressInfo.fileName}</span>
              <div className="progress">
                <div
                  className="progress-bar progress-bar-info"
                  role="progressbar"
                  aria-valuenow={progressInfo.percentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progressInfo.percentage + "%" }}
                >
                  {progressInfo.percentage}%
                </div>
              </div>
            </div>
          ))}

        <label className="btn btn-default">
          <input type="file" multiple onChange={this.selectFile} />
        </label>

        <button
          className="btn btn-success"
          disabled={!selectedFiles}
          onClick={this.uploadFiles}
        > Upload
        </button>

        <div className="alert alert-light" role="alert">
          {message}
        </div>
        
        <Select 
          options={this.state?.option}
          onChange={this.handleSelect}
          >
        </Select>

        <div className="card mt-4">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  {/* <a href={file.url}>{file.name}</a> */}
                  {file.name}
                  <button className="btn btn-primary" disabled={this.state.nojs === ''} onClick={()=>this.push({...file, index})}>Push</button>
                  <button className="btn btn-danger" onClick={()=>this.delete({...file, index})}>Delete</button>
                  {this.state.keyIndex === index ? this.state.isLoading === true ? <Spin /> : null : null}
                </li>
              ))}
          </ul>
        </div>
      </div>
      </>
    );
  }
}
