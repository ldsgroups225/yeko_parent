import { useTheme, useThemedStyles } from '@src/hooks';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import CsButton from './index';

// Mock the hooks
jest.mock('@src/hooks', () => ({
  useTheme: jest.fn(),
  useThemedStyles: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn(),
    withSequence: jest.fn(),
    runOnJS: jest.fn((fn) => fn),
  };
});

const testID = 'csButton';

describe('CsButton', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      primary: '#007AFF',
      background: '#FFFFFF',
      textLight: '#FFFFFF',
      rippleColor: 'rgba(0,0,0,0.1)',
    });
    (useThemedStyles as jest.Mock).mockReturnValue({
      button: { borderRadius: 8 },
      buttonprimary: { backgroundColor: '#007AFF' },
      buttonsecondary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#007AFF' },
      buttontext: { backgroundColor: 'transparent' },
      buttonsmall: { paddingVertical: 8, paddingHorizontal: 16 },
      buttonmedium: { paddingVertical: 12, paddingHorizontal: 24 },
      buttonlarge: { paddingVertical: 16, paddingHorizontal: 32 },
      buttonDisabled: { opacity: 0.5 },
      buttonText: { color: '#FFFFFF' },
      textprimary: { color: '#FFFFFF' },
      textsecondary: { color: '#007AFF' },
      textmedium: { fontSize: 16 },
      icon: { marginRight: 8 },
    });
  });

  test('renders button with correct title', () => {
    const title = 'Press me';
    const { getByText } = render(<CsButton title={title} onPress={() => {}} />);
    const buttonText = getByText(title);
    expect(buttonText).toBeTruthy();
  });

  test('calls onPress when button is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<CsButton title="Press me" onPress={onPressMock} />);
    const button = getByTestId(`${testID}-pressable`);
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('applies disabled style when button is disabled', () => {
    const { getByTestId } = render(
      <CsButton title="Press me" onPress={() => {}} disabled={true} />
    );
    const button = getByTestId(`${testID}-pressable`);
    expect(button.props.accessibilityState.disabled).toBe(true);
    expect(button.props.style[0]).toContainEqual({ opacity: 0.5 });
  });

  test('shows loading indicator when loading prop is true', () => {
    const { getByTestId, queryByTestId } = render(
      <CsButton title="Press me" onPress={() => {}} loading={true} />
    );
    const loadingIndicator = getByTestId(`${testID}-loading`);
    const buttonText = queryByTestId(`${testID}-text`);
    expect(loadingIndicator).toBeTruthy();
    expect(buttonText).toBeNull();
  });

  test('applies correct styles for different variants', () => {
    const { getByTestId, rerender } = render(
      <CsButton title="Press me" onPress={() => {}} variant="primary" />
    );
    let button = getByTestId(`${testID}-pressable`);
    expect(button.props.style[0]).toContainEqual({ backgroundColor: '#007AFF' });

    rerender(<CsButton title="Press me" onPress={() => {}} variant="secondary" />);
    button = getByTestId(`${testID}-pressable`);
    expect(button.props.style[0]).toContainEqual({
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#007AFF',
    });

    rerender(<CsButton title="Press me" onPress={() => {}} variant="text" />);
    button = getByTestId(`${testID}-pressable`);
    expect(button.props.style[0]).toContainEqual({ backgroundColor: 'transparent' });
  });

  test('applies correct styles for different sizes', () => {
    const { getByTestId, rerender } = render(
      <CsButton title="Press me" onPress={() => {}} size="small" />
    );
    let button = getByTestId(`${testID}-pressable`);
    expect(button.props.style[0]).toContainEqual({ paddingVertical: 8, paddingHorizontal: 16 });

    rerender(<CsButton title="Press me" onPress={() => {}} size="medium" />);
    button = getByTestId(`${testID}-pressable`);
    expect(button.props.style[0]).toContainEqual({ paddingVertical: 12, paddingHorizontal: 24 });

    rerender(<CsButton title="Press me" onPress={() => {}} size="large" />);
    button = getByTestId(`${testID}-pressable`);
    expect(button.props.style[0]).toContainEqual({ paddingVertical: 16, paddingHorizontal: 32 });
  });

  test('renders icon when provided', () => {
    const TestIcon = () => <View testID="test-icon" />;
    const { getByTestId } = render(
      <CsButton title="Press me" onPress={() => {}} icon={<TestIcon />} />
    );
    const icon = getByTestId('test-icon');
    expect(icon).toBeTruthy();
  });

  test('applies custom styles when provided', () => {
    const customStyle = { backgroundColor: 'red' };
    const customTextStyle = { color: 'green' };
    const { getByTestId } = render(
      <CsButton
        title="Press me"
        onPress={() => {}}
        style={customStyle}
        textStyle={customTextStyle}
      />
    );
    const button = getByTestId(`${testID}-pressable`);
    const buttonText = getByTestId(`${testID}-text`);
    expect(button.props.style[0]).toContainEqual(customStyle);
    expect(buttonText.props.style).toContainEqual(customTextStyle);
  });

  test('handles press animations without errors', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<CsButton title="Press me" onPress={onPressMock} />);
    const button = getByTestId(`${testID}-pressable`);

    // Simulate press events
    expect(() => {
      fireEvent(button, 'pressIn');
      fireEvent(button, 'pressOut');
      fireEvent.press(button);
    }).not.toThrow();

    // Verify that onPress was called
    expect(onPressMock).toHaveBeenCalled();
  });
});
