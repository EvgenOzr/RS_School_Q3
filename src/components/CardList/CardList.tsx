import { Component } from 'react';
import type { cardListProps } from '../types/types';
import './CardList.css';

class CardList extends Component<cardListProps> {
  render() {
    return (
      <div className="card_list">
        {this.props.data &&
          this.props.data.map((item, idx) => {
            return (
              <div
                className={`card_list_item`}
                key={idx}
                onClick={() => this.props.onItemSelected(item)}
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
