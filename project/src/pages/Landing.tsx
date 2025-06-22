import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Globe, Users, Scroll, GitBranch, ArrowRight, CheckCircle, Star, BookOpen, MessageSquare, Zap, Shield, Heart, Award, User, Compass, AlertTriangle } from 'lucide-react';

interface World {
  id: string;
  title: string;
  description: string;
  created_at: string;
  creator: {
    username: string;
  };
  inhabitants_count: number;
  canon_scrolls_count: number;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

export function Landing() {
  const { user } = useAuth();
  const [featuredWorlds, setFeaturedWorlds] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorlds: 0,
    totalUsers: 0,
    totalScrolls: 0,
    totalQuestions: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured worlds
      const { data: worldsData, error: worldsError } = await supabase
        .from('worlds')
        .select(`
          *,
          creator:users!creator_id(username)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (worldsError) throw worldsError;

      // Get counts for each world
      const worldsWithCounts = await Promise.all(
        (worldsData || []).map(async (world) => {
          const [
            { count: inhabitantCount },
            { count: canonScrollCount }
          ] = await Promise.all([
            supabase
              .from('inhabitants')
              .select('*', { count: 'exact', head: true })
              .eq('world_id', world.id),
            supabase
              .from('scrolls')
              .select('*', { count: 'exact', head: true })
              .eq('world_id', world.id)
              .eq('is_canon', true)
          ]);

          return { 
            ...world, 
            inhabitants_count: inhabitantCount || 0,
            canon_scrolls_count: canonScrollCount || 0
          };
        })
      );

      setFeaturedWorlds(worldsWithCounts);

      // Fetch platform stats
      const [
        { count: worldCount },
        { count: userCount },
        { count: scrollCount },
        { count: questionCount }
      ] = await Promise.all([
        supabase.from('worlds').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('scrolls').select('*', { count: 'exact', head: true }).eq('is_canon', true),
        supabase.from('questions').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalWorlds: worldCount || 0,
        totalUsers: userCount || 0,
        totalScrolls: scrollCount || 0,
        totalQuestions: questionCount || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const features: Feature[] = [
    {
      icon: <Globe className="h-8 w-8 text-indigo-400" />,
      title: "Create Immersive Worlds",
      description: "Design fictional universes with unique laws, physics, and mythology that govern every aspect of your creation.",
      benefits: [
        "Define custom world laws and rules",
        "Create rich backstories and lore",
        "Build interconnected mythologies",
        "Establish unique physics and magic systems"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-amber-400" />,
      title: "Collaborative Storytelling",
      description: "Join forces with other creators to build worlds together, each bringing their unique perspective and creativity.",
      benefits: [
        "Take on specialized roles in worlds",
        "Contribute to ongoing narratives",
        "Build communities around shared interests",
        "Learn from experienced world-builders"
      ]
    },
    {
      icon: <Scroll className="h-8 w-8 text-green-400" />,
      title: "Living Lore System",
      description: "Submit scrolls and stories that can become official canon, creating an ever-evolving mythology.",
      benefits: [
        "Submit lore for community review",
        "See your stories become canon",
        "Build upon others' contributions",
        "Create interconnected storylines"
      ]
    },
    {
      icon: <GitBranch className="h-8 w-8 text-purple-400" />,
      title: "Fork & Remix Worlds",
      description: "Take existing worlds in new directions by creating your own variations and interpretations.",
      benefits: [
        "Create alternate timelines",
        "Explore 'what if' scenarios",
        "Build upon successful concepts",
        "Maintain connection to original works"
      ]
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Fantasy Author",
      content: "Paracosm has revolutionized how I develop my fictional worlds. The collaborative aspect brings ideas I never would have thought of alone.",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Game Designer",
      content: "The ability to fork worlds and explore different possibilities is incredible. It's like version control for creativity.",
      avatar: "MR"
    },
    {
      name: "Elena Kowalski",
      role: "Creative Writing Teacher",
      content: "I use Paracosm with my students to teach collaborative storytelling. The engagement and creativity it sparks is amazing.",
      avatar: "EK"
    }
  ];

  const onboardingSteps = [
    {
      step: 1,
      title: "Create Your Account",
      description: "Sign up with your email and choose a unique username that represents your creative identity.",
      icon: <User className="h-6 w-6" />,
      action: user ? "✓ Completed" : "Get Started"
    },
    {
      step: 2,
      title: "Explore Existing Worlds",
      description: "Browse featured worlds to understand the platform and find communities that match your interests.",
      icon: <Globe className="h-6 w-6" />,
      action: "Browse Worlds"
    },
    {
      step: 3,
      title: "Join a Community",
      description: "Take on a role in an existing world to learn how collaborative storytelling works on Paracosm.",
      icon: <Users className="h-6 w-6" />,
      action: "Find Your Role"
    },
    {
      step: 4,
      title: "Create Your First World",
      description: "Once you're comfortable, create your own world with unique laws, roles, and mythology.",
      icon: <Zap className="h-6 w-6" />,
      action: "Create World"
    }
  ];
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-gray-900/20 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-medium mb-6">
            <Star className="h-4 w-4 mr-2" />
            Join thousands of world-builders creating amazing stories
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Build Worlds.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Tell Stories.
            </span><br />
            Create Legends.
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Paracosm is the ultimate collaborative platform where imagination meets mythology. 
            Create fictional universes with unique laws, inhabit them with others, 
            and watch your stories evolve through collective storytelling.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            {user ? (
              <>
                <Link
                  to="/create-world"
                  className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center"
                >
                  Create Your World
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/explore"
                  className="group bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center"
                >
                  <Compass className="mr-2 h-5 w-5" />
                  Explore Worlds
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 flex items-center"
                >
                  Start Creating Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/explore"
                  className="group bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center"
                >
                  <Compass className="mr-2 h-5 w-5" />
                  Explore Worlds
                </Link>
              </>
            )}
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalWorlds.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Worlds Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Active Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalScrolls.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Canon Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stats.totalQuestions.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Questions Asked</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Onboarding Steps */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">How to Get Started</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Follow these simple steps to begin your journey into collaborative world-building
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {onboardingSteps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connection Line */}
              {index < onboardingSteps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-indigo-500 to-transparent z-0"></div>
              )}
              
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-colors relative z-10">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-lg mb-4 mx-auto">
                  {step.icon}
                </div>
                
                <div className="text-center">
                  <div className="text-indigo-400 text-sm font-medium mb-2">Step {step.step}</div>
                  <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{step.description}</p>
                  
                  <div className="inline-flex items-center text-indigo-400 text-sm font-medium">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {step.action}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features for Creators</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to build, share, and evolve incredible fictional worlds
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-indigo-500 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">{feature.description}</p>
                  
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-gray-300 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Worlds */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Discover Amazing Worlds</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Explore worlds created by our community and find your next adventure
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Compass className="h-5 w-5 mr-2" />
            View All Worlds
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWorlds.map((world) => (
              <Link
                key={world.id}
                to={`/world/${world.id}`}
                className="group block bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                      {world.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-3">
                      {world.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>By {world.creator?.username}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{world.inhabitants_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Scroll className="h-3 w-3" />
                      <span>{world.canon_scrolls_count}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && featuredWorlds.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No worlds created yet</p>
            <p className="text-gray-500">Be the first to create an amazing world!</p>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">What Creators Are Saying</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied creators who are building amazing worlds together
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Paracosm */}
      <section className="py-16">
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-3xl p-12 border border-indigo-500/20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Paracosm?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're more than just a platform - we're a community dedicated to collaborative creativity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Safe & Secure</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your creative work is protected with robust security measures and clear ownership rights.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Community Driven</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Built by creators, for creators. Our community shapes the platform's development and features.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Always Free</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Core features remain free forever. Premium features help support the platform and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Build Your World?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join thousands of creators who are already building amazing worlds together. 
            Your next great story starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {user ? (
              <>
                <Link
                  to="/create-world"
                  className="group bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-lg font-semibold text-xl transition-all duration-200 transform hover:scale-105 flex items-center"
                >
                  Create Your First World
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/explore"
                  className="group bg-gray-700 hover:bg-gray-600 text-white px-10 py-4 rounded-lg font-semibold text-xl transition-colors flex items-center"
                >
                  <Compass className="mr-3 h-6 w-6" />
                  Explore Worlds
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="group bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-lg font-semibold text-xl transition-all duration-200 transform hover:scale-105 flex items-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/explore"
                  className="group bg-gray-700 hover:bg-gray-600 text-white px-10 py-4 rounded-lg font-semibold text-xl transition-colors flex items-center"
                >
                  <Compass className="mr-3 h-6 w-6" />
                  Explore Worlds
                </Link>
              </>
            )}
          </div>
          
          <p className="text-gray-400 text-sm mt-6">
            No credit card required • Free forever • Join 10,000+ creators
          </p>
        </div>
      </section>
    </div>
  );
}