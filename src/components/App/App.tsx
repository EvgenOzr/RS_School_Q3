import './App.css';
import Search from '../Search/Search';
import Spinner from '../Spinner/Spinner';
import { Component } from 'react';
import CardList from '../CardList/CardList';
import type { appState, swcharacter } from '../types/types';
import Row from '../Row/Row';
import Card from '../Card/Card';
import MessageField from '../MessageField/MessageField';

class App extends Component<object, appState> {
  state = {
    data: [],
    loading: false,
    hasError: false,
    noResults: false,
    itemSelected: null,
    apiBase: 'https://swapi.py4e.com/api/people/?search=',
    charactersApiBase: 'https://swapi.py4e.com/api/people/',
  };

  onUpdateSearch = async (search: string) => {
    try {
      this.setState({ loading: true, itemSelected: null });
      const api = search ? this.state.apiBase : this.state.charactersApiBase;
      const getSearch = await fetch(`${api}${search}`);
      if (!getSearch.ok) {
        throw new Error('Error in search response');
      }
      const data = await getSearch.json();
      if (data.results.length > 0) {
        this.setState({ data: data.results, noResults: false, loading: false });
      } else {
        this.setState({ data: data.results, noResults: true, loading: false });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ data: [], loading: false });
    }
  };

  onItemSelected = (character: swcharacter) => {
    this.setState({ itemSelected: character });
  };

  triggerError = () => {
    this.setState({ hasError: true });
  };

  render() {
    if (this.state.hasError) {
      throw new Error('Это тестовая ошибка из компонента App!');
    }
    return (
      <>
        <h1 className="header">RS School. Task 1</h1>
        <Search onUpdateSearch={this.onUpdateSearch} />
        {this.state.data.length === 0 && !this.state.noResults && (
          <MessageField
            title={'Welcome to search App(Star Wars)'}
            text={
              'You can find characters from StarWars, just type in search field.'
            }
          />
        )}
        {this.state.noResults && (
          <MessageField title={'Sorry'} text={'Nothing found!'} />
        )}
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
        <button className="triggerButton" onClick={this.triggerError}>
          Throw Error
        </button>
      </>
    );
  }
}

export default App;
