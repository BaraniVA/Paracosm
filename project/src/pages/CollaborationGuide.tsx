import React, { useState } from 'react';
import { Users, Scroll, MessageSquare, GitBranch, Target, CheckCircle, Lightbulb, ArrowRight } from 'lucide-react';

export function CollaborationGuide() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: <Users className="h-4 w-4" /> },
    { id: 'joining-worlds', title: 'Joining Worlds', icon: <Target className="h-4 w-4" /> },
    { id: 'writing-scrolls', title: 'Submitting Scrolls', icon: <Scroll className="h-4 w-4" /> },
    { id: 'community', title: 'Community Discussions', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'forking', title: 'Forking Worlds', icon: <GitBranch className="h-4 w-4" /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Collaboration on Paracosm</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Paracosm thrives on collaboration. Whether you're contributing to existing worlds or building 
                your own community, understanding how to work effectively with others is key to success.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                Types of Collaboration
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Scroll className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Lore Contribution</h4>
                      <p className="text-gray-300 text-sm">Submit scrolls that expand world mythology and stories</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Q&A Participation</h4>
                      <p className="text-gray-300 text-sm">Ask questions and engage with world creators</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Community Building</h4>
                      <p className="text-gray-300 text-sm">Help foster active, welcoming communities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <GitBranch className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">World Forking</h4>
                      <p className="text-gray-300 text-sm">Create variations and alternate versions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6">
              <h3 className="text-indigo-300 font-semibold mb-3">Collaboration Principles</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Respect the creator's vision and established lore</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Build upon existing content rather than contradicting it</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Communicate openly and ask questions when unsure</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Focus on quality contributions over quantity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Be patient with the review and approval process</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'joining-worlds':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Joining Worlds</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Finding the right worlds to join is crucial for a positive experience. Here's how to choose 
                worlds that match your interests and contribute effectively.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Research Before Joining</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h4 className="text-white font-medium">Read World Laws</h4>
                    <p className="text-gray-300 text-sm">Understand the fundamental rules that govern the universe</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h4 className="text-white font-medium">Study Existing Lore</h4>
                    <p className="text-gray-300 text-sm">Review canon scrolls to understand the world's tone and style</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h4 className="text-white font-medium">Check Available Roles</h4>
                    <p className="text-gray-300 text-sm">See what types of contributions are welcomed</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <h4 className="text-white font-medium">Observe Community Activity</h4>
                    <p className="text-gray-300 text-sm">Look at questions, discussions, and creator responsiveness</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Signs of a Good World to Join</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Clear, interesting world laws</li>
                  <li>• Active creator who responds to questions</li>
                  <li>• Diverse, well-defined roles</li>
                  <li>• Quality existing lore</li>
                  <li>• Welcoming community atmosphere</li>
                  <li>• Regular approval of good content</li>
                </ul>
              </div>
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h4 className="text-amber-300 font-semibold mb-2">Red Flags to Watch For</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Vague or contradictory world laws</li>
                  <li>• Inactive creator (no recent activity)</li>
                  <li>• Very restrictive or unclear roles</li>
                  <li>• Toxic community discussions</li>
                  <li>• Arbitrary rejection of submissions</li>
                  <li>• Overly complex or confusing lore</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-blue-300 font-semibold mb-4">Making a Good First Impression</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Start with Questions</h4>
                    <p className="text-gray-300 text-sm">Show genuine interest by asking thoughtful questions about the world</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Submit Quality Content</h4>
                    <p className="text-gray-300 text-sm">Your first scroll should be well-written and clearly fit the world</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Be Patient</h4>
                    <p className="text-gray-300 text-sm">Give creators time to review your submissions and respond to questions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'writing-scrolls':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Writing Quality Scrolls</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Scrolls are your primary way to contribute lore to worlds. Great scrolls don't just follow 
                the rules—they enhance the world and inspire others to build upon them.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Elements of Great Scrolls</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Consistency</h4>
                    <p className="text-gray-300 text-sm">Follows world laws and doesn't contradict existing lore</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Creativity</h4>
                    <p className="text-gray-300 text-sm">Adds something new and interesting to the world</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Quality Writing</h4>
                    <p className="text-gray-300 text-sm">Well-written, engaging, and appropriate length</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Respect for Vision</h4>
                    <p className="text-gray-300 text-sm">Honors the creator's tone and style</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Openness</h4>
                    <p className="text-gray-300 text-sm">Leaves room for others to build upon your contribution</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Types of Scroll Content</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                  <h4 className="text-indigo-300 font-semibold mb-2">Narrative Scrolls</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Character stories and adventures</li>
                    <li>• Historical events and their impact</li>
                    <li>• Legends and myths</li>
                    <li>• Daily life vignettes</li>
                  </ul>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2">Descriptive Scrolls</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Locations and their features</li>
                    <li>• Cultural practices and traditions</li>
                    <li>• Organizations and their structure</li>
                    <li>• Technologies or magic systems</li>
                  </ul>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-purple-300 font-semibold mb-2">Exploratory Scrolls</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Discoveries of new places</li>
                    <li>• Encounters with creatures</li>
                    <li>• Investigations and mysteries</li>
                    <li>• Scientific or magical research</li>
                  </ul>
                </div>

                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                  <h4 className="text-amber-300 font-semibold mb-2">Cultural Scrolls</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Festivals and celebrations</li>
                    <li>• Art forms and entertainment</li>
                    <li>• Social customs and etiquette</li>
                    <li>• Languages and communication</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-300 font-semibold mb-2">Common Mistakes to Avoid</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Contradicting established lore or world laws</li>
                <li>• Making your character overpowered or too important</li>
                <li>• Solving major world problems without permission</li>
                <li>• Writing in a different tone than the established world</li>
                <li>• Creating content that closes off future possibilities</li>
                <li>• Ignoring the role you've chosen to play</li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Scroll Writing Process</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                  <span className="text-gray-300">Brainstorm ideas that fit your role and the world</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                  <span className="text-gray-300">Check existing lore to avoid contradictions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                  <span className="text-gray-300">Write a draft focusing on quality over length</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">4</div>
                  <span className="text-gray-300">Review for consistency with world laws and tone</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">5</div>
                  <span className="text-gray-300">Submit and be patient with the review process</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Community Discussions</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Active community participation makes worlds more engaging for everyone. Learn how to contribute 
                to discussions, ask great questions, and help build welcoming communities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Asking Great Questions</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-blue-400 font-medium">Specific Questions</h4>
                    <p className="text-gray-300 text-sm">"How does the memory extraction process work?" vs "Tell me about memories"</p>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-medium">Lore-Building Questions</h4>
                    <p className="text-gray-300 text-sm">"What happens to children born during gravity reversal?" - opens story possibilities</p>
                  </div>
                  <div>
                    <h4 className="text-purple-400 font-medium">Clarification Questions</h4>
                    <p className="text-gray-300 text-sm">"Can my character do X without breaking law Y?" - shows respect for rules</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Discussion Etiquette</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Be respectful and constructive</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Stay on topic and relevant to the world</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Build on others' ideas positively</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Ask for clarification when confused</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Thank creators for their responses</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Types of Community Participation</h3>
              
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="text-indigo-300 font-semibold mb-2">Question & Answer</h4>
                <p className="text-gray-300 text-sm mb-3">
                  The Q&A system lets you ask world creators about their universe and get official answers 
                  that become part of the world's lore.
                </p>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Ask about world mechanics and how laws work</li>
                  <li>• Inquire about unexplored areas or possibilities</li>
                  <li>• Seek clarification on existing lore</li>
                  <li>• Request guidance for your contributions</li>
                </ul>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Community Posts</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Community posts are for broader discussions about the world, collaboration ideas, 
                  and general community building.
                </p>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Propose collaborative storylines</li>
                  <li>• Discuss world themes and interpretations</li>
                  <li>• Share appreciation for others' contributions</li>
                  <li>• Organize community events or challenges</li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">Comments and Replies</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Engage with others' content through thoughtful comments that add value to the discussion.
                </p>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Provide constructive feedback on scrolls</li>
                  <li>• Ask follow-up questions to expand discussions</li>
                  <li>• Share related ideas or connections</li>
                  <li>• Express appreciation for quality content</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-300 font-semibold mb-2">Building Community Culture</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Welcome new members and help them understand the world</li>
                <li>• Celebrate others' approved contributions</li>
                <li>• Share constructive feedback that helps improve content</li>
                <li>• Maintain a positive, inclusive atmosphere</li>
                <li>• Respect different creative approaches and styles</li>
                <li>• Help resolve conflicts diplomatically</li>
              </ul>
            </div>
          </div>
        );

      case 'forking':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Forking Worlds</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Forking allows you to create your own version of an existing world. This is perfect for 
                exploring "what if" scenarios, alternate timelines, or putting your own spin on a concept you love.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">When to Consider Forking</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-indigo-400 font-medium">Creative Differences</h4>
                    <p className="text-gray-300 text-sm">You have a different vision for how the world could develop</p>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-medium">Alternate Timelines</h4>
                    <p className="text-gray-300 text-sm">You want to explore what would happen if key events went differently</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-purple-400 font-medium">Inactive Worlds</h4>
                    <p className="text-gray-300 text-sm">The original creator is no longer active and you want to continue development</p>
                  </div>
                  <div>
                    <h4 className="text-amber-400 font-medium">Experimentation</h4>
                    <p className="text-gray-300 text-sm">You want to test major changes without affecting the original</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6">
              <h3 className="text-indigo-300 font-semibold mb-4">Fork Etiquette</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Credit the Original</h4>
                    <p className="text-gray-300 text-sm">Always acknowledge the original creator and world in your description</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Explain Your Changes</h4>
                    <p className="text-gray-300 text-sm">Be clear about what you're changing and why</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Respect the Source</h4>
                    <p className="text-gray-300 text-sm">Don't use forking to criticize or mock the original world</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Make Meaningful Changes</h4>
                    <p className="text-gray-300 text-sm">Ensure your fork offers something genuinely different</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Types of Forks</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-semibold mb-2">Alternate Timeline</h4>
                  <p className="text-gray-300 text-sm mb-2">
                    Change a key historical event and explore the consequences
                  </p>
                  <p className="text-gray-400 text-xs italic">
                    "What if the Great War never happened in this world?"
                  </p>
                </div>

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-semibold mb-2">Rule Variation</h4>
                  <p className="text-gray-300 text-sm mb-2">
                    Modify one or more world laws to create different dynamics
                  </p>
                  <p className="text-gray-400 text-xs italic">
                    "Magic ages you, but also grants immortality"
                  </p>
                </div>

                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-purple-300 font-semibold mb-2">Setting Shift</h4>
                  <p className="text-gray-300 text-sm mb-2">
                    Move the world's concepts to a different time or place
                  </p>
                  <p className="text-gray-400 text-xs italic">
                    "The same magic system, but in a modern city"
                  </p>
                </div>

                <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                  <h4 className="text-amber-300 font-semibold mb-2">Perspective Change</h4>
                  <p className="text-gray-300 text-sm mb-2">
                    Focus on different aspects or viewpoints of the same world
                  </p>
                  <p className="text-gray-400 text-xs italic">
                    "The world from the perspective of its creatures"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Forking Process</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                  <span className="text-gray-300">Choose a world you want to fork and understand it thoroughly</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                  <span className="text-gray-300">Decide what specific changes you want to make</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                  <span className="text-gray-300">Click the "Fork World" button on the world's page</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">4</div>
                  <span className="text-gray-300">Modify the world laws, description, and roles as needed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">5</div>
                  <span className="text-gray-300">Build your community and start accepting contributions</span>
                </div>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-300 font-semibold mb-2">Forking Considerations</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Forked worlds start fresh - you won't inherit the original's community</li>
                <li>• You'll need to build your own contributor base</li>
                <li>• Consider reaching out to the original creator as a courtesy</li>
                <li>• Make sure your changes are substantial enough to justify a fork</li>
                <li>• Be prepared to actively manage your new world</li>
              </ul>
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
          <Users className="h-8 w-8 text-indigo-400 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Collaboration Guide</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Work with others to build amazing worlds
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
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Collaborate?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Put your collaboration skills to work by joining existing worlds or creating your own!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/explore"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Target className="h-5 w-5 mr-2" />
              Find Worlds to Join
            </a>
            <a
              href="/create-world"
              className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <Users className="h-5 w-5 mr-2" />
              Create Your World
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}