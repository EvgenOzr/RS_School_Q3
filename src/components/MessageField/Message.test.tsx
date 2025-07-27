import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageField from './MessageField';
import styles from './MessageField.module.scss';

describe('MessageField Component', () => {
  it('renders with title and text', () => {
    const testTitle = 'Test Title';
    const testText = 'Test message content';

    render(<MessageField title={testTitle} text={testText} />);

    const titleElement = screen.getByText(testTitle);
    const textElement = screen.getByText(testText);

    expect(titleElement).toBeInTheDocument();
    expect(textElement).toBeInTheDocument();

    expect(titleElement).toHaveClass(styles.title);
    expect(textElement).toHaveClass(styles.text);

    const container = screen.getByTestId('message-field');
    expect(container).toHaveClass(styles.field);
  });

  it('renders with empty strings', () => {
    render(<MessageField title="" text="" />);

    const container = screen.getByTestId('message-field');
    expect(container).toBeInTheDocument();

    const titleElement = screen.getByTestId('message-title');
    const textElement = screen.getByTestId('message-text');

    expect(titleElement).toBeEmptyDOMElement();
    expect(textElement).toBeEmptyDOMElement();
  });

  it('renders with HTML content', () => {
    const htmlText = 'Message with <strong>HTML</strong>';

    render(<MessageField title="HTML Test" text={htmlText} />);
    expect(screen.getByText(htmlText)).toBeInTheDocument();
  });
});
