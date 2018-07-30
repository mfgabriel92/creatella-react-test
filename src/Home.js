import React, { Component } from "react";
import Face from "./Face";
import Loading from "./Loading";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: []
    }
  }

  componentDidMount() {
    fetch("http://localhost:3000/products")
      .then((res) => { return res.json() })
      .then((products) => {
        this.setState({ products })
      })
  }

  componentDidCatch() {
    alert("Error")
  }

  renderFaces() {
    const { products } = this.state;

    if (products.length === 0) {
      return (
        <div className="text-center">
          <Loading/>
        </div>
      )
    }

    return (
      <div className="col-12 faces">
        <div className="row">
          {
            products.map((face) => {
              return (
                <div key={face.id} className="col-lg-3 col-md-3 col-sm-2 col-xs-1 text-center">
                  <Face face={face.face} size={face.size} price={face.price} date={face.date} />
                </div>
              )
            })
          }
        </div>
      </div>
    )
  };

  render() {
    return (
      <div className="container">
        <h1>Products Grid</h1>

        <p>
          Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our
          selection of ascii faces in an exciting range of sizes and prices.
        </p>

        <p>But first, a word from our sponsors:</p>

        <img className="ad" src={`/ads/?r=${Math.floor(Math.random()*1000)}`}/>

        {this.renderFaces()}
      </div>
    )
  }
}

export default Home;