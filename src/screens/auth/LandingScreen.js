import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const { theme, isDark } = useTheme();

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#16213e'] : [theme.primary, '#8B5FBF']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.appName}>MoraShelf</Text>
          <Text style={styles.tagline}>Your Personal Library, Reimagined</Text>
          <Text style={styles.subtitle}>
            Discover, organize, and cherish your favorite books all in one place
          </Text>
        </View>
        
        {/* Decorative Book Illustration */}
        <View style={styles.bookIllustration}>
          <View style={[styles.book, { backgroundColor: '#FFD93D' }]} />
          <View style={[styles.book, { backgroundColor: '#6BCB77', transform: [{ rotate: '5deg' }] }]} />
          <View style={[styles.book, { backgroundColor: '#FF6B6B', transform: [{ rotate: '-5deg' }] }]} />
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Why MoraShelf?</Text>
        
        <View style={styles.featureCard}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Text style={styles.iconEmoji}>📚</Text>
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Vast Collection</Text>
            <Text style={[styles.featureDescription, { color: theme.textSub }]}>
              Access millions of books from OpenLibrary's extensive database
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Text style={styles.iconEmoji}>❤️</Text>
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Save Favorites</Text>
            <Text style={[styles.featureDescription, { color: theme.textSub }]}>
              Keep track of books you love and want to read later
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Text style={styles.iconEmoji}>📝</Text>
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Take Notes</Text>
            <Text style={[styles.featureDescription, { color: theme.textSub }]}>
              Capture your thoughts and insights as you read
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.iconCircle, { backgroundColor: isDark ? '#2C2C2C' : '#F5F5F5' }]}>
            <Text style={styles.iconEmoji}>🎨</Text>
          </View>
          <View style={styles.featureText}>
            <Text style={[styles.featureTitle, { color: theme.text }]}>Beautiful Design</Text>
            <Text style={[styles.featureDescription, { color: theme.textSub }]}>
              Elegant interface with dark mode support for comfortable reading
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.8}
        >
          <Text style={[styles.primaryButtonText, { color: isDark ? '#000' : '#FFF' }]}>
            Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.primary }]}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>
            Sign In
          </Text>
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: theme.textSub }]}>
          Join thousands of readers worldwide
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: height * 0.5,
    justifyContent: 'center',
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bookIllustration: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  book: {
    width: 60,
    height: 80,
    borderRadius: 4,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconEmoji: {
    fontSize: 28,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 48,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 24,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
  },
});
