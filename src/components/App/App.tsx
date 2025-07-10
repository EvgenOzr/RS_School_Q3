import './App.css';
import Search from '../Search/Search';
import Spinner from '../Spinner/Spinner';
import { Component } from 'react';
import CardList from '../CardList/CardList';

class App extends Component {
  state = {
    data: ['1', '2', '3'],
    apiBase: 'https://swapi.py4e.com/api/people/?search=',
  };

  Introdaction = () => {
    return (
      <div>
        <h3>Welcome to search App(Star Wars)</h3>
        <section>
          <div>
            You can find characters from StarWars, just type in search field.
          </div>
        </section>
      </div>
    );
  };

  onUpdateSearch = async (search: string) => {
    try {
      const getSearh = await fetch(`${this.state.apiBase}${search}`);
      this.setState({ data: getSearh });
    } catch {
    } finally {
    }
  };

  render() {
    return (
      <>
        <h1 className="header">RS School. Task 1</h1>
        <Search onUpdateSearch={this.onUpdateSearch} />
        <CardList searchList={this.state.data} />
        {/* <Introdaction/> */}
        {/* <Spinner/> */}
      </>
    );
  }
}

export default App;
