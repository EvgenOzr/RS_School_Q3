import './App.css';
import Search from '../Search/Search';
import Spinner from '../Spinner/Spinner';
import { Component } from 'react';
import CardList from '../CardList/CardList';
import type { appState, swcharacter } from '../types/types';
import Row from '../Row/Row';
import Card from '../Card/Card';

class App extends Component<appState> {
  state = {
    data: [],
    loading: false,
    itemSelected: null,
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
      console.log(search);
      this.setState({ loading: true });
      const getSearch = await fetch(`${this.state.apiBase}${search}`);
      console.log(getSearch);

      if (!getSearch.ok) {
        throw new Error('Error in search response');
      }
      const data = await getSearch.json();
      console.log(data);

      this.setState({ data: data.results, loading: false });
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ data: [], loading: false });
    }
  };

  onItemSelected = (character: swcharacter) => {
    this.setState({ itemSelected: character });
  };

  render() {
    return (
      <>
        <h1 className="header">RS School. Task 1</h1>
        <Search onUpdateSearch={this.onUpdateSearch} />
        {this.state.data.length === 0 && <this.Introdaction />}
        {!this.state.loading && this.state.data.length > 0 && (
          <Row
            left={
              <CardList
                data={this.state.data}
                onItemSelected={this.onItemSelected}
              />
            }
            right={
              this.state.itemSelected && <Card card={this.state.itemSelected} />
            }
          />
        )}
        {this.state.loading && <Spinner />}
      </>
    );
  }
}

export default App;
