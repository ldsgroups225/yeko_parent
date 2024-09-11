import translate from '@helpers/localization';
import { useTheme, useThemedStyles } from '@src/hooks';
import { render } from '@testing-library/react-native';
import React from 'react';
import GeneralActivityIndicator from './index';

// Mock the hooks and translation function
jest.mock('@src/hooks', () => ({
  useTheme: jest.fn(),
  useThemedStyles: jest.fn(),
}));
jest.mock('@helpers/localization', () => jest.fn());

const testID = 'generalActivityIndicator';

describe('GeneralActivityIndicator', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({ primary: '#f27a1a' });
    (useThemedStyles as jest.Mock).mockReturnValue({
      activityIndicator: { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
      activityIndicatorText: { color: '#f27a1a', fontSize: 4 },
    });
    (translate as jest.Mock).mockReturnValue('Loading...');
  });

  test('renders activity indicator with correct color', () => {
    const { getByTestId } = render(<GeneralActivityIndicator />);
    const activityIndicator = getByTestId(`${testID}-container-activityIndicator`);
    expect(activityIndicator.props.color).toBe('#f27a1a');
  });

  test('renders activity indicator with correct size', () => {
    const { getByTestId } = render(<GeneralActivityIndicator />);
    const activityIndicator = getByTestId(`${testID}-container-activityIndicator`);
    expect(activityIndicator.props.size).toBe('large');
  });

  test('renders activity indicator text correctly when provided', () => {
    const text = 'Custom loading text';
    const { getByText } = render(<GeneralActivityIndicator text={text} />);
    const textElement = getByText(text);
    expect(textElement).toBeTruthy();
  });

  test('renders default activity indicator text when no text prop is provided', () => {
    const { getByText } = render(<GeneralActivityIndicator />);
    const defaultText = 'Loading...';
    const textElement = getByText(defaultText);
    expect(textElement).toBeTruthy();
  });

  test('applies correct styles to the container', () => {
    const { getByTestId } = render(<GeneralActivityIndicator />);
    const container = getByTestId(`${testID}-container-view`);
    expect(container.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      })
    );
  });

  test('applies correct styles to the text', () => {
    const { getByText } = render(<GeneralActivityIndicator />);
    const textElement = getByText('Loading...');
    expect(textElement.props.style).toEqual(
      expect.objectContaining({
        color: '#f27a1a',
        fontSize: 4,
      })
    );
  });

  test('uses translated text when no custom text is provided', () => {
    (translate as jest.Mock).mockReturnValue('Translated loading text');
    const { getByText } = render(<GeneralActivityIndicator />);
    const textElement = getByText('Translated loading text');
    expect(textElement).toBeTruthy();
  });

  test('renders ActivityIndicator with animating prop set to true', () => {
    const { getByTestId } = render(<GeneralActivityIndicator />);
    const activityIndicator = getByTestId(`${testID}-container-activityIndicator`);
    expect(activityIndicator.props.animating).toBe(true);
  });
});
