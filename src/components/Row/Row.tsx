import { Component } from 'react';
import type { rowProps } from '../types/types';
import './Row.css';

class Row extends Component<rowProps> {
  render() {
    return (
      <div className="row">
        <div className="">{this.props.left}</div>
        <div className="">{this.props.right}</div>
      </div>
    );
  }
}

export default Row;
