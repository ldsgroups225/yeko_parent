import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '@src/hooks';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from './style';
import { CsTextFieldProps } from './type';

const testID = 'csTextfield';

const CsTextField: React.FC<CsTextFieldProps> = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  inputStyle,
  autoCapitalize = 'none',
  returnKeyType = 'next',
  ...textInputProps
}) => {
  const theme = useTheme();
  const themedStyles = useThemedStyles<typeof styles>(styles);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={style}>
      <View style={themedStyles.inputContainer}>
        {leftIcon && <View style={themedStyles.iconContainer}>{leftIcon}</View>}
        <TextInput
          testID={`${testID}-input`}
          style={[
            themedStyles.input,
            error != null && error.length > 0 && themedStyles.inputError,
            disabled && themedStyles.inputDisabled,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={label}
          placeholderTextColor={theme.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onFocus={() => {}}
          onBlur={() => {}}
          {...textInputProps}
        />
        {secureTextEntry && (
          <Pressable
            testID={`${testID}-toggle-password`}
            onPress={togglePasswordVisibility}
            style={themedStyles.iconContainer}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color={theme.textLight}
            />
          </Pressable>
        )}
        {rightIcon && !secureTextEntry && (
          <View style={themedStyles.iconContainer}>{rightIcon}</View>
        )}
      </View>
      {error && <Text style={themedStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default CsTextField;
