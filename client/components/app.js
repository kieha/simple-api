/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */

import React, { Component } from "react";
import request from "superagent";
import Moment from "react-moment";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      entry: "",
      journalEntries: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchEntries();
  }

  fetchEntries() {
    request
      .get("http://localhost:3000/api/journals")
      .end((err, res) => {
        if (res.body.message) {
          this.setState({
            journalEntries: [],
          });
        } else {
          this.setState({
            journalEntries: res.body,
          });
        }
      });
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
          this.fetchEntries();
        }
      });
  }

  renderJournalList() {
    return this.state.journalEntries.length ?
      this.state.journalEntries.map(entry => (
        <div className="list-group" key={entry._id} style={{ marginTop: 20, marginBottom: 20 }}>
          <div className="list-group-item flex-column align-items-start" style={{ textAlign: "center", justifyContent: "center" }}>
            <h3>{entry.title}</h3>
            <h6>Created at: {<Moment format="HH:mm DD/MM/YYYY">{entry.createdAt}</Moment>}</h6>
            <p>{entry.entry}</p>
          </div>
        </div>
      ))
      :
      <div className="not-found" style={{ marginTop: 20, marginBottom: 20 }}>
        <h3 style={{ textAlign: "center" }}>No journal entries yet!</h3>
        <h4 style={{ textAlign: "center" }}>Insert an entry in the form above to get started</h4>
      </div>;
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

        <div className="container-fluid">
          <h2 style={{ textAlign: "center" }}>Journal Entries</h2>
          {this.renderJournalList()}
        </div>
      </div>
    );
  }
}

export default App;
