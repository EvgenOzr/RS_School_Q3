import { Component } from 'react';
import type { messageProps } from '../types/types';
import './MessageField.css';

class MessageField extends Component<messageProps> {
    render() {
        return (
            <div className='message_field'>
                <h3 className="message_title">{this.props.title}</h3>
                <div className="message_text">{this.props.text}</div>
            </div>
        );
    }
}

export default MessageField;