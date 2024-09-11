import { render } from '@testing-library/react-native';
import React from 'react';
import CsText from './index';

const testID = 'csText';

describe('CsText', () => {
  test('renders text with correct content', () => {
    const content = 'Hello, World!';
    const { getByText } = render(<CsText>{content}</CsText>);
    const textElement = getByText(content);
    expect(textElement).toBeTruthy();
  });

  test('applies correct styles for different variants', () => {
    const { getByTestId, rerender } = render(<CsText variant="h1">Heading 1</CsText>);
    const text = getByTestId(`${testID}-text`);
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: 32 })])
    );

    rerender(<CsText variant="body">Body text</CsText>);
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ fontSize: 16 })])
    );
  });

  test('applies correct color styles', () => {
    const { getByTestId, rerender } = render(<CsText color="primary">Primary text</CsText>);
    const text = getByTestId(`${testID}-text`);
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: expect.any(String) })])
    );

    rerender(<CsText color="error">Error text</CsText>);
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: expect.any(String) })])
    );
  });

  test('allows custom styles to be applied', () => {
    const customStyle = { marginBottom: 10 };
    const { getByTestId } = render(<CsText style={customStyle}>Custom styled text</CsText>);
    const text = getByTestId(`${testID}-text`);
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)])
    );
  });
});
