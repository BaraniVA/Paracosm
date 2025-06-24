import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  BookOpen, 
  Users, 
  Globe, 
  Scroll, 
  MessageSquare, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  Play,
  ArrowRight,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

interface GuideStep {
  title: string;
  description: string;
  content: React.ReactNode;
  action?: {
    text: string;
    link?: string;
    onClick?: () => void;
  };
}

interface Guide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: GuideStep[];
}

export function QuickStartGuide() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const guides: Guide[] = [
    {
      id: 'new-user',
      title: 'Complete Beginner',
      description: 'Never used Paracosm before? Start here to learn the basics.',
      icon: <Lightbulb className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-600',
      estimatedTime: '10 minutes',
      difficulty: 'Beginner',
      steps: [
        {
          title: 'Welcome to Paracosm!',
          description: 'Learn what Paracosm is and how it works',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Paracosm is a collaborative platform where you can create fictional worlds with unique laws, 
                mythology, and stories. Think of it as a combination of world-building, storytelling, and community collaboration.
              </p>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Key Concepts:</h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start space-x-2">
                    <Globe className="h-4 w-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Worlds:</strong> Fictional universes with their own rules and laws</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Scroll className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Scrolls:</strong> Lore contributions that can become official canon</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Users className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Roles:</strong> Different ways to contribute to a world</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span><strong>Questions:</strong> Ask world creators about their universe</span>
                  </li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: 'Explore Existing Worlds',
          description: 'Browse and discover amazing worlds created by the community',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                The best way to understand Paracosm is to explore existing worlds. You'll see how others have 
                created unique universes with their own laws, stories, and communities.
              </p>
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="text-indigo-300 font-semibold mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  What to Look For:
                </h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• How world laws create unique physics or magic systems</li>
                  <li>• Different roles and how they contribute</li>
                  <li>• Canon lore and how it builds the world's story</li>
                  <li>• Community discussions and questions</li>
                </ul>
              </div>
            </div>
          ),
          action: {
            text: 'Explore Worlds',
            link: '/explore'
          }
        },
        {
          title: 'Join Your First World',
          description: 'Become an inhabitant and start contributing',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Find a world that interests you and join it! When you join a world, you'll choose a role 
                that defines how you can contribute to that universe.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">As an Inhabitant, you can:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Submit scrolls (lore contributions)</li>
                    <li>• Ask questions about the world</li>
                    <li>• Participate in community discussions</li>
                    <li>• Vote on content</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Tips for Success:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Read the world laws carefully</li>
                    <li>• Check existing lore before contributing</li>
                    <li>• Be respectful of the creator's vision</li>
                    <li>• Ask questions if you're unsure</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Create Your First Content',
          description: 'Submit a scroll or ask a question',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Ready to contribute? Start small with a question or a short scroll. This helps you understand 
                the world better and shows the creator you're engaged.
              </p>
              <div className="space-y-3">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">Good First Questions:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• "How does [specific law] affect daily life?"</li>
                    <li>• "What's the history behind [world element]?"</li>
                    <li>• "Are there any unexplored areas in this world?"</li>
                  </ul>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2">Good First Scrolls:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• A short story about a character's daily life</li>
                    <li>• Description of a local custom or tradition</li>
                    <li>• A legend or myth that fits the world</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Next Steps',
          description: 'Continue your journey on Paracosm',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Congratulations! You now understand the basics of Paracosm. Here's what you can do next:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Keep Exploring:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Join multiple worlds</li>
                    <li>• Try different types of roles</li>
                    <li>• Engage with the community</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Ready to Create?</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Follow the "World Creator" guide</li>
                    <li>• Start with a simple concept</li>
                    <li>• Build your community gradually</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'world-creator',
      title: 'World Creator',
      description: 'Learn to build and manage your own fictional universe.',
      icon: <Globe className="h-6 w-6" />,
      color: 'from-indigo-500 to-purple-600',
      estimatedTime: '15 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          title: 'Planning Your World',
          description: 'Before you create, plan your world concept',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Great worlds start with great planning. Before diving into creation, think about your world's 
                core concept, theme, and what makes it unique.
              </p>
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Planning Checklist:</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Core Concept</p>
                      <p className="text-gray-300 text-sm">What's the main idea? (e.g., "A world where time flows backwards")</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Unique Laws</p>
                      <p className="text-gray-300 text-sm">What rules make your world different from reality?</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Collaboration Style</p>
                      <p className="text-gray-300 text-sm">How do you want others to contribute?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Creating Your World',
          description: 'Set up your world with laws, roles, and description',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Now it's time to create your world! You'll need a compelling title, clear description, 
                and at least 3 world laws that define how your universe operates.
              </p>
              <div className="space-y-3">
                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                  <h4 className="text-indigo-300 font-semibold mb-2">Writing Great World Laws:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Be specific and clear about how they work</li>
                    <li>• Consider the implications and consequences</li>
                    <li>• Make them interesting and story-worthy</li>
                    <li>• Ensure they're consistent with each other</li>
                  </ul>
                </div>
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                  <h4 className="text-amber-300 font-semibold mb-2">Example Good Law:</h4>
                  <p className="text-gray-300 text-sm italic">
                    "Every person is born with a unique magical ability that manifests on their 16th birthday, 
                    but using it ages them twice as fast for the duration of use."
                  </p>
                </div>
              </div>
            </div>
          ),
          action: {
            text: 'Create Your World',
            link: '/create-world'
          }
        },
        {
          title: 'Setting Up Roles',
          description: 'Define how others can contribute to your world',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Roles define how inhabitants can contribute to your world. Good roles give clear guidelines 
                while encouraging creativity within your world's framework.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Common Role Types:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• <strong>Chronicler:</strong> Records history and events</li>
                    <li>• <strong>Explorer:</strong> Discovers new places</li>
                    <li>• <strong>Scholar:</strong> Studies magic/science</li>
                    <li>• <strong>Storyteller:</strong> Creates legends and myths</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Role Best Practices:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Give each role a clear purpose</li>
                    <li>• Define what they can/cannot do</li>
                    <li>• Make roles feel meaningful</li>
                    <li>• Allow for creative interpretation</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Managing Your Community',
          description: 'Review submissions and guide your world\'s development',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                As a world creator, you'll review scroll submissions, answer questions, and guide your world's 
                development. Your dashboard is your command center for all world management.
              </p>
              <div className="space-y-3">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2">Reviewing Scrolls:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Does it fit your world's laws and tone?</li>
                    <li>• Is it well-written and engaging?</li>
                    <li>• Does it contradict existing lore?</li>
                    <li>• Does it add value to your world?</li>
                  </ul>
                </div>
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">Answering Questions:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Be thorough and thoughtful</li>
                    <li>• Use questions to expand your world</li>
                    <li>• Encourage follow-up questions</li>
                    <li>• Stay consistent with established lore</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Growing Your World',
          description: 'Attract contributors and build a thriving community',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                A great world attracts great contributors. Here's how to build a thriving community around your creation:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Attract Contributors:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Write compelling world descriptions</li>
                    <li>• Create interesting, open-ended laws</li>
                    <li>• Be active and responsive</li>
                    <li>• Share your world with friends</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Keep Them Engaged:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Approve good content quickly</li>
                    <li>• Ask follow-up questions</li>
                    <li>• Build on their contributions</li>
                    <li>• Create collaborative storylines</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'collaborator',
      title: 'Active Collaborator',
      description: 'Master the art of contributing to multiple worlds.',
      icon: <Users className="h-6 w-6" />,
      color: 'from-amber-500 to-orange-600',
      estimatedTime: '12 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          title: 'Understanding Different Worlds',
          description: 'Learn to adapt your contributions to different world styles',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Each world has its own tone, style, and expectations. Successful collaborators learn to adapt 
                their writing and contributions to fit different world aesthetics.
              </p>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Before Contributing, Research:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Read all world laws carefully</li>
                    <li>• Study existing canon lore</li>
                    <li>• Understand the world's tone (serious, whimsical, dark, etc.)</li>
                    <li>• Check what roles are available</li>
                    <li>• Look at what the creator has approved before</li>
                  </ul>
                </div>
                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                  <h4 className="text-indigo-300 font-semibold mb-2">Pro Tip:</h4>
                  <p className="text-gray-300 text-sm">
                    Start with questions before submitting scrolls. This shows you're engaged and helps you 
                    understand the creator's vision better.
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Writing Quality Scrolls',
          description: 'Create lore that creators want to make canon',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Great scrolls don't just follow the rules—they enhance the world and inspire others. 
                Here's how to write scrolls that creators love to approve.
              </p>
              <div className="space-y-3">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2">Elements of Great Scrolls:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• <strong>Consistency:</strong> Follows world laws and existing lore</li>
                    <li>• <strong>Creativity:</strong> Adds something new and interesting</li>
                    <li>• <strong>Quality:</strong> Well-written and engaging</li>
                    <li>• <strong>Respect:</strong> Honors the creator's vision</li>
                    <li>• <strong>Openness:</strong> Leaves room for others to build upon</li>
                  </ul>
                </div>
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                  <h4 className="text-amber-300 font-semibold mb-2">Common Mistakes to Avoid:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Contradicting established lore</li>
                    <li>• Making your character too powerful</li>
                    <li>• Solving major world problems without permission</li>
                    <li>• Writing in a different tone than the world</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Building Relationships',
          description: 'Connect with creators and other collaborators',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Paracosm is about community. Building good relationships with creators and fellow collaborators 
                leads to better opportunities and more enjoyable experiences.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">With Creators:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Ask thoughtful questions</li>
                    <li>• Respect their decisions</li>
                    <li>• Offer constructive feedback</li>
                    <li>• Be patient with reviews</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">With Other Collaborators:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Build on their contributions</li>
                    <li>• Collaborate on storylines</li>
                    <li>• Share knowledge and ideas</li>
                    <li>• Support their submissions</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Managing Multiple Worlds',
          description: 'Stay organized across different projects',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                As you join more worlds, organization becomes key. Here's how to stay on top of multiple 
                projects without getting overwhelmed.
              </p>
              <div className="space-y-3">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">Organization Tips:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Keep notes on each world's laws and lore</li>
                    <li>• Set priorities—focus on your favorites</li>
                    <li>• Check your profile regularly for updates</li>
                    <li>• Don't overcommit—quality over quantity</li>
                  </ul>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-purple-300 font-semibold mb-2">Time Management:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Set aside specific times for Paracosm</li>
                    <li>• Focus on one world at a time</li>
                    <li>• Don't feel pressured to contribute constantly</li>
                    <li>• Take breaks when you need them</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Advanced Collaboration',
          description: 'Become a valued community member',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Ready to take your collaboration to the next level? Here are advanced techniques that make you 
                a valued member of any world community.
              </p>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Advanced Techniques:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Create interconnected storylines across your contributions</li>
                    <li>• Develop recurring characters that others can reference</li>
                    <li>• Propose collaborative events or storylines</li>
                    <li>• Help newcomers understand the world</li>
                    <li>• Suggest new roles or world features</li>
                  </ul>
                </div>
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2">Becoming a Community Leader:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Mentor new contributors</li>
                    <li>• Organize community discussions</li>
                    <li>• Help resolve conflicts diplomatically</li>
                    <li>• Contribute consistently and reliably</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      description: 'Master timeline, records, forking, and advanced world management.',
      icon: <Settings className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-600',
      estimatedTime: '20 minutes',
      difficulty: 'Advanced',
      steps: [
        {
          title: 'Timeline Management',
          description: 'Organize your world\'s history with the timeline system',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                The timeline system helps you organize your world's history into eras and events. 
                This creates a clear chronological structure that contributors can reference and build upon.
              </p>
              <div className="space-y-3">
                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                  <h4 className="text-indigo-300 font-semibold mb-2">Timeline Best Practices:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Group related events into eras (e.g., "The Golden Age", "The Dark Times")</li>
                    <li>• Use consistent dating systems (years, ages, etc.)</li>
                    <li>• Include major events that shape your world</li>
                    <li>• Leave gaps for contributors to fill in</li>
                    <li>• Use tags to categorize different types of events</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Timeline Features:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• <strong>Eras:</strong> Group events by time periods</li>
                    <li>• <strong>Tags:</strong> Categorize by type (war, magic, politics, etc.)</li>
                    <li>• <strong>Roles:</strong> Link events to specific world roles</li>
                    <li>• <strong>Privacy:</strong> Keep some events private for planning</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'World Records System',
          description: 'Create detailed documentation for your world',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                World Records are like wiki pages for your world. They let you document detailed information 
                about places, characters, concepts, and anything else that needs extensive explanation.
              </p>
              <div className="space-y-3">
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2">What to Document:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Important locations and their histories</li>
                    <li>• Key characters and their backgrounds</li>
                    <li>• Magic systems or technologies</li>
                    <li>• Cultural practices and traditions</li>
                    <li>• Organizations and their structures</li>
                  </ul>
                </div>
                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                  <h4 className="text-amber-300 font-semibold mb-2">Linking System:</h4>
                  <p className="text-gray-300 text-sm mb-2">
                    Records can be linked to world laws, roles, or timeline events, creating an interconnected 
                    knowledge base that helps contributors understand your world better.
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'World Forking',
          description: 'Create variations and alternate versions of worlds',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Forking allows you to create your own version of an existing world. This is perfect for 
                exploring "what if" scenarios, alternate timelines, or putting your own spin on a concept you love.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">When to Fork:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• You want to explore alternate timelines</li>
                    <li>• You have a different vision for the world</li>
                    <li>• You want to experiment with changes</li>
                    <li>• The original creator is inactive</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Fork Etiquette:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Credit the original creator</li>
                    <li>• Explain your changes clearly</li>
                    <li>• Be respectful of the source material</li>
                    <li>• Make meaningful modifications</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Community Management',
          description: 'Advanced techniques for managing large communities',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                As your world grows, community management becomes crucial. Learn advanced techniques for 
                maintaining a healthy, productive community around your world.
              </p>
              <div className="space-y-3">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">Managing Large Communities:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Set clear expectations and guidelines</li>
                    <li>• Respond to submissions promptly</li>
                    <li>• Create regular community events or challenges</li>
                    <li>• Delegate responsibilities when possible</li>
                    <li>• Address conflicts quickly and fairly</li>
                  </ul>
                </div>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-purple-300 font-semibold mb-2">Inhabitant Management:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Monitor inhabitant activity and contributions</li>
                    <li>• Remove inactive or disruptive members when necessary</li>
                    <li>• Recognize and reward valuable contributors</li>
                    <li>• Help new members integrate into the community</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Advanced World Building',
          description: 'Create complex, interconnected world systems',
          content: (
            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Master-level world building involves creating complex systems that interact with each other 
                in interesting ways. This creates depth and provides endless opportunities for exploration.
              </p>
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Advanced Techniques:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Create interconnected systems (magic affects politics, etc.)</li>
                    <li>• Develop complex histories with cause and effect</li>
                    <li>• Build in mysteries and unexplored areas</li>
                    <li>• Design systems that encourage collaboration</li>
                    <li>• Plan for long-term world evolution</li>
                  </ul>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-300 font-semibold mb-2">Avoiding Complexity Traps:</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Don't make systems so complex they're unusable</li>
                    <li>• Ensure new contributors can understand the basics</li>
                    <li>• Document complex systems clearly</li>
                    <li>• Be willing to simplify if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        }
      ]
    }
  ];

  const currentGuide = guides.find(g => g.id === selectedGuide);

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const nextStep = () => {
    if (currentGuide && currentStep < currentGuide.steps.length - 1) {
      handleStepComplete(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetGuide = () => {
    setSelectedGuide(null);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  if (!selectedGuide) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-indigo-400 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Quick Start Guides</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive step-by-step guides to help you master Paracosm quickly
          </p>
        </div>

        {/* Guide Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-200 cursor-pointer transform hover:scale-105"
              onClick={() => setSelectedGuide(guide.id)}
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${guide.color} flex items-center justify-center mb-4`}>
                {guide.icon}
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{guide.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  guide.difficulty === 'Beginner' ? 'bg-green-600 text-white' :
                  guide.difficulty === 'Intermediate' ? 'bg-amber-600 text-white' :
                  'bg-red-600 text-white'
                }`}>
                  {guide.difficulty}
                </span>
              </div>
              
              <p className="text-gray-300 mb-4 leading-relaxed">{guide.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Play className="h-4 w-4 mr-1" />
                    {guide.estimatedTime}
                  </span>
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {guide.steps.length} steps
                  </span>
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Need More Help?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              These guides cover the essentials, but there's always more to learn. Check out our comprehensive help center for detailed information.
            </p>
            <a
              href="/help"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Visit Help Center
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!currentGuide) {
    // Defensive: should not happen, but prevents undefined errors
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Guide Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={resetGuide}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Guides
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{currentGuide.title}</h1>
          <p className="text-gray-400 text-sm">
            Step {currentStep + 1} of {currentGuide.steps.length}
          </p>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Progress</span>
          <span className="text-sm text-gray-400">
            {Math.round(((currentStep + 1) / currentGuide.steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${currentGuide.color} transition-all duration-300`}
            style={{ width: `${((currentStep + 1) / currentGuide.steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {currentGuide.steps[currentStep].title}
          </h2>
          <p className="text-gray-400">
            {currentGuide.steps[currentStep].description}
          </p>
        </div>

        <div className="mb-8">
          {currentGuide.steps[currentStep].content}
        </div>

        {/* Action Button */}
        {currentGuide.steps[currentStep].action && (
          <div className="mb-6">
            <a
              href={currentGuide.steps[currentStep].action!.link}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              target={currentGuide.steps[currentStep].action!.link?.startsWith('http') ? '_blank' : undefined}
              rel={currentGuide.steps[currentStep].action!.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {currentGuide.steps[currentStep].action!.text}
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          <div className="flex space-x-2">
            {currentGuide.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-indigo-500'
                    : index < currentStep || completedSteps.includes(index)
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {currentStep < currentGuide.steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={() => {
                handleStepComplete(currentStep);
                resetGuide();
              }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete
            </button>
          )}
        </div>
      </div>

      {/* Step Overview */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Guide Overview</h3>
        <div className="space-y-2">
          {currentGuide.steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                index === currentStep
                  ? 'bg-indigo-600/20 border border-indigo-500/30'
                  : completedSteps.includes(index)
                  ? 'bg-green-600/20 border border-green-500/30'
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === currentStep
                  ? 'bg-indigo-500 text-white'
                  : completedSteps.includes(index)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-600 text-gray-300'
              }`}>
                {completedSteps.includes(index) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{step.title}</p>
                <p className="text-gray-400 text-xs">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}