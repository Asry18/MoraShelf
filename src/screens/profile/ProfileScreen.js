import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { logoutUser } from '../../store/slices/authSlice';

export default function ProfileScreen({ navigation }) {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logoutUser());
          },
        },
      ]
    );
  };

  const ProfileItem = ({ icon, label, value, onPress, showArrow = false, danger = false }) => (
    <TouchableOpacity
      style={[styles.profileItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <Feather 
          name={icon} 
          size={20} 
          color={danger ? theme.error : theme.primary} 
          style={styles.profileIcon}
        />
        <View style={styles.profileItemText}>
          <Text style={[styles.profileLabel, { color: theme.text }]}>{label}</Text>
          {value && <Text style={[styles.profileValue, { color: theme.textSub }]}>{value}</Text>}
        </View>
      </View>
      {showArrow && (
        <Feather name="chevron-right" size={20} color={theme.textSub} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </Text>
        </View>
        <Text style={[styles.userName, { color: theme.text }]}>
          {user?.name || 'Student'}
        </Text>
        <Text style={[styles.userEmail, { color: theme.textSub }]}>
          {user?.email || 'student@uom.lk'}
        </Text>
      </View>

      {/* Profile Items */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSub }]}>ACCOUNT</Text>
        <ProfileItem
          icon="mail"
          label="Email"
          value={user?.email || 'Not set'}
          showArrow={false}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSub }]}>SETTINGS</Text>
        <ProfileItem
          icon={isDark ? "sun" : "moon"}
          label="Dark Mode"
          value={isDark ? "Enabled" : "Disabled"}
          onPress={toggleTheme}
          showArrow={true}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSub }]}>ABOUT</Text>
        <ProfileItem
          icon="info"
          label="App Version"
          value="1.0.0"
          showArrow={false}
        />
        <ProfileItem
          icon="book-open"
          label="MoraShelf"
          value="Your academic resource companion"
          showArrow={false}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.error + '20', borderColor: theme.error }]}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={20} color={theme.error} style={styles.logoutIcon} />
        <Text style={[styles.logoutText, { color: theme.error }]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileIcon: {
    marginRight: 12,
  },
  profileItemText: {
    flex: 1,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileValue: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

