import React, { Component } from "react";

class Loading extends Component {
  render() {
    return (
      <div>
        <div className="loader m-auto"></div>
        <span className="small text-muted">Loading...</span>
      </div>
    )
  }
}

export default Loading;