import { Component } from 'react';
import './Card.css';
import type { cardProps } from '../types/types';

class Card extends Component<cardProps> {
  render() {
    return (
      <div className="item">
        <div className="item_field">Name - {this.props.card.name}</div>
        <div className="item_field">
          Birth year - {this.props.card.birth_year}
        </div>
        <div className="item_field">Height - {this.props.card.height}</div>
        <div className="item_field">Gender - {this.props.card.gender}</div>
        <div className="item_field">
          Eye color - {this.props.card.eye_color}
        </div>
        <div className="item_field">Mass - {this.props.card.mass}</div>
      </div>
    );
  }
}

export default Card;
