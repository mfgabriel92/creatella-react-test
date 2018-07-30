import React, { Component } from "react";
import PropTypes from "prop-types";

class Face extends Component {
  formatPrice(value) {
    let price = value.toString();
    let len = price.length;
    let a = price.slice(0, 1);
    let b = price.substr(1, len);
    let output = `$${a}.${b}`;

    if (len === 1) {
      output = `0.0${a}`;
    } else if (len === 2) {
      output = `${a}.${b}0`;
    } else {
      output = `${a}.${b}`;
    }

    return `$${output}`;
  }

  formatDate(value) {
    let date = new Date(value);
    let dateNow = new Date();
    let dayAdded = date.getDate();
    let today = dateNow.getDate();
    let interval = today - dayAdded ;
    let output = "Today";

    if (interval < 6) {
      let d = interval === 1 ? "day" : "days";
      output = `${interval} ${d} ago`;
    } else if (interval > 6) {
      let month = date.getMonth();
      let year = date.getFullYear();
      output = `${month}/${dayAdded}/${year}`;
    }

    return output;
  }

  render() {
    const { face, size, price, date } = this.props;

    return(
      <div className="face">
        <div style={{fontSize: size}}>{face}</div>
        <div className="small">{this.formatPrice(price)}</div>
        <div className="small">{this.formatDate(date)}</div>
      </div>
    )
  }
}

Face.propTypes = {
  face: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
};

export default Face;