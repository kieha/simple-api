/* eslint-disable react/jsx-filename-extension */

import React, { Component } from "react";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      entry: "",
    };
  }

  render() {
    return (
      <div>
        <div className="jumbotron jumbotron-fluid" style={{ textAlign: "center" }}>
          <h1>Jot It Down</h1>

          <div className="container" style={{ paddingTop: "46px" }}>

            <form noValidate>
              <div className="form-group">
                <label htmlFor>Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Journal Entry Title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor>Journal Entry</label>
                <textarea
                  className="form-control"
                  rows="5"
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
