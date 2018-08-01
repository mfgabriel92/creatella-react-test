import React, { Component } from "react";
import Faces from "./Faces";
import Ad from "./Ad";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productsUri: '/api/products',
      products: [],
      totalProducts: 0,
      previousAd: "",
      page: 1,
      limit: 20,
      sort: null,
      isLoading: true,
      hasAllProducts: false
    }
  }

  componentWillMount() {
    this.fetchFaces();
    // this.fetchFacesCount();
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
    const { productsUri, products, totalProducts, page, limit, isLoading } = this.state;

    let endpoint = `${productsUri}?_page=${page}&_limit=${limit}`;

    if (sort && sort !== "none") {
      endpoint += `&_sort=${sort}`;
    }

    isLoading && fetch(endpoint)
      .then((res) => {
        if (totalProducts === 0) {
          this.setState({
            totalProducts: parseInt(res.headers.get("x-total-count"))
          });
        }

        return res.json()
      })
      .then((data) => {
        let list = products.concat(data);
        list = list.concat(this.fetchAds());

        this.setState({
          products: list,
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
    let wHeight = window.innerHeight;
    let scrollY = window.scrollY;
    let oHeight = document.body.offsetHeight;

    const { sort, products, totalProducts, isLoading } = this.state;

    if ((wHeight + scrollY) >= oHeight && !isLoading && totalProducts >= products.length) {
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

    setTimeout(() => {
      this.fetchFaces(sort);
    }, 300)
  }

  render() {
    const { products, totalProducts, isLoading } = this.state;

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
        <Faces products={products} isLoading={isLoading} totalProducts={totalProducts}/>
      </div>
    )
  }
}

export default Home;