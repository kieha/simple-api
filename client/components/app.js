/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */

import React, { Component } from "react";
import request from "superagent";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      entry: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    request
      .post("http://localhost:3000/api/journals/new")
      .send({
        title: this.state.title,
        entry: this.state.entry,
      })
      .end((err, res) => {
        if (res.body.error) {
          swal({
            title: "Error",
            text: res.body.error,
            type: "error",
          });
        } else {
          swal({
            title: "Success",
            text: res.body.message,
            type: "success",
            confirmButtonText: "OK",
            allowOutsideClick: false,
          }).then(() => {
            this.setState({
              title: "",
              entry: "",
            });
          });
        }
      });
  }

  render() {
    return (
      <div>
        <div className="jumbotron jumbotron-fluid" style={{ textAlign: "center" }}>
          <h1>Jot It Down</h1>

          <div className="container" style={{ paddingTop: "46px" }}>

            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor>Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Journal Entry Title"
                  required
                  name="title"
                  value={this.state.title}
                  onChange={this.handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor>Journal Entry</label>
                <textarea
                  name="entry"
                  className="form-control"
                  required
                  rows="5"
                  value={this.state.entry}
                  onChange={this.handleInputChange}
                />
              </div>

              <button type="submit" className="btn btn-primary">Submit Journal Entry</button>
            </form>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
