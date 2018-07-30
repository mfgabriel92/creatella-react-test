import React, { Component } from "react";
import Face from "./Face";
import Loading from "./Loading";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      page: 1,
      limit: 20,
      isLoading: false
    }
  }

  componentWillMount() {
    this.fetchFaces();
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  componentDidCatch() {
    alert("Error")
  }

  fetchFaces(sort = null) {
    const { products, page, limit } = this.state;

    let endpoint = `http://localhost:3000/products?_page=${page}&_limit=${limit}`;

    if (sort) {
      endpoint += `&_sort=${sort}`;
    }

    fetch(endpoint)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        let list = [];

        if (products.length === 0) {
          list = data
        } else {
          list = products.concat(data)
        }

        this.setState({
          products: list,
          isLoading: false
        })
      })
  }

  renderFaces() {
    const { products } = this.state;

    if (products.length === 0) {
      return <Loading/>;
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

  handleScroll() {
    let wHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let oHeight = document.body.offsetHeight;

    if ((wHeight + scrollY) >= oHeight) {
      this.setState({
        page: this.state.page + 1,
        isLoading: true
      });

      this.fetchFaces();
    }
  }

  handleOnChange(e) {
    const allowedSorts = ["size", "price", "id"];
    const { value } = e.target;

    if (!allowedSorts.includes(value)) {
      alert("Error while sorting. Invalid parameter");
      return;
    }

    this.setState({ products: [] });
    this.fetchFaces(value)

    // const { products } = this.state;
    //
    // let list = [];
    //
    // switch (e.target.value) {
    //   case "size":
    //     list = products.sort((a, b) => { return a.size - b.size });
    //     break;
    //   case "price":
    //     list = products.sort((a, b) => { return a.price - b.price });
    //     break;
    //   case "id":
    //     list = products.sort((a, b) => {
    //       let idA = a.id.substring(0, 4);
    //       let idB = b.id.substring(0, 4);
    //
    //       return idA - idB;
    //     });
    //     break;
    // }
    //
    // this.setState({ products: list });
  }

  render() {
    const { isLoading } = this.state;

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

            <Loading show={isLoading}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;