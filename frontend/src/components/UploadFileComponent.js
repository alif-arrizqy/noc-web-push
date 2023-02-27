import React, { Component } from "react";
import { Spin } from 'antd';
import UploadService from "../services/UploadFiles";
import FecthNoJsService from "../services/FetchNoJS";
import PushFilesService from "../services/PushFiles";
import Select from 'react-select';
import Modals from "./ModalsComponent";

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      isClearable: true,
      setIsClearable: true,
      isSearchable: true,
      setIsSearchable: true,
      isDisabled: false,
      setIsDisabled: false,
      isLoading: false,
      setIsLoading: false,
      isRtl: false,
      setIsRtl: false,
      nojs: '',
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",

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
      selectedFiles: event.target.files,
    });
  }

  upload() {
    let currentFile = this.state.selectedFiles[0];

    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    UploadService.upload(currentFile, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
        return UploadService.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
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
      showModals: true,
    })
  }

  handleOk = () => {
    this.setState({
      showModals: false,
    })
    console.log(this.state.pushData);
    PushFilesService.push(this.state.pushData)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
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

  render() {
    const {
      selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,
    } = this.state;
    
    return (
      <>
      <Modals
        show={this.state.showModals}
        onClose={() => this.setState({ showModals: false })}
        onOk={this.handleOk}
      />
        
      <div>
        {currentFile && (
          <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}

        <label className="btn btn-default">
          <input type="file" onChange={this.selectFile} />
        </label>

        <button
          className="btn btn-success"
          disabled={!selectedFiles}
          onClick={this.upload}
        >
          Upload
        </button>

        <div className="alert alert-light" role="alert">
          {message}
        </div>
        
        <Select 
          options={this.state?.option}
          onChange={this.handleSelect}
          >
        </Select>

        <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name}</a>
                  <button className="btn btn-primary" disabled={this.state.nojs === ''} onClick={()=>this.push({...file, index})}>Push</button>
                  <button className="btn btn-danger">Delete</button>
                  <Spin/>
                </li>
              ))}
          </ul>
        </div>
      </div>
      </>
    );
  }
}
