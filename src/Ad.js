import React, { Component } from "react";
import PropTypes from "prop-types";

class Ad extends Component {
  render() {
    const { id } = this.props;

    return (
      <img className="ad" src={`/ads/?r=${id}`}/>
    )
  }
}

Ad.propTypes = {
  id: PropTypes.number
};

Ad.defaultProps = {
  id: Math.floor(Math.random() * 1000)
};

export default Ad;