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
    let interval = Math.ceil((Math.abs(date - dateNow)) / (1000 * 60 * 60 * 24));
    let output;

    if (interval < 6) {
      let d = interval === 1 ? "day" : "days";
      output = `${interval} ${d} ago`;
    } else if (interval > 6) {
      let day = date.getDate();
      let month = date.getMonth();
      let year = date.getFullYear();
      output = `${month}/${day}/${year}`;
    } else {
      output = "Today";
    }

    return output;
  }

  render() {
    const { face, size, price, date } = this.props;

    return (
      <div className="face position-relative">
        <div className="image">
          <span style={{ fontSize: size }}>{face}</span>
        </div>
        <div className="info position-absolute w-100">
          <div className="row">
            <div className="price col-lg-6 col-md-6 col-sm-6 col-xs-6 small text-muted text-left">
              {this.formatPrice(price)}
            </div>
            <div className="date col-lg-6 col-md-6 col-sm-6 col-xs-6 small text-muted text-right">
              {this.formatDate(date)}
            </div>
          </div>
        </div>
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