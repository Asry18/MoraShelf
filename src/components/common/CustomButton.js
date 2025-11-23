import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export default function CustomButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon: Icon,
  iconPosition = 'left'
}) {
  const { theme, isDark } = useTheme();
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          borderColor: theme.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primary,
        };
      case 'danger':
        return {
          backgroundColor: theme.error,
          borderColor: theme.error,
        };
      default:
        return {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return theme.primary;
    }
    if (variant === 'danger') {
      return '#FFFFFF';
    }
    // Primary and secondary - use appropriate text color based on dark mode
    return isDark && variant === 'primary' ? '#000' : '#FFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon style={styles.iconLeft} size={18} color={getTextColor()} />
          )}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
          {Icon && iconPosition === 'right' && (
            <Icon style={styles.iconRight} size={18} color={getTextColor()} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

