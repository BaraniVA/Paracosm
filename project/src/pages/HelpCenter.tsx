import React, { useState } from 'react';
import { Search, BookOpen, MessageCircle, Users, Globe, Scroll, Settings, ChevronRight, ChevronDown, ExternalLink, Zap } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface GuideSection {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string; // Changed to link to dedicated pages
}

export function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqItems: FAQItem[] = [
    {
      question: "How do I create my first world?",
      answer: "To create your first world, click the 'Create World' button in the navigation bar. You'll need to provide a title, description, and at least 3 world laws that define how your universe operates. You can also add initial roles for inhabitants to take on.",
      category: "getting-started"
    },
    {
      question: "What are world laws and why are they important?",
      answer: "World laws are fundamental rules that govern your fictional universe. They define physics, magic systems, social structures, or any other core mechanics. Good laws help maintain consistency and give contributors clear guidelines for creating content that fits your world.",
      category: "world-building"
    },
    {
      question: "How does the scroll approval system work?",
      answer: "When users submit scrolls (lore contributions) to your world, they appear in your dashboard's 'Pending Review' section. As the world creator, you can approve scrolls to make them canon, or reject them if they don't fit your vision. Canon scrolls become part of your world's official lore.",
      category: "world-building"
    },
    {
      question: "Can I collaborate with others on my world?",
      answer: "Absolutely! You can create roles for your world that define different types of contributors. Users can join your world and take on these roles, then submit scrolls, ask questions, and participate in community discussions. You maintain control as the creator while enabling collaborative storytelling.",
      category: "collaboration"
    },
    {
      question: "What's the difference between public and private worlds?",
      answer: "Public worlds are visible to everyone and can be discovered through the Explore page. Private worlds are only accessible to you and users you've specifically invited. You can change this setting at any time in your world's dashboard.",
      category: "privacy"
    },
    {
      question: "How do I fork a world?",
      answer: "Forking allows you to create your own version of an existing world. Visit any world and look for the 'Fork World' option. This creates a copy that you can modify independently while maintaining a connection to the original. It's perfect for exploring 'what if' scenarios or alternate timelines.",
      category: "collaboration"
    },
    {
      question: "Can I export my world's content?",
      answer: "Yes! You can export your world's lore, timeline, and other content from your world dashboard. This ensures you always have a backup of your creative work and can use it outside of Paracosm if needed.",
      category: "account"
    },
    {
      question: "How do I manage inhabitants in my world?",
      answer: "In your world dashboard, you'll find an 'Inhabitants' section where you can see all users who have joined your world, their roles, and when they joined. As the creator, you can remove inhabitants if necessary, though this should be done thoughtfully as it affects the community.",
      category: "world-building"
    },
    {
      question: "What happens if I delete my account?",
      answer: "If you delete your account, your worlds will be permanently removed along with all associated content. However, any contributions you made to other people's worlds (scrolls, questions, comments) will remain but be marked as from a former user. We recommend exporting important content before deletion.",
      category: "account"
    },
    {
      question: "How do I report inappropriate content or behavior?",
      answer: "You can report content or users by using the report buttons found throughout the platform, or by contacting us directly through our contact page. We take community safety seriously and will investigate all reports promptly.",
      category: "safety"
    }
  ];

  const guides: GuideSection[] = [
    {
      title: "Getting Started",
      description: "Learn the basics of world-building on Paracosm",
      icon: <BookOpen className="h-6 w-6" />,
      link: "/help/getting-started"
    },
    {
      title: "Collaboration",
      description: "Work with others to build amazing worlds",
      icon: <Users className="h-6 w-6" />,
      link: "/help/collaboration"
    },
    {
      title: "World Management",
      description: "Advanced features for world creators",
      icon: <Settings className="h-6 w-6" />,
      link: "/help/world-management"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'world-building', name: 'World Building' },
    { id: 'collaboration', name: 'Collaboration' },
    { id: 'account', name: 'Account' },
    { id: 'privacy', name: 'Privacy' },
    { id: 'safety', name: 'Safety' }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-indigo-400 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Help Center</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Everything you need to know about building worlds and collaborating on Paracosm
        </p>
      </div>

      {/* Quick Start CTA */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-6 border border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">New to Paracosm?</h3>
              <p className="text-gray-300 text-sm">Get started quickly with our interactive step-by-step guides</p>
            </div>
          </div>
          <a
            href="/quick-start"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Zap className="h-4 w-4 mr-2" />
            Quick Start Guides
          </a>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for help articles, guides, and FAQs..."
            className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Documentation Guides */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Documentation Guides</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <a
              key={index}
              href={guide.link}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-indigo-500 transition-colors block"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  {guide.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{guide.title}</h3>
                  <p className="text-gray-400 text-sm">{guide.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-indigo-400 text-sm font-medium">View Guide</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg border border-gray-700">
          {filteredFAQs.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {filteredFAQs.map((faq, index) => (
                <div key={index} className="p-6">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-medium text-white pr-4">{faq.question}</h3>
                    {expandedFAQ === index ? (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="mt-4 text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your search terms or category filter</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/20">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Still Need Help?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you get the most out of Paracosm.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Support
            </a>
            <a
              href="https://discord.gg/VHDHGZfmrU"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Join Discord
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}