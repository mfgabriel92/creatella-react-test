import React, { Component } from "react";

class Loading extends Component {
  render() {
    return (
      <div>
        <div className="loader"></div>
        <span className="small text-muted">Loading...</span>
      </div>
    )
  }
}

export default Loading;