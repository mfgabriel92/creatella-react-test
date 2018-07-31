import React, { Component } from "react";
import Face from "./Face";
import Loading from "./Loading";
import Ad from "./Ad";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      page: 1,
      limit: 20,
      sort: null,
      previousAd: "",
      isLoading: true
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
    const { products, page, limit, isLoading } = this.state;

    let endpoint = `http://localhost:3000/products?_page=${page}&_limit=${limit}`;

    if (sort && sort !== "none") {
      endpoint += `&_sort=${sort}`;
    }

    isLoading && fetch(endpoint)
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

        list = list.concat(this.fetchAds());

        this.setState({
          products: list,
          isLoading: false
        });
      })
  }

  renderFaces() {
    const { products } = this.state;

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
          <div key={face.id} className="col-lg-3 col-md-3 col-sm-2 col-xs-1 text-center">
            <Face face={face.face} size={face.size} price={face.price} date={face.date}/>
          </div>
        )
      })
    )
  };

  fetchAds() {
    const { previousAd } = this.state;

    let id = Math.floor(Math.random() * 1000);

    while (previousAd === id) {
      id = Math.floor(Math.random() * 1000);
    }

    this.setState({ previousAd: id });
    return { ad: id };
  }

  handleScroll() {
    let wHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let oHeight = document.body.offsetHeight;

    if ((wHeight + scrollY) >= oHeight) {
      const { sort, isLoading } = this.state;

      if (!isLoading) {
        this.setState({
          page: this.state.page + 1,
          isLoading: true
        });

        this.fetchFaces(sort);
      }
    }
  }

  handleOnChange(e) {
    const allowedSorts = ["none", "size", "price", "id"];
    const { value } = e.target;

    if (!allowedSorts.includes(value)) {
      alert("Error while sorting. Invalid parameter");
      return;
    }

    this.setState({ products: [], sort: value });
    this.fetchFaces(value);
  }

  render() {
    const { products, isLoading } = this.state;

    return (
      <div className="container">
        <h1>Products Grid</h1>
        <p>
          Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our
          selection of ascii faces in an exciting range of sizes and prices.
        </p>
        <p>But first, a word from our sponsors:</p>

        <Ad/>

        <div className="col-12 faces">
          <div className="row">
            <select name="order" className="form-control" onChange={this.handleOnChange.bind(this)}>
              <option value="none">No order</option>
              <option value="size">By size</option>
              <option value="price">By price</option>
              <option value="id">By ID</option>
            </select>

            {this.renderFaces()}

            {products.length >= 20 && <Loading show={isLoading}/>}
          </div>
        </div>
      </div>
    )
  }
}

export default Home;