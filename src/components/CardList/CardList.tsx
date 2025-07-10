import { Component } from 'react';

class CardList extends Component {
  render() {
    return (
      <div>
        {/* {this.props.data.map(() => {
                    return (
                        <li className={`list-group-item ${theme}`}
                        key={id}
                        onClick = {() => onItemSelected(id)}>
                        <input type="checkbox" data-id={idx} className="checkItem" onChange={onChecked} checked={chekedValue}/>
                        {title}
                    </li>
                    )
                })} */}
      </div>
    );
  }
}

export default CardList;
