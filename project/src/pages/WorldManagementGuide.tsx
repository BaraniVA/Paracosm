import React, { useState } from 'react';
import { Settings, Users, Scroll, BarChart3, Shield, Clock, Target, CheckCircle, Lightbulb, ArrowRight } from 'lucide-react';

export function WorldManagementGuide() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: <Settings className="h-4 w-4" /> },
    { id: 'managing-inhabitants', title: 'Managing Inhabitants', icon: <Users className="h-4 w-4" /> },
    { id: 'reviewing-submissions', title: 'Reviewing Submissions', icon: <Scroll className="h-4 w-4" /> },
    { id: 'timeline-records', title: 'Timeline & Records', icon: <Clock className="h-4 w-4" /> },
    { id: 'community-growth', title: 'Growing Your Community', icon: <BarChart3 className="h-4 w-4" /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">World Management Overview</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                As a world creator, you're not just building a fictional universe—you're managing a community. 
                This guide covers advanced features and best practices for successful world management.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                Key Management Areas
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Community Management</h4>
                      <p className="text-gray-300 text-sm">Managing inhabitants, roles, and community dynamics</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Scroll className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Content Curation</h4>
                      <p className="text-gray-300 text-sm">Reviewing and approving submissions to maintain quality</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">World Documentation</h4>
                      <p className="text-gray-300 text-sm">Organizing timelines, records, and world information</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BarChart3 className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">Growth Strategy</h4>
                      <p className="text-gray-300 text-sm">Attracting contributors and building an active community</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-6">
              <h3 className="text-indigo-300 font-semibold mb-3">Management Principles</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Be responsive to your community's questions and submissions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Maintain consistent quality standards for approved content</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Foster a welcoming environment for new contributors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Keep your world's documentation organized and accessible</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300">Plan for long-term growth and evolution</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
              <h4 className="text-amber-300 font-semibold mb-2">Your World Dashboard</h4>
              <p className="text-gray-300 text-sm">
                Your world dashboard is your command center. It provides tools for reviewing submissions, 
                managing inhabitants, organizing content, and tracking your world's growth. Familiarize 
                yourself with all its features to manage your world effectively.
              </p>
            </div>
          </div>
        );

      case 'managing-inhabitants':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Managing Inhabitants</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Your inhabitants are the lifeblood of your world. Managing them effectively creates a 
                thriving community where everyone feels valued and motivated to contribute.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Inhabitant Lifecycle</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h4 className="text-white font-medium">Discovery & Joining</h4>
                    <p className="text-gray-300 text-sm">New users find your world and choose a role</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h4 className="text-white font-medium">Onboarding</h4>
                    <p className="text-gray-300 text-sm">Help them understand your world and start contributing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h4 className="text-white font-medium">Active Participation</h4>
                    <p className="text-gray-300 text-sm">Regular contributions and community engagement</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <h4 className="text-white font-medium">Recognition & Growth</h4>
                    <p className="text-gray-300 text-sm">Acknowledge valuable contributors and help them grow</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Welcoming New Inhabitants</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Respond to their first questions quickly</li>
                  <li>• Provide guidance on their chosen role</li>
                  <li>• Give constructive feedback on early submissions</li>
                  <li>• Connect them with other community members</li>
                  <li>• Be patient with their learning process</li>
                </ul>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-blue-300 font-semibold mb-2">Keeping Inhabitants Engaged</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Approve good content promptly</li>
                  <li>• Ask follow-up questions to their submissions</li>
                  <li>• Create collaborative storylines</li>
                  <li>• Recognize outstanding contributions publicly</li>
                  <li>• Provide new challenges and opportunities</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Role Management</h3>
              
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="text-indigo-300 font-semibold mb-2">Creating Effective Roles</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Give each role a clear purpose and scope</li>
                  <li>• Ensure roles complement each other</li>
                  <li>• Leave room for creative interpretation</li>
                  <li>• Update role descriptions based on community feedback</li>
                  <li>• Consider adding new roles as your world grows</li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">Role Distribution Tips</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Monitor which roles are most/least popular</li>
                  <li>• Encourage diversity in role selection</li>
                  <li>• Create storylines that involve multiple roles</li>
                  <li>• Don't force inhabitants into specific roles</li>
                  <li>• Allow role changes when appropriate</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-300 font-semibold mb-2">Handling Difficult Situations</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Address conflicts between inhabitants diplomatically</li>
                <li>• Set clear expectations for behavior and content quality</li>
                <li>• Use warnings before removing inhabitants</li>
                <li>• Document decisions for consistency</li>
                <li>• Consider mediation for complex disputes</li>
                <li>• Remove disruptive members when necessary for community health</li>
              </ul>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Inhabitant Analytics</h3>
              <p className="text-gray-300 text-sm mb-3">
                Use your dashboard to track inhabitant activity and engagement:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Monitor Activity</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Submission frequency and quality</li>
                    <li>• Question asking and engagement</li>
                    <li>• Community discussion participation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Identify Patterns</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Which roles attract the most contributors</li>
                    <li>• Common reasons for content rejection</li>
                    <li>• Peak activity times and seasons</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reviewing-submissions':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Reviewing Submissions</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Content review is one of your most important responsibilities. Your decisions shape your 
                world's quality and direction while affecting contributor motivation and engagement.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Review Criteria</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Consistency with World Laws</h4>
                    <p className="text-gray-300 text-sm">Does the submission follow your established rules and physics?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Quality and Engagement</h4>
                    <p className="text-gray-300 text-sm">Is it well-written, interesting, and adds value to your world?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Tone and Style Match</h4>
                    <p className="text-gray-300 text-sm">Does it fit the overall atmosphere and style of your world?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Compatibility with Existing Lore</h4>
                    <p className="text-gray-300 text-sm">Does it contradict or enhance what's already been established?</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium">Future Potential</h4>
                    <p className="text-gray-300 text-sm">Does it leave room for others to build upon or close off possibilities?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Approval Best Practices</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Approve quickly when content clearly meets standards</li>
                  <li>• Leave encouraging comments on approved submissions</li>
                  <li>• Ask follow-up questions to expand on good ideas</li>
                  <li>• Highlight exceptional contributions to the community</li>
                  <li>• Build on approved content in your own contributions</li>
                </ul>
              </div>
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h4 className="text-amber-300 font-semibold mb-2">Constructive Rejection</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Explain specific reasons for rejection</li>
                  <li>• Suggest how the submission could be improved</li>
                  <li>• Encourage resubmission after revisions</li>
                  <li>• Be respectful and supportive in your feedback</li>
                  <li>• Offer alternative directions that might work</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Review Workflow</h3>
              
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="text-indigo-300 font-semibold mb-2">Efficient Review Process</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">1</div>
                    <span className="text-gray-300 text-sm">Read the submission completely before making decisions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">2</div>
                    <span className="text-gray-300 text-sm">Check against world laws and existing lore</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">3</div>
                    <span className="text-gray-300 text-sm">Consider the contributor's role and experience level</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">4</div>
                    <span className="text-gray-300 text-sm">Make your decision and provide clear feedback</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">Handling Edge Cases</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• When in doubt, ask clarifying questions before deciding</li>
                  <li>• Consider partial approval with suggested modifications</li>
                  <li>• Consult with experienced community members for difficult decisions</li>
                  <li>• Document your reasoning for complex or controversial decisions</li>
                  <li>• Be willing to reconsider if new information emerges</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-300 font-semibold mb-2">Response Time Guidelines</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-white font-medium mb-1">Target Response Times:</h5>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Simple approvals: Within 24 hours</li>
                    <li>• Complex submissions: Within 3 days</li>
                    <li>• Questions: Within 12 hours</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-1">When You're Busy:</h5>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Acknowledge receipt of submissions</li>
                    <li>• Set expectations for review timeline</li>
                    <li>• Prioritize active contributors</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-300 font-semibold mb-2">Common Review Mistakes</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Being too strict and discouraging creativity</li>
                <li>• Being too lenient and allowing quality to decline</li>
                <li>• Taking too long to respond to submissions</li>
                <li>• Not providing clear reasons for rejection</li>
                <li>• Playing favorites with certain contributors</li>
                <li>• Changing standards without communicating to the community</li>
              </ul>
            </div>
          </div>
        );

      case 'timeline-records':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Timeline Management & World Records</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Organizing your world's information through timelines and records creates a comprehensive 
                knowledge base that helps contributors understand your universe and creates new story opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-400" />
                  Timeline System
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Organize your world's history into eras and events that create a clear chronological structure.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Group related events into eras</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Use consistent dating systems</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Tag events by type and importance</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Leave gaps for future development</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center">
                  <Scroll className="h-5 w-5 mr-2 text-green-400" />
                  World Records
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Create detailed documentation for important world elements like locations, characters, and concepts.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Document key locations and their histories</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Explain complex systems and mechanics</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Link records to related content</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Keep information accessible and searchable</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Timeline Best Practices</h3>
              
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="text-indigo-300 font-semibold mb-2">Creating Effective Eras</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Choose era names that reflect their character (e.g., "The Golden Age", "The Time of Shadows")</li>
                  <li>• Make eras meaningful periods with distinct characteristics</li>
                  <li>• Ensure smooth transitions between eras</li>
                  <li>• Include both major events and cultural shifts</li>
                  <li>• Consider how different roles would experience each era</li>
                </ul>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Event Documentation</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Include both public and private events (use privacy settings appropriately)</li>
                  <li>• Add detailed descriptions that set the scene</li>
                  <li>• Link events to specific roles when relevant</li>
                  <li>• Use tags to categorize events (war, magic, politics, etc.)</li>
                  <li>• Include subnotes for additional context and details</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">World Records Strategy</h3>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">What to Document</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <h5 className="text-white font-medium mb-1">Essential Records:</h5>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• Major locations and landmarks</li>
                      <li>• Important historical figures</li>
                      <li>• Magic or technology systems</li>
                      <li>• Cultural practices and traditions</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-1">Advanced Records:</h5>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• Organizations and their structures</li>
                      <li>• Languages and communication</li>
                      <li>• Economic systems and trade</li>
                      <li>• Mysteries and unexplored areas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h4 className="text-amber-300 font-semibold mb-2">Linking and Organization</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Link records to relevant world laws, roles, or timeline events</li>
                  <li>• Use consistent categorization across all records</li>
                  <li>• Create cross-references between related records</li>
                  <li>• Update records as your world evolves</li>
                  <li>• Make records discoverable through good titles and descriptions</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-blue-300 font-semibold mb-4">Maintenance and Updates</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-medium">Regular Review Schedule</h4>
                  <p className="text-gray-300 text-sm">Set aside time monthly to review and update your timeline and records based on new approved content.</p>
                </div>
                <div>
                  <h4 className="text-white font-medium">Community Contributions</h4>
                  <p className="text-gray-300 text-sm">Encourage inhabitants to suggest new records or timeline entries based on their contributions.</p>
                </div>
                <div>
                  <h4 className="text-white font-medium">Version Control</h4>
                  <p className="text-gray-300 text-sm">Keep track of major changes to important records and consider how they affect existing lore.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'community-growth':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Growing Your Community</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Building a thriving community around your world takes time and strategy. Learn how to attract 
                quality contributors, keep them engaged, and create a sustainable creative ecosystem.
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Growth Phases</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h4 className="text-white font-medium">Foundation (0-5 inhabitants)</h4>
                    <p className="text-gray-300 text-sm">Focus on creating quality content yourself and attracting your first contributors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h4 className="text-white font-medium">Early Growth (5-15 inhabitants)</h4>
                    <p className="text-gray-300 text-sm">Establish community culture and encourage regular participation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h4 className="text-white font-medium">Expansion (15-50 inhabitants)</h4>
                    <p className="text-gray-300 text-sm">Scale your management approach and develop community leaders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                  <div>
                    <h4 className="text-white font-medium">Maturity (50+ inhabitants)</h4>
                    <p className="text-gray-300 text-sm">Focus on sustainability and long-term community health</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Attracting Contributors</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Write compelling world descriptions</li>
                  <li>• Create interesting, open-ended laws</li>
                  <li>• Be active and responsive to questions</li>
                  <li>• Share your world with friends and communities</li>
                  <li>• Participate in other worlds to build relationships</li>
                  <li>• Maintain high-quality approved content</li>
                </ul>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-blue-300 font-semibold mb-2">Retention Strategies</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Approve good content quickly</li>
                  <li>• Ask follow-up questions to submissions</li>
                  <li>• Build on contributors' ideas in your own content</li>
                  <li>• Create collaborative storylines</li>
                  <li>• Recognize outstanding contributions publicly</li>
                  <li>• Provide new challenges and opportunities</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Community Building Techniques</h3>
              
              <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
                <h4 className="text-indigo-300 font-semibold mb-2">Creating Community Events</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Host themed writing challenges or contests</li>
                  <li>• Create collaborative storylines that involve multiple contributors</li>
                  <li>• Organize Q&A sessions about your world's mysteries</li>
                  <li>• Celebrate milestones (100th scroll, anniversary, etc.)</li>
                  <li>• Create seasonal events tied to your world's calendar</li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">Fostering Collaboration</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Encourage contributors to reference each other's work</li>
                  <li>• Create storylines that require multiple perspectives</li>
                  <li>• Facilitate connections between contributors with complementary roles</li>
                  <li>• Share behind-the-scenes insights about your world's development</li>
                  <li>• Ask for community input on major world decisions</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Scaling Your Management</h3>
              
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                <h4 className="text-amber-300 font-semibold mb-2">As Your Community Grows</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Develop clear guidelines and expectations</li>
                  <li>• Create systems for handling increased submission volume</li>
                  <li>• Identify and nurture community leaders</li>
                  <li>• Consider creating specialized roles for experienced contributors</li>
                  <li>• Implement regular community feedback sessions</li>
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h4 className="text-red-300 font-semibold mb-2">Avoiding Common Pitfalls</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Don't sacrifice quality for quantity of content</li>
                  <li>• Avoid playing favorites with certain contributors</li>
                  <li>• Don't let toxic members damage community culture</li>
                  <li>• Resist the urge to control every aspect of development</li>
                  <li>• Don't ignore community feedback and suggestions</li>
                  <li>• Avoid burnout by pacing yourself and taking breaks</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Measuring Success</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Quantitative Metrics</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Number of active contributors</li>
                    <li>• Submission frequency and approval rates</li>
                    <li>• Community discussion engagement</li>
                    <li>• New member retention rates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Qualitative Indicators</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    <li>• Quality and creativity of submissions</li>
                    <li>• Positive community interactions</li>
                    <li>• Contributors building on each other's work</li>
                    <li>• Organic community-driven initiatives</li>
                  </ul>
                </div>
              </div>
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
          <Settings className="h-8 w-8 text-indigo-400 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">World Management Guide</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Advanced features for world creators
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
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Manage Your World?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Apply these management techniques to create a thriving community around your world!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/create-world"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Settings className="h-5 w-5 mr-2" />
              Create Your World
            </a>
            <a
              href="/profile"
              className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              <Target className="h-5 w-5 mr-2" />
              View Your Worlds
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}