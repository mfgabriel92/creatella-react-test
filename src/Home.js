import React, { Component } from "react";
import Face from "./Face";
import Loading from "./Loading";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
    }
  }

  componentDidMount() {
    this.fetchFaces();
  }

  componentDidCatch() {
    alert("Error")
  }

  fetchFaces() {
    fetch("http://localhost:3000/products")
      .then((res) => {
        return res.json()
      })
      .then((products) => {
        this.setState({ products })
      })
  }

  renderFaces() {
    const { products } = this.state;

    if (products.length === 0) {
      return (
        <div className="text-center m-auto">
          <Loading/>
        </div>
      )
    }

    return (
      products.map((face) => {
        return (
          <div key={face.id} className="col-lg-3 col-md-3 col-sm-2 col-xs-1 text-center">
            <Face face={face.face} size={face.size} price={face.price} date={face.date}/>
          </div>
        )
      })
    )
  };

  handleOnChange(e) {
    const { products } = this.state;

    let list = [];

    switch (e.target.value) {
      case "size":
        list = products.sort((a, b) => { return a.size - b.size});
        break;
      case "price":
        list = products.sort((a, b) => { return a.price - b.price});
        break;
      case "id":
        break;
    }

    this.setState({ products: list });
  }

  render() {
    return (
      <div className="container">
        <h1>Products Grid</h1>
        <p>
          Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our
          selection of ascii faces in an exciting range of sizes and prices.
        </p>
        <p>But first, a word from our sponsors:</p>

        <img className="ad" src={`/ads/?r=${Math.floor(Math.random() * 1000)}`}/>

        <div className="col-12 faces">
          <div className="row">
            <select name="order" className="form-control" onChange={this.handleOnChange.bind(this)}>
              <option value="0">No order</option>
              <option value="size">By size</option>
              <option value="price">By price</option>
              <option value="id">By ID</option>
            </select>

            {this.renderFaces()}
          </div>
        </div>
      </div>
    )
  }
}

export default Home;