import { Component, type ReactNode } from 'react';
import './Spinner.css';

class Spinner extends Component {
  render() {
    return (
      <div className="lds-css">
        <div className="lds-double-ring">
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}

export default Spinner;
