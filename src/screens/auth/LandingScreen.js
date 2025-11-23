import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import ThemeToggle from '../../components/common/ThemeToggle';

const { width, height } = Dimensions.get('window');

const FeatureCard = ({ icon, title, description, theme, isDark, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featureCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={isDark ? ['#2a2a3e', '#1f1f2e'] : ['#ffffff', '#f8f9fa']}
        style={styles.featureCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
          <Text style={styles.iconEmoji}>{icon}</Text>
        </View>
        <View style={styles.featureText}>
          <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.featureDescription, { color: theme.textSub }]}>
            {description}
          </Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const ReviewCard = ({ name, role, review, rating, theme, isDark, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.reviewCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={isDark ? ['#2a2a3e', '#1f1f2e'] : ['#ffffff', '#f8f9fa']}
        style={styles.reviewCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.reviewHeader}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primary + '20' }]}>
            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
          </View>
          <View style={styles.reviewerInfo}>
            <Text style={[styles.reviewerName, { color: theme.text }]}>{name}</Text>
            <Text style={[styles.reviewerRole, { color: theme.textSub }]}>{role}</Text>
          </View>
        </View>
        
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Text key={index} style={styles.star}>
              {index < rating ? '⭐' : '☆'}
            </Text>
          ))}
        </View>
        
        <Text style={[styles.reviewText, { color: theme.text }]}>
          "{review}"
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

const FloatingBook = ({ color, delay, duration, startY }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -20,
            duration: duration,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: duration * 2,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: duration * 2,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-3deg', '3deg'],
  });

  return (
    <Animated.View
      style={[
        styles.book,
        {
          backgroundColor: color,
          transform: [
            { translateY: Animated.add(floatAnim, startY) },
            { rotate: rotate },
          ],
        },
      ]}
    />
  );
};

export default function LandingScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const headerAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Book Enthusiast",
      review: "MoraShelf has completely transformed how I organize my reading list. The interface is beautiful and so easy to use!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Student",
      review: "As a student, I love being able to take notes on books directly in the app. It's made my research so much easier.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Librarian",
      review: "The vast collection of books available is impressive. I've discovered so many amazing reads I wouldn't have found otherwise.",
      rating: 5
    },
    {
      name: "David Kumar",
      role: "Avid Reader",
      review: "The dark mode is perfect for late-night reading sessions. This app really understands what readers need!",
      rating: 4
    }
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <LinearGradient
        colors={isDark 
          ? ['#1a1a2e', '#16213e', '#0f3460'] 
          : [theme.primary, '#8B5FBF', '#6B46C1']
        }
        style={styles.heroSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated Background Elements */}
        <View style={styles.backgroundDecorations}>
          <View style={[styles.circle, styles.circle1, { opacity: 0.1 }]} />
          <View style={[styles.circle, styles.circle2, { opacity: 0.08 }]} />
          <View style={[styles.circle, styles.circle3, { opacity: 0.06 }]} />
        </View>

        <Animated.View
          style={[
            styles.heroContent,
            {
              opacity: headerAnim,
              transform: [
                {
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.appName}>📚 MoraShelf</Text>
          <Text style={styles.tagline}>Your Personal Library, Reimagined</Text>
          <Text style={styles.subtitle}>
            Discover, organize, and cherish your favorite books all in one place
          </Text>
        </Animated.View>
        
        {/* Animated Book Illustration */}
        <View style={styles.bookIllustration}>
          <FloatingBook color="#FFD93D" delay={0} duration={2000} startY={0} />
          <FloatingBook color="#6BCB77" delay={200} duration={2200} startY={5} />
          <FloatingBook color="#FF6B6B" delay={400} duration={1800} startY={-5} />
          <FloatingBook color="#4ECDC4" delay={100} duration={2100} startY={8} />
        </View>

        {/* CTA Buttons in Hero */}
        <Animated.View
          style={[
            styles.heroCtaSection,
            {
              opacity: buttonAnim,
              transform: [
                {
                  translateY: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.heroPrimaryButton}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <View style={styles.heroButtonContent}>
              <Text style={styles.heroPrimaryButtonText}>
                Get Started Free →
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heroSecondaryButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <Text style={styles.heroSecondaryButtonText}>
              Sign In
            </Text>
          </TouchableOpacity>

          <Text style={styles.heroFooterText}>
            ✨ Join thousands of readers worldwide
          </Text>
        </Animated.View>

        {/* Wave Decoration */}
        <View style={styles.waveContainer}>
          <View style={[styles.wave, { backgroundColor: theme.background }]} />
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Why MoraShelf?
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSub }]}>
          Everything you need for your reading journey
        </Text>
        
        <FeatureCard
          icon="📚"
          title="Vast Collection"
          description="Access millions of books from OpenLibrary's extensive database"
          theme={theme}
          isDark={isDark}
          delay={0}
        />

        <FeatureCard
          icon="❤️"
          title="Save Favorites"
          description="Keep track of books you love and want to read later"
          theme={theme}
          isDark={isDark}
          delay={100}
        />

        <FeatureCard
          icon="📝"
          title="Take Notes"
          description="Capture your thoughts and insights as you read"
          theme={theme}
          isDark={isDark}
          delay={200}
        />

        <FeatureCard
          icon="🎨"
          title="Beautiful Design"
          description="Elegant interface with dark mode support for comfortable reading"
          theme={theme}
          isDark={isDark}
          delay={300}
        />
      </View>

      {/* Stats Section */}
      <View style={[styles.statsSection, { backgroundColor: isDark ? '#1a1a2e' : '#f8f9fa' }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>10M+</Text>
          <Text style={[styles.statLabel, { color: theme.textSub }]}>Books</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>50K+</Text>
          <Text style={[styles.statLabel, { color: theme.textSub }]}>Readers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>4.8★</Text>
          <Text style={[styles.statLabel, { color: theme.textSub }]}>Rating</Text>
        </View>
      </View>

      {/* Reviews Section */}
      <View style={styles.reviewsSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          What Our Readers Say
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSub }]}>
          Join thousands of satisfied book lovers
        </Text>

        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            name={review.name}
            role={review.role}
            review={review.review}
            rating={review.rating}
            theme={theme}
            isDark={isDark}
            delay={index * 100}
          />
        ))}

        {/* Overall Rating Summary */}
        <View style={[styles.ratingSummary, { 
          backgroundColor: isDark ? '#2a2a3e' : '#ffffff',
          borderColor: theme.border 
        }]}>
          <View style={styles.ratingLeft}>
            <Text style={[styles.ratingBigNumber, { color: theme.primary }]}>4.8</Text>
            <View style={styles.ratingStars}>
              <Text style={styles.star}>⭐⭐⭐⭐⭐</Text>
            </View>
            <Text style={[styles.ratingCount, { color: theme.textSub }]}>
              Based on 2,500+ reviews
            </Text>
          </View>
          <View style={styles.ratingRight}>
            <View style={styles.ratingBar}>
              <Text style={[styles.ratingLabel, { color: theme.text }]}>5★</Text>
              <View style={[styles.ratingBarBg, { backgroundColor: theme.border }]}>
                <View style={[styles.ratingBarFill, { backgroundColor: theme.primary, width: '85%' }]} />
              </View>
              <Text style={[styles.ratingPercent, { color: theme.textSub }]}>85%</Text>
            </View>
            <View style={styles.ratingBar}>
              <Text style={[styles.ratingLabel, { color: theme.text }]}>4★</Text>
              <View style={[styles.ratingBarBg, { backgroundColor: theme.border }]}>
                <View style={[styles.ratingBarFill, { backgroundColor: theme.primary, width: '12%' }]} />
              </View>
              <Text style={[styles.ratingPercent, { color: theme.textSub }]}>12%</Text>
            </View>
            <View style={styles.ratingBar}>
              <Text style={[styles.ratingLabel, { color: theme.text }]}>3★</Text>
              <View style={[styles.ratingBarBg, { backgroundColor: theme.border }]}>
                <View style={[styles.ratingBarFill, { backgroundColor: theme.primary, width: '2%' }]} />
              </View>
              <Text style={[styles.ratingPercent, { color: theme.textSub }]}>2%</Text>
            </View>
            <View style={styles.ratingBar}>
              <Text style={[styles.ratingLabel, { color: theme.text }]}>2★</Text>
              <View style={[styles.ratingBarBg, { backgroundColor: theme.border }]}>
                <View style={[styles.ratingBarFill, { backgroundColor: theme.primary, width: '1%' }]} />
              </View>
              <Text style={[styles.ratingPercent, { color: theme.textSub }]}>1%</Text>
            </View>
            <View style={styles.ratingBar}>
              <Text style={[styles.ratingLabel, { color: theme.text }]}>1★</Text>
              <View style={[styles.ratingBarBg, { backgroundColor: theme.border }]}>
                <View style={[styles.ratingBarFill, { backgroundColor: theme.primary, width: '0%' }]} />
              </View>
              <Text style={[styles.ratingPercent, { color: theme.textSub }]}>0%</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom CTA Section */}
      <View style={styles.bottomCtaSection}>
        <Text style={[styles.bottomCtaTitle, { color: theme.text }]}>
          Ready to Start Your Reading Journey?
        </Text>
        <Text style={[styles.bottomCtaSubtitle, { color: theme.textSub }]}>
          Create your free account today
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isDark ? ['#9D4EDD', '#7B2CBF'] : [theme.primary, '#8B5FBF']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.primaryButtonText}>
              Get Started Free →
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { 
            borderColor: theme.primary,
            backgroundColor: isDark ? theme.primary + '15' : 'transparent'
          }]}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>

    {/* Floating Theme Toggle */}
    <TouchableOpacity 
      style={[styles.floatingThemeToggle, { 
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)' 
      }]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Text style={styles.floatingIcon}>{isDark ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  floatingThemeToggle: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  floatingIcon: {
    fontSize: 20,
    opacity: 0.7,
  },
  heroSection: {
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 24,
    alignItems: 'center',
    minHeight: height * 0.75,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundDecorations: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: '#fff',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    top: '40%',
    left: -75,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  appName: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    maxWidth: 400,
  },
  bookIllustration: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1,
  },
  book: {
    width: 50,
    height: 70,
    borderRadius: 6,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  heroCtaSection: {
    marginTop: 40,
    width: '100%',
    maxWidth: 400,
    zIndex: 1,
  },
  heroPrimaryButton: {
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  heroButtonContent: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  heroPrimaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7B2CBF',
    letterSpacing: 0.5,
  },
  heroSecondaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  heroSecondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#FFF',
  },
  heroFooterText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  waveContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 40,
    overflow: 'hidden',
  },
  wave: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 1000,
    borderTopRightRadius: 1000,
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  featureCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  featureCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  iconEmoji: {
    fontSize: 32,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ddd',
    opacity: 0.3,
  },
  reviewsSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  reviewCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  reviewCardGradient: {
    padding: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7B2CBF',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  reviewerRole: {
    fontSize: 14,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  ratingSummary: {
    marginTop: 32,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  ratingLeft: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingBigNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingStars: {
    marginBottom: 8,
  },
  ratingCount: {
    fontSize: 14,
  },
  ratingRight: {
    flex: 1,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    width: 32,
    fontSize: 14,
    fontWeight: '600',
  },
  ratingBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  ratingPercent: {
    width: 40,
    fontSize: 13,
    textAlign: 'right',
  },
  bottomCtaSection: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingBottom: 48,
    alignItems: 'center',
  },
  bottomCtaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  bottomCtaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 400,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    width: '100%',
    maxWidth: 400,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});