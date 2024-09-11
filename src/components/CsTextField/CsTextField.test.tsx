import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import CsTextField from './index';

const testID = 'csTextfield';

describe('CsTextField', () => {
  const defaultProps = {
    label: 'Test Label',
    value: '',
    onChangeText: jest.fn(),
  };

  test('renders correctly with label', () => {
    const { getByText } = render(<CsTextField {...defaultProps} />);
    expect(getByText('Test Label')).toBeTruthy();
  });

  test('handles text input correctly', () => {
    const { getByTestId } = render(<CsTextField {...defaultProps} />);
    const input = getByTestId(`${testID}-input`);
    fireEvent.changeText(input, 'New Value');
    expect(defaultProps.onChangeText).toHaveBeenCalledWith('New Value');
  });

  test('displays error message when provided', () => {
    const { getByText } = render(<CsTextField {...defaultProps} error="Error message" />);
    expect(getByText('Error message')).toBeTruthy();
  });

  test('applies disabled style when disabled prop is true', () => {
    const { getByTestId } = render(<CsTextField {...defaultProps} disabled />);
    const input = getByTestId(`${testID}-input`);
    expect(input.props.editable).toBe(false);
  });

  test('toggles password visibility when secureTextEntry is true', () => {
    const { getByTestId } = render(<CsTextField {...defaultProps} secureTextEntry />);
    const toggleButton = getByTestId(`${testID}-toggle-password`);
    const input = getByTestId(`${testID}-input`);

    expect(input.props.secureTextEntry).toBe(true);
    fireEvent.press(toggleButton);
    expect(input.props.secureTextEntry).toBe(false);
  });
});
