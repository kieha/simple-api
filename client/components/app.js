/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */

import React, { Component } from "react";
import request from "superagent";
import Moment from "react-moment";

const styles = {
  buttonStyles: {
    color: "#6495ed",
    textDecoration: "dashed underline",
    fontSize: "1.75em",
    background: "none",
    border: "none",
    outline: "none",
    cursor: "pointer",
    marginBottom: 10,
  },
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: undefined,
      title: "",
      entry: "",
      editedTitle: "",
      journalEntries: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editField = this.editField.bind(this);
    this.handleEditField = this.handleEditField.bind(this);
    this.stopEditing = this.stopEditing.bind(this);
    this.editTitle = this.editTitle.bind(this);
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

  editTitle(entryId) {
    request
      .put(`http://localhost:3000/api/journals/${entryId}`)
      .send({
        title: this.state.editedTitle,
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
          });
          this.setState({
            editing: undefined,
          });
          this.fetchEntries();
        }
      });
  }

  editField(entryId) {
    this.setState({
      editing: entryId,
    });
  }

  handleEditField() {
    const name = this.input.name;
    const value = this.input.value;
    this.setState({
      [name]: value,
    });
  }

  stopEditing() {
    this.setState({
      editing: undefined,
    });
  }

  deleteEntry(entryId) {
    swal({
      type: "warning",
      text: "Are you sure you want to delete this entry?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "No, cancel",
      allowOutsideClick: false,
      cancelButtonColor: "#d33",
    }).then(() => {
      request
        .delete(`http://localhost:3000/api/journals/${entryId}`)
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
            });
            this.fetchEntries();
          }
        });
    }).catch(swal.noop);
  }

  renderDelete(entryId) {
    return (
      <div className="delete-entry" style={{ position: "absolute" }}>
        <button
          className="btn btn-danger"
          style={{ border: "1px solid transparent", borderRadius: 2 }}
          type="button"
          onClick={() => this.deleteEntry(entryId)}
        >
          Delete Entry
        </button>
      </div>
    );
  }

  renderTitle(title, entryId) {
    return this.state.editing === entryId ?
      <div className="row editable-title">
        <div className="input-group" style={{ margin: "auto", marginBottom: 19, maxWidth: "fit-content" }}>
          <input
            style={{ borderRadius: 2 }}
            type="text"
            className="form-control"
            placeholder="Edit Title"
            ref={(input) => { this.input = input; }}
            name="editedTitle"
            defaultValue={title}
            onChange={this.handleEditField}
          />
          <span className="input-group-btn" style={{ marginLeft: 12 }}>
            <button
              className="btn btn-primary"
              style={{ border: "1px solid transparent", borderRadius: 2 }}
              type="button"
              onClick={() => this.editTitle(entryId)}
            >
              <i className="fa fa-check" aria-hidden="true" />
            </button>
          </span>
          <span className="input-group-btn" style={{ marginLeft: 12 }}>
            <button
              className="btn btn-secondary"
              style={{ border: "1px solid transparent", borderRadius: 2 }}
              type="button"
              onClick={this.stopEditing}
            >
              <i className="fa fa-times" aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
    :
      <button
        style={styles.buttonStyles}
        onClick={() => this.editField(entryId)}
      >
        {title}
      </button>;
  }

  renderJournalList() {
    return this.state.journalEntries.length ?
      this.state.journalEntries.map(entry => (
        <div className="list-group" key={entry._id} style={{ marginTop: 20, marginBottom: 20 }}>
          <div className="list-group-item flex-column align-items-start" style={{ textAlign: "center", justifyContent: "center" }}>
            {this.renderDelete(entry._id)}
            {this.renderTitle(entry.title, entry._id)}
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
