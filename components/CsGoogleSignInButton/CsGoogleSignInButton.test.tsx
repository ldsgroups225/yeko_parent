import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CsGoogleSignInButton from './index';
import { useGoogleAuthSimple } from '@/hooks/useGoogleAuth';

// Mock the hook
jest.mock('@/hooks/useGoogleAuth', () => ({
  useGoogleAuthSimple: jest.fn(),
}));

// Mock the theme hooks
jest.mock('@/hooks', () => ({
  useTheme: () => ({
    background: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
    rippleColor: 'rgba(0,0,0,0.1)',
    textLight: '#666666',
    backgroundLight: '#f5f5f5',
    shadow: '#000000',
  }),
  useThemedStyles: (styles: any) => styles({
    background: '#ffffff',
    text: '#000000',
    border: '#e0e0e0',
    rippleColor: 'rgba(0,0,0,0.1)',
    textLight: '#666666',
    backgroundLight: '#f5f5f5',
    shadow: '#000000',
  }),
}));

const mockGoogleAuthSimple = useGoogleAuthSimple as jest.MockedFunction<typeof useGoogleAuthSimple>;

describe('CsGoogleSignInButton', () => {
  const defaultMockReturn = {
    googleSignIn: jest.fn(),
    googleSignUp: jest.fn(),
    googleSignOut: jest.fn(),
    isLoading: false,
    error: null,
    clearError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGoogleAuthSimple.mockReturnValue(defaultMockReturn);
  });

  it('renders correctly with default props', () => {
    const { getByTestId } = render(<CsGoogleSignInButton />);
    
    expect(getByTestId('csGoogleSignInButton-pressable')).toBeTruthy();
    expect(getByTestId('csGoogleSignInButton-text')).toBeTruthy();
  });

  it('displays correct text for signin mode', () => {
    const { getByText } = render(<CsGoogleSignInButton mode="signin" />);
    
    expect(getByText('Se connecter avec Google')).toBeTruthy();
  });

  it('displays correct text for signup mode', () => {
    const { getByText } = render(<CsGoogleSignInButton mode="signup" />);
    
    expect(getByText('S\'inscrire avec Google')).toBeTruthy();
  });

  it('calls googleSignIn when mode is signin', async () => {
    const mockGoogleSignIn = jest.fn().mockResolvedValue(undefined);
    mockGoogleAuthSimple.mockReturnValue({
      ...defaultMockReturn,
      googleSignIn: mockGoogleSignIn,
    });

    const { getByTestId } = render(<CsGoogleSignInButton mode="signin" />);
    
    fireEvent.press(getByTestId('csGoogleSignInButton-pressable'));
    
    await waitFor(() => {
      expect(mockGoogleSignIn).toHaveBeenCalledTimes(1);
    });
  });

  it('calls googleSignUp when mode is signup', async () => {
    const mockGoogleSignUp = jest.fn().mockResolvedValue(undefined);
    mockGoogleAuthSimple.mockReturnValue({
      ...defaultMockReturn,
      googleSignUp: mockGoogleSignUp,
    });

    const { getByTestId } = render(<CsGoogleSignInButton mode="signup" />);
    
    fireEvent.press(getByTestId('csGoogleSignInButton-pressable'));
    
    await waitFor(() => {
      expect(mockGoogleSignUp).toHaveBeenCalledTimes(1);
    });
  });

  it('calls custom onPress when provided', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<CsGoogleSignInButton onPress={mockOnPress} />);
    
    fireEvent.press(getByTestId('csGoogleSignInButton-pressable'));
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when isLoading is true', () => {
    mockGoogleAuthSimple.mockReturnValue({
      ...defaultMockReturn,
      isLoading: true,
    });

    const { getByTestId } = render(<CsGoogleSignInButton />);
    
    expect(getByTestId('csGoogleSignInButton-loading')).toBeTruthy();
  });

  it('shows loading state when loading prop is true', () => {
    const { getByTestId } = render(<CsGoogleSignInButton loading={true} />);
    
    expect(getByTestId('csGoogleSignInButton-loading')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<CsGoogleSignInButton onPress={mockOnPress} disabled={true} />);
    
    const button = getByTestId('csGoogleSignInButton-pressable');
    fireEvent.press(button);
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('calls onAuthAttempt callback on successful auth', async () => {
    const mockOnAuthAttempt = jest.fn();
    const mockGoogleSignIn = jest.fn().mockResolvedValue(undefined);
    
    mockGoogleAuthSimple.mockReturnValue({
      ...defaultMockReturn,
      googleSignIn: mockGoogleSignIn,
    });

    const { getByTestId } = render(
      <CsGoogleSignInButton mode="signin" onAuthAttempt={mockOnAuthAttempt} />
    );
    
    fireEvent.press(getByTestId('csGoogleSignInButton-pressable'));
    
    await waitFor(() => {
      expect(mockOnAuthAttempt).toHaveBeenCalledWith(true);
    });
  });

  it('calls onAuthAttempt callback on failed auth', async () => {
    const mockOnAuthAttempt = jest.fn();
    const mockGoogleSignIn = jest.fn().mockRejectedValue(new Error('Auth failed'));
    
    mockGoogleAuthSimple.mockReturnValue({
      ...defaultMockReturn,
      googleSignIn: mockGoogleSignIn,
    });

    const { getByTestId } = render(
      <CsGoogleSignInButton mode="signin" onAuthAttempt={mockOnAuthAttempt} />
    );
    
    fireEvent.press(getByTestId('csGoogleSignInButton-pressable'));
    
    await waitFor(() => {
      expect(mockOnAuthAttempt).toHaveBeenCalledWith(false);
    });
  });

  it('applies custom styles correctly', () => {
    const customStyle = { backgroundColor: 'red' };
    const customTextStyle = { color: 'blue' };
    
    const { getByTestId } = render(
      <CsGoogleSignInButton style={customStyle} textStyle={customTextStyle} />
    );
    
    const button = getByTestId('csGoogleSignInButton-pressable');
    const text = getByTestId('csGoogleSignInButton-text');
    
    expect(button.props.style).toEqual(expect.arrayContaining([
      expect.objectContaining(customStyle)
    ]));
    expect(text.props.style).toEqual(expect.arrayContaining([
      expect.objectContaining(customTextStyle)
    ]));
  });
});
