import { useTheme, useThemedStyles } from '@src/hooks';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import CsCard from './index';

jest.mock('@src/hooks', () => ({
  useTheme: jest.fn(),
  useThemedStyles: jest.fn(),
}));

const testID = 'csCard';

describe('CsCard', () => {
  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      card: '#FFFFFF',
      text: '#000000',
      rippleColor: '#00000020',
    });
    (useThemedStyles as jest.Mock).mockReturnValue({
      container: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16 },
      title: { color: '#000000', marginBottom: 8 },
      content: { color: '#000000', marginBottom: 8 },
      footer: { marginTop: 8 },
    });
  });

  test('renders with title and content', () => {
    const { getByText } = render(<CsCard title="Test Title" content="Test Content" />);
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();
  });

  test('renders footer component', () => {
    const { getByTestId } = render(
      <CsCard
        title="Test"
        footer={
          <View testID="footer-component">
            <Text>Footer</Text>
          </View>
        }
      />
    );
    expect(getByTestId('footer-component')).toBeTruthy();
  });

  test('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<CsCard title="Test" onPress={onPressMock} />);
    fireEvent.press(getByTestId(`${testID}-pressable`));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(<CsCard title="Test" style={customStyle} />);
    const container = getByTestId(`${testID}-container`);
    expect(container.props.style).toContainEqual(customStyle);
  });

  test('applies custom title, content, and footer styles', () => {
    const customTitleStyle = { fontSize: 20 };
    const customContentStyle = { fontSize: 14 };
    const customFooterStyle = { backgroundColor: 'lightgray' };
    const { getByText, getByTestId } = render(
      <CsCard
        title="Test Title"
        content="Test Content"
        footer={
          <View testID="footer-component">
            <Text>Footer</Text>
          </View>
        }
        titleStyle={customTitleStyle}
        contentStyle={customContentStyle}
        footerStyle={customFooterStyle}
      />
    );
    const title = getByText('Test Title');
    const content = getByText('Test Content');
    const footer = getByTestId('footer-component');
    expect(title.props.style).toContainEqual(customTitleStyle);
    expect(content.props.style).toContainEqual(customContentStyle);
    expect(footer.props.style).toContainEqual(customFooterStyle);
  });

  test('does not render Pressable when onPress is not provided', () => {
    const { queryByTestId } = render(<CsCard title="Test" />);
    expect(queryByTestId(`${testID}-pressable`)).toBeNull();
  });

  test('renders Pressable when onPress is provided', () => {
    const { getByTestId } = render(<CsCard title="Test" onPress={() => {}} />);
    expect(getByTestId(`${testID}-pressable`)).toBeTruthy();
  });
});
