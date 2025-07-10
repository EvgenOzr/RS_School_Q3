import { Component } from 'react';
import type { cardListProps } from '../types/types';
import './CardList.css';

class CardList extends Component<cardListProps> {
  render() {
    console.log(this.props.data);

    return (
      <div className="search_list">
        {this.props.data &&
          this.props.data.map((item, idx) => {
            const match = item.url.match(/\/(\d+)\/$/);
            const id = match ? match[1] : null;
            return (
              <div
                className={`search_list_item`}
                key={idx}
                onClick={() => id && this.props.onItemSelected(item)}
              >
                {item.name}
              </div>
            );
          })}
      </div>
    );
  }
}

export default CardList;
