import React, { Component } from "react";
import Faces from "./Faces";
import Ad from "./Ad";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productsUri: '/api/products',
      products: [],
      nextProducts: [],
      totalProducts: 0,
      previousAd: "",
      page: 1,
      limit: 20,
      sort: null,
      isLoading: true,
      hasAllProducts: false,
    }
  }

  componentWillMount() {
    this.fetchFirst20Faces();
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
   * Generate the string endpoint for fetching products
   *
   * @returns {string} generated endpoint
   */
  generateEndpoint() {
    const { productsUri, page, limit, sort } = this.state;

    let endpoint = `${productsUri}?_page=${page}&_limit=${limit}`;

    if (sort && sort !== "none") {
      endpoint += `&_sort=${sort}`;
    }

    return endpoint;
  }

  /**
   * Fetch the products from the endpoint.
   */
  fetchFirst20Faces() {
    const { products, totalProducts, isLoading } = this.state;

    let endpoint = this.generateEndpoint();

    isLoading && fetch(endpoint).then((res) => {
      if (totalProducts === 0) {
        this.setState({
          totalProducts: parseInt(res.headers.get("x-total-count"))
        });
      }

      return res.json()
    }).then((data) => {
      let list = products.concat(data);
      list = list.concat(this.fetchAds());

      this.setState({
        products: list,
        isLoading: false,
      });
    }).then(() => {
      this.setState({ page: this.state.page + 1 });
      this.fetchNextFaces();
    })
  }

  /**
   * Fetch the next products for cache
   */
  fetchNextFaces() {
    const { nextProducts } = this.state;

    let endpoint = this.generateEndpoint();

    fetch(endpoint).then((res) => {
      return res.json()
    }).then((data) => {
      let list = nextProducts.concat(data);
      list = list.concat(this.fetchAds());

      this.setState({
        nextProducts: list,
        isLoading: false,
      });
    })
  }

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
    const { products, nextProducts, totalProducts, isLoading } = this.state;

    let wHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let oHeight = document.body.offsetHeight;
    let hasReachedBottom = (wHeight + scrollY) >= oHeight;
    let hasNotAllProducts = totalProducts >= products.length;

    if (hasReachedBottom && hasNotAllProducts && !isLoading) {
      this.setState({
        products: this.state.products.concat(nextProducts),
        nextProducts: [],
        page: this.state.page + 1,
      });

      this.fetchNextFaces();
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
      nextProducts: [],
      sort,
      isLoading: true
    });

    setTimeout(() => {
      this.fetchFirst20Faces();
    }, 300)
  }

  render() {
    const { products, nextProducts, totalProducts } = this.state;

    return (
      <div className="container">
        <h1>Products Grid</h1>
        <p>
          Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our
          selection of ascii faces in an exciting range of sizes and prices.
        </p>
        <p>But first, a word from our sponsors:</p>

        <div className="text-center">
          <Ad/>
        </div>

        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-1">
              Sort by:
            </div>
            <div className="col-lg-3">
              <select name="order" className="form-control" onChange={this.handleOnChange.bind(this)}>
                <option value="none">No order</option>
                <option value="size">By size</option>
                <option value="price">By price</option>
                <option value="id">By ID</option>
              </select>
            </div>
          </div>
        </div>
        <Faces
          products={products}
          isLoading={nextProducts.length === 0}
          totalProducts={totalProducts}
        />
      </div>
    )
  }
}

export default Home;