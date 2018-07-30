import React, { Component } from "react";
import PropTypes from "prop-types";

class Face extends Component {
  formatPrice(value) {
    let price = value.toString();
    let len = price.length;
    let a = price.slice(0, 1);
    let b = price.substr(1, price.length);
    let output = `$${a}.${b}`;

    if (len === 2) {
      output = output + "0";
    }

    return output;
  }

  render() {
    const { face, size, price } = this.props;

    return(
      <div className="face">
        <div style={{fontSize: size}}>{face}</div>
        <span className="small">{this.formatPrice(price)}</span>
      </div>
    )
  }
}

Face.propTypes = {
  face: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
};

export default Face;