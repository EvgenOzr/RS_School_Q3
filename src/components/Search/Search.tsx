import React, { Component } from 'react';
import './Search.css';
import type { searchProps } from '../types/types';

class Search extends Component<searchProps> {
  state = {
    search: '',
  };

  componentDidMount(): void {
    const saveSearch = localStorage.getItem('search');
    if (saveSearch) {
      this.setState({
        search: saveSearch,
      });
      this.props.onUpdateSearch(this.state.search);
    }
  }

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      search: e.target.value,
    });
  };

  onUpdateSearch = () => {
    const { search } = this.state;
    if (search) {
      localStorage.setItem('search', search.trim());
      this.props.onUpdateSearch(search);
    }
  };

  render() {
    return (
      <div className="search_container">
        <input
          type="text"
          placeholder="Type something..."
          className="search_field"
          value={this.state.search}
          onChange={this.handleSearchChange}
        ></input>
        <button className="search_button" onClick={this.onUpdateSearch}>
          Search
        </button>
      </div>
    );
  }
}

export default Search;
