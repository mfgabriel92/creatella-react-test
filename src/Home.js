import React, { Component } from "react";
import Face from "./Face";
import Loading from "./Loading";
import Ad from "./Ad";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productsUri: '/api/products',
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

  /**
   * Fetch the products from the endpoint.
   *
   * @param sort the order the products should be displayed. Values are "price", "size", "ID".
   */
  fetchFaces(sort = null) {
    const { productsUri, products, page, limit, isLoading } = this.state;

    let endpoint = `${productsUri}?_page=${page}&_limit=${limit}`;

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

  /**
   * Render the products in a grid form.
   *
   * @returns {*}
   */
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

  /**
   * Generate and return a random ID of a sponsor's image that isn't equal to the previous one.
   *
   * @returns {{ad: number}} ID of the next ad
   */
  fetchAds() {
    const { previousAd } = this.state;

    let id = Math.floor(Math.random() * 1000);

    while (previousAd === id) {
      id = Math.floor(Math.random() * 1000);
    }

    this.setState({ previousAd: id });

    return { ad: id };
  }

  /**
   * Triggered when scrolling the browser. Upon reaching the bottom, more data is fetched and displayed.
   */
  handleScroll() {
    let wHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let oHeight = document.body.offsetHeight;

    const { sort, isLoading } = this.state;

    if ((wHeight + scrollY) >= oHeight && !isLoading) {
      this.setState({
        page: this.state.page + 1,
        isLoading: true
      });

      this.fetchFaces(sort);
    }
  }

  /**
   * Triggered when changing the sort option drop-down.
   *
   * @param e element of which the value is verified and sorted accordingly.
   */
  handleOnChange(e) {
    const allowedSorts = ["none", "size", "price", "id"];
    const sort = e.target.value;

    if (!allowedSorts.includes(sort)) {
      alert(`Error while sorting. Invalid sort value '${sort}'`);
      return;
    }

    this.setState({
      page: 1,
      products: [],
      sort,
      isLoading: true
    });

    setTimeout(() => { this.fetchFaces(sort); }, 300)
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