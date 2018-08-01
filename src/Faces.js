import React, { Component } from "react";
import PropTypes from "prop-types";
import Ad from "./Ad";
import Face from "./Face";
import Loading from "./Loading";

class Faces extends Component {
  componentWillReceiveProps(nextProps) {
    const nextList = nextProps.products;
    const prevList = this.props.products;
  }

  /**
   * Render the products in a grid form.
   *
   * @returns {*}
   */
  renderFaces() {
    const { products } = this.props;

    if (products.length === 0) {
      return <Loading/>;
    }

    return (
      products.map((face) => {
        if (face.hasOwnProperty("ad")) {
          return (
            <div key={face.ad} className="ads col-lg-12 text-center">
              <Ad id={face.ad}/>
            </div>
          )
        }

        return (
          <div key={face.id} className="col-lg-3 col-md-6 col-sm-12 text-center">
            <Face face={face.face} size={face.size} price={face.price} date={face.date}/>
          </div>
        )
      })
    )
  };

  render() {
    const { products, isLoading } = this.props;

    return (
      <div className="col-lg-12 faces">
        <div className="row">
          {this.renderFaces()}
          {products.length >= 20 && <Loading show={isLoading}/>}
        </div>
      </div>
    )
  }
}

Faces.propTypes = {
  products: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};

Faces.defaultProps = {};

export default Faces;