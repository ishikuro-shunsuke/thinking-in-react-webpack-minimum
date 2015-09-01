/// <reference path="typings/tsd.d.ts" />
import * as React from 'react';

interface Product {
  category: string;
  price: string;
  stocked: boolean;
  name: string;
}

var PRODUCTS = [
  {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
  {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
  {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
  {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
  {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
  {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

interface PCRProps {
  category: string;
  key: string;
}

class ProductCategoryRow extends React.Component<PCRProps, {}> {
  render() {
    return (<tr><th colSpan={2}>{this.props.category}</th></tr>);
  }
}

interface PRProps {
  product: Product;
  key: string;
}

class ProductRow extends React.Component<PRProps, {}> {
  render() {
    let name = this.props.product.stocked ?
      this.props.product.name :
      <span style={{color: 'red'}}>
        {this.props.product.name}
      </span>;
    return (
      <tr>
        <td>{name}</td>
        <td>{this.props.product.price}</td>
      </tr>
    );
  }
}

interface PTProps {
  products: Product[];
  filterText: string;
  inStockOnly: boolean;
}

class ProductTable extends React.Component<PTProps, {}> {
  render() {
    console.log(this.props);
    let rows = [];
    let lastCategory = null;
    this.props.products.forEach((product) => {
      if (product.name.indexOf(this.props.filterText) === -1
          || (!product.stocked && this.props.inStockOnly)) {
        return;
      }

      if (product.category !== lastCategory) {
        rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
      }
      rows.push(<ProductRow product={product} key={product.name} />);
      lastCategory = product.category;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

interface SBProps {
  filterText: string;
  inStockOnly: boolean;
  onUserInput: (filterText: string, inStockOnly: boolean) => void;
}

class SearchBar extends React.Component<SBProps, {}> {
  handleChange() {
    this.props.onUserInput(
        React.findDOMNode(this.refs.filterTextInput).value,
        React.findDOMNode(this.refs.inStockOnlyInput).checked
    );
  }

  render() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref={"filterTextInput"}
          onChange={this.handleChange.bind(this)}
        />
        <p>
          <input
            type="checkbox"
            checked={this.props.inStockOnly}
            ref="inStockOnlyInput"
            onChange={this.handleChange.bind(this)}
          />
          {' '}
          Only show products in stock
        </p>
      </form>
    );
  }
}

interface FPTProps {
  products: Product[];
}

interface FPTState {
  filterText: string;
  inStockOnly: boolean;
}

class FilterableProductTable extends React.Component<FPTProps, FPTState> {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false
    };
  }

  handleUserInput(filterText: string, inStockOnly: boolean) {
    this.setState({
      filterText: filterText,
      inStockOnly: inStockOnly
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
          onUserInput={this.handleUserInput.bind(this)}
        />
        <ProductTable
          products={this.props.products}
          filterText={this.state.filterText}
          inStockOnly={this.state.inStockOnly}
        />
      </div>
    );
  }
}

React.render(<FilterableProductTable products={PRODUCTS} />, document.body);

