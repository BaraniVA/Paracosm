import React, { useState } from 'react';
import { BookOpen, Globe, Users, Scroll, MessageSquare, ArrowRight, CheckCircle, Lightbulb, Target, Play } from 'lucide-react';

export function GettingStartedGuide() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'creating-worlds', title: 'Creating Your First World', icon: <Globe className="h-4 w-4" /> },
    { id: 'world-laws', title: 'Understanding World Laws', icon: <Scroll className="h-4 w-4" /> },
    { id: 'roles', title: 'Setting Up Roles', icon: <Users className="h-4 w-4" /> },
    { id: 'exploring', title: 'Exploring Other Worlds', icon: <Target className="h-4 w-4" /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to Paracosm!</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Paracosm is a collaborative platform where you can create fictional worlds with unique laws, 
                mythology, and stories. Think of it as a combination of world-building, storytelling, and community collaboration.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                Key Concepts
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Worlds</h4>
                      <p className="text-gray-300 text-sm">Fictional universes with their own rules and laws</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Scroll className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Scrolls</h4>
                      <p className="text-gray-300 text-sm">Lore contributions that can become official canon</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Roles</h4>
                      <p className="text-gray-300 text-sm">Different ways to contribute to a world</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Questions</h4>
                      <p className="text-gray-300 text-sm">Ask world creators about their universe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6">
              <h3 className="text-indigo-300 font-semibold mb-3">Getting Started Checklist</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Create your account and complete your profile</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Explore existing worlds to understand the platform</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Join your first world and take on a role</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Submit your first scroll or ask a question</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Consider creating your own world</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'creating-worlds':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Creating Your First World</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Ready to build your own fictional universe? Creating a world on Paracosm is straightforward, 
                but planning ahead will help you build something truly special.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Step-by-Step Process</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h4 className="text-white font-medium">Plan Your Concept</h4>
                    <p className="text-gray-300 text-sm">What makes your world unique? What's the core idea that drives everything?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h4 className="text-white font-medium">Write Your Description</h4>
                    <p className="text-gray-300 text-sm">Craft a compelling description that explains your world's setting and appeal</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h4 className="text-white font-medium">Define World Laws</h4>
                    <p className="text-gray-300 text-sm">Create at least 3 laws that govern how your universe operates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <h4 className="text-white font-medium">Set Up Initial Roles</h4>
                    <p className="text-gray-300 text-sm">Define how others can contribute to your world</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Good World Concepts</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• A world where time flows backwards</li>
                  <li>• Magic powered by emotions</li>
                  <li>• A city built inside a giant tree</li>
                  <li>• Reality shaped by collective dreams</li>
                </ul>
              </div>
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h4 className="text-amber-300 font-semibold mb-2">Tips for Success</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Start simple and expand over time</li>
                  <li>• Leave room for others to contribute</li>
                  <li>• Make laws interesting, not restrictive</li>
                  <li>• Think about story potential</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/create-world"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Globe className="h-5 w-5 mr-2" />
                Create Your World
              </a>
            </div>
          </div>
        );

      case 'world-laws':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Understanding World Laws</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                World laws are the fundamental rules that govern your fictional universe. They're what make your world 
                unique and provide the framework for all stories and contributions.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">What Makes a Good World Law?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Specific and Clear</h4>
                    <p className="text-gray-300 text-sm">Avoid vague statements. Be precise about how the law works and what it affects.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Story-Worthy</h4>
                    <p className="text-gray-300 text-sm">Good laws create interesting situations and story opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Consistent</h4>
                    <p className="text-gray-300 text-sm">Laws should work together without contradicting each other.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Consequential</h4>
                    <p className="text-gray-300 text-sm">Consider the implications and how they affect daily life in your world.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Examples of Great World Laws</h3>
              
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="text-indigo-300 font-semibold mb-2">Magic System Example</h4>
                <p className="text-gray-300 text-sm italic mb-2">
                  "Every person is born with a unique magical ability that manifests on their 16th birthday, 
                  but using it ages them twice as fast for the duration of use."
                </p>
                <p className="text-gray-400 text-xs">
                  This creates interesting choices about when and how to use magic, plus natural story conflicts.
                </p>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Physics Example</h4>
                <p className="text-gray-300 text-sm italic mb-2">
                  "Gravity reverses direction every 12 hours, causing everything to fall upward during 'night' cycles."
                </p>
                <p className="text-gray-400 text-xs">
                  This affects architecture, daily routines, and creates unique environmental challenges.
                </p>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">Social Example</h4>
                <p className="text-gray-300 text-sm italic mb-2">
                  "Memories can be physically extracted and traded as currency, but removing them permanently erases them from the person."
                </p>
                <p className="text-gray-400 text-xs">
                  This creates a unique economy and raises questions about identity and value.
                </p>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-300 font-semibold mb-2">Common Mistakes to Avoid</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Making laws too vague ("Magic exists")</li>
                <li>• Creating contradictory rules</li>
                <li>• Making laws that prevent interesting stories</li>
                <li>• Copying existing fictional universes exactly</li>
                <li>• Making laws so complex they're unusable</li>
              </ul>
            </div>
          </div>
        );

      case 'roles':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Setting Up Roles</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Roles define how inhabitants can contribute to your world. Good roles give clear guidelines 
                while encouraging creativity within your world's framework.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Common Role Types</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-indigo-400 font-medium">Chronicler</h4>
                    <p className="text-gray-300 text-sm">Records history, events, and important happenings</p>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-medium">Explorer</h4>
                    <p className="text-gray-300 text-sm">Discovers new places, creatures, and phenomena</p>
                  </div>
                  <div>
                    <h4 className="text-purple-400 font-medium">Scholar</h4>
                    <p className="text-gray-300 text-sm">Studies magic systems, science, or world mechanics</p>
                  </div>
                  <div>
                    <h4 className="text-amber-400 font-medium">Storyteller</h4>
                    <p className="text-gray-300 text-sm">Creates legends, myths, and cultural stories</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Role Best Practices</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Give each role a clear purpose and scope</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Define what they can and cannot do</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Make roles feel meaningful and important</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Allow for creative interpretation</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Consider how roles interact with each other</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6">
              <h3 className="text-indigo-300 font-semibold mb-4">Example Role Description</h3>
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Memory Keeper</h4>
                <p className="text-gray-300 text-sm mb-3">
                  As a Memory Keeper, you are responsible for preserving and cataloging the extracted memories 
                  that serve as our world's currency. You can write about:
                </p>
                <ul className="space-y-1 text-gray-300 text-sm ml-4">
                  <li>• The process of memory extraction and storage</li>
                  <li>• Notable memories and their values</li>
                  <li>• The ethics and regulations around memory trading</li>
                  <li>• Stories of people who've lost important memories</li>
                </ul>
                <p className="text-gray-400 text-xs mt-3">
                  Note: You cannot create new laws about memory trading, but you can explore how existing laws affect daily life.
                </p>
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-300 font-semibold mb-2">Tips for Role Creation</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Start with 3-5 roles to avoid overwhelming new contributors</li>
                <li>• Make sure each role has enough scope for multiple contributions</li>
                <li>• Consider creating roles that complement each other</li>
                <li>• You can always add more roles as your world grows</li>
                <li>• Ask for feedback from early contributors about role clarity</li>
              </ul>
            </div>
          </div>
        );

      case 'exploring':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Exploring Other Worlds</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                The best way to understand Paracosm is to explore existing worlds. You'll see how others have 
                created unique universes and learn what makes for engaging collaborative storytelling.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-indigo-400" />
                What to Look For When Exploring
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-indigo-400 font-medium">World Laws</h4>
                    <p className="text-gray-300 text-sm">How do the laws create unique physics or magic systems?</p>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-medium">Canon Lore</h4>
                    <p className="text-gray-300 text-sm">How does approved content build the world's story?</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-amber-400 font-medium">Role Diversity</h4>
                    <p className="text-gray-300 text-sm">What different ways can people contribute?</p>
                  </div>
                  <div>
                    <h4 className="text-purple-400 font-medium">Community Activity</h4>
                    <p className="text-gray-300 text-sm">How active are discussions and questions?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">How to Join a World</h3>
              
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="text-indigo-300 font-semibold mb-2">Step 1: Research</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Read all world laws carefully</li>
                  <li>• Check existing canon lore</li>
                  <li>• Understand the world's tone and style</li>
                  <li>• Look at what the creator has approved before</li>
                </ul>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Step 2: Choose Your Role</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Pick a role that interests you and matches your style</li>
                  <li>• Consider what unique perspective you can bring</li>
                  <li>• Don't worry about being perfect - you can learn as you go</li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">Step 3: Start Contributing</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Begin with questions to show engagement</li>
                  <li>• Submit a small, well-crafted scroll</li>
                  <li>• Participate in community discussions</li>
                  <li>• Be patient with the approval process</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-300 font-semibold mb-2">Tips for New Contributors</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Start small - don't try to solve major world problems immediately</li>
                <li>• Ask questions if you're unsure about anything</li>
                <li>• Be respectful of the creator's vision</li>
                <li>• Build on existing lore rather than contradicting it</li>
                <li>• Focus on quality over quantity</li>
              </ul>
            </div>

            <div className="text-center">
              <a
                href="/explore"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                <Target className="h-5 w-5 mr-2" />
                Explore Worlds
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-indigo-400 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Getting Started Guide</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Learn the basics of world-building on Paracosm
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 sticky top-4">
            <h3 className="text-white font-semibold mb-4">Guide Sections</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {section.icon}
                  <span className="text-sm">{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Now that you understand the basics, it's time to dive in and start building or exploring!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/explore"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Target className="h-5 w-5 mr-2" />
              Explore Worlds
            </a>
            <a
              href="/create-world"
              className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <Globe className="h-5 w-5 mr-2" />
              Create Your World
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}