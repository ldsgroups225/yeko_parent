import { useTheme, useThemedStyles } from '@src/hooks';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import CsListTile from './index';

jest.mock('@src/hooks', () => ({
  useTheme: jest.fn(),
  useThemedStyles: jest.fn(),
}));

const testID = 'csListTile';

describe('CsListTile', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      card: '#FFFFFF',
      text: '#000000',
      textLight: '#666666',
    });
    (useThemedStyles as jest.Mock).mockReturnValue({
      container: { backgroundColor: '#FFFFFF', borderRadius: 8 },
      contentContainer: { marginLeft: 16 },
      title: { color: '#000000', marginBottom: 4 },
      subtitle: { color: '#666666' },
      trailing: { marginLeft: 16 },
      dense: { paddingVertical: 8 },
      pressable: { opacity: 0.7 },
    });
  });

  test('renders with title and subtitle', () => {
    const { getByText } = render(<CsListTile title="Test Title" subtitle="Test Subtitle" />);
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Subtitle')).toBeTruthy();
  });

  test('renders leading and trailing components', () => {
    const { getByTestId } = render(
      <CsListTile
        title="Test"
        leading={<View testID="leading-component" />}
        trailing={<View testID="trailing-component" />}
      />
    );
    expect(getByTestId('leading-component')).toBeTruthy();
    expect(getByTestId('trailing-component')).toBeTruthy();
  });

  test('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<CsListTile title="Test" onPress={onPressMock} />);
    fireEvent.press(getByTestId(`${testID}-pressable`));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('applies dense style when dense prop is true', () => {
    const { getByTestId } = render(<CsListTile title="Test" dense />);
    const container = getByTestId(`${testID}-container`);
    expect(container.props.style).toContainEqual({ paddingVertical: 8 });
  });

  test('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(<CsListTile title="Test" style={customStyle} />);
    const container = getByTestId(`${testID}-container`);
    expect(container.props.style).toContainEqual(customStyle);
  });

  test('applies custom title and subtitle styles', () => {
    const customTitleStyle = { fontSize: 20 };
    const customSubtitleStyle = { fontSize: 14 };
    const { getByText } = render(
      <CsListTile
        title="Test Title"
        subtitle="Test Subtitle"
        titleStyle={customTitleStyle}
        subtitleStyle={customSubtitleStyle}
      />
    );
    const title = getByText('Test Title');
    const subtitle = getByText('Test Subtitle');
    expect(title.props.style).toContainEqual(customTitleStyle);
    expect(subtitle.props.style).toContainEqual(customSubtitleStyle);
  });

  test('does not render Pressable when onPress is not provided', () => {
    const { queryByTestId } = render(<CsListTile title="Test" />);
    expect(queryByTestId(`${testID}-pressable`)).toBeNull();
  });

  test('renders Pressable when onPress is provided', () => {
    const { getByTestId } = render(<CsListTile title="Test" onPress={() => {}} />);
    expect(getByTestId(`${testID}-pressable`)).toBeTruthy();
  });

  //   test('applies correct styles to Pressable and passes onPress', () => {
  //     const onPressMock = jest.fn();
  //     const { getByTestId } = render(
  //       <CsListTile title="Test" onPress={onPressMock} />
  //     );
  //     const pressable = getByTestId(`${testID}-pressable`);

  //     expect(pressable.props.style).toBeDefined();
  //     expect(typeof pressable.props.style).toBe('object');
  //     expect(pressable.props.style).toEqual(expect.objectContaining({ opacity: 0.7 }));

  //     expect(pressable.props.onPress).toBeDefined();
  //     expect(pressable.props.onPress).toBe(onPressMock);

  //     fireEvent.press(pressable);
  //     expect(onPressMock).toHaveBeenCalledTimes(1);
  //   });
});
