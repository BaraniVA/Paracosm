import React from 'react';
import { FileText, Users, Shield, AlertTriangle, Scale, Globe } from 'lucide-react';

export function TermsOfService() {
  const lastUpdated = "December 22, 2024";

  type SectionContentItem = {
    text: string;
    subtitle?: string;
  };

  type Section = {
    title: string;
    icon: React.ReactNode;
    content: SectionContentItem[];
  };

  const sections: Section[] = [
    {
      title: "Acceptance of Terms",
      icon: <FileText className="h-6 w-6" />,
      content: [
        {
          text: "By accessing and using Paracosm, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
        },
        {
          text: "These Terms of Service apply to all users of the platform, including visitors, registered users, and content creators."
        },
        {
          text: "We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms."
        }
      ]
    },
    {
      title: "User Accounts and Responsibilities",
      icon: <Users className="h-6 w-6" />,
      content: [
        {
          subtitle: "Account Creation",
          text: "You must provide accurate and complete information when creating your account. You are responsible for maintaining the security of your account credentials."
        },
        {
          subtitle: "Age Requirements",
          text: "You must be at least 13 years old to use Paracosm. Users under 18 should have parental guidance when using the platform."
        },
        {
          subtitle: "Account Responsibility",
          text: "You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use of your account."
        },
        {
          subtitle: "One Account Per Person",
          text: "Each person may only maintain one account. Creating multiple accounts to circumvent restrictions is prohibited."
        }
      ]
    },
    {
      title: "Content and Intellectual Property",
      icon: <Scale className="h-6 w-6" />,
      content: [
        {
          subtitle: "Your Content",
          text: "You retain ownership of the content you create on Paracosm, including worlds, scrolls, questions, and comments. By posting content, you grant us a license to display, distribute, and store your content as necessary to provide our services."
        },
        {
          subtitle: "Content License",
          text: "When you post content to public worlds, you grant other users the right to view, fork, and build upon your content in accordance with our platform's collaborative features."
        },
        {
          subtitle: "Respect Others' Rights",
          text: "Do not post content that infringes on others' intellectual property rights. This includes copyrighted text, images, or other materials you don't have permission to use."
        },
        {
          subtitle: "Content Removal",
          text: "We reserve the right to remove content that violates these terms or our community guidelines. You can also delete your own content at any time."
        }
      ]
    },
    {
      title: "Acceptable Use Policy",
      icon: <Shield className="h-6 w-6" />,
      content: [
        {
          subtitle: "Prohibited Content",
          text: "You may not post content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable."
        },
        {
          subtitle: "Respectful Behavior",
          text: "Treat other users with respect. Harassment, bullying, doxxing, or any form of abuse will not be tolerated."
        },
        {
          subtitle: "No Spam or Abuse",
          text: "Do not spam, flood, or abuse the platform's features. This includes excessive posting, vote manipulation, or creating fake accounts."
        },
        {
          subtitle: "Platform Integrity",
          text: "Do not attempt to hack, exploit, or disrupt the platform's functionality. Report security vulnerabilities responsibly."
        }
      ]
    },
    {
      title: "Community Guidelines",
      icon: <Users className="h-6 w-6" />,
      content: [
        {
          subtitle: "Collaborative Spirit",
          text: "Paracosm is built on collaboration. Engage constructively with other creators and respect their creative vision."
        },
        {
          subtitle: "Quality Content",
          text: "Strive to create high-quality, thoughtful content that adds value to the worlds you participate in."
        },
        {
          subtitle: "Constructive Feedback",
          text: "When providing feedback or criticism, be constructive and respectful. Focus on the content, not the person."
        },
        {
          subtitle: "Cultural Sensitivity",
          text: "Be mindful of cultural differences and avoid content that could be offensive or harmful to specific groups."
        }
      ]
    },
    {
      title: "Privacy and Data Protection",
      icon: <Shield className="h-6 w-6" />,
      content: [
        {
          subtitle: "Privacy Policy",
          text: "Our Privacy Policy explains how we collect, use, and protect your personal information. By using Paracosm, you agree to our privacy practices."
        },
        {
          subtitle: "Data Security",
          text: "We implement reasonable security measures to protect your data, but cannot guarantee absolute security. Use strong passwords and keep your account secure."
        },
        {
          subtitle: "Public vs Private Content",
          text: "Understand the difference between public and private worlds. Content in public worlds is visible to all users, while private world content is restricted."
        }
      ]
    },
    {
      title: "Service Availability and Modifications",
      icon: <Globe className="h-6 w-6" />,
      content: [
        {
          subtitle: "Service Availability",
          text: "We strive to keep Paracosm available 24/7, but cannot guarantee uninterrupted service. We may need to perform maintenance or updates that temporarily affect availability."
        },
        {
          subtitle: "Feature Changes",
          text: "We may add, modify, or remove features at any time. We'll try to provide notice of significant changes that affect how you use the platform."
        },
        {
          subtitle: "Service Termination",
          text: "We reserve the right to terminate or suspend accounts that violate these terms. In most cases, we'll provide warnings before taking action."
        }
      ]
    },
    {
      title: "Disclaimers and Limitations",
      icon: <AlertTriangle className="h-6 w-6" />,
      content: [
        {
          subtitle: "Service 'As Is'",
          text: "Paracosm is provided 'as is' without warranties of any kind. We don't guarantee that the service will meet your specific needs or be error-free."
        },
        {
          subtitle: "User Content",
          text: "We are not responsible for user-generated content. Users are solely responsible for the content they post and any consequences thereof."
        },
        {
          subtitle: "Third-Party Links",
          text: "Our platform may contain links to third-party websites. We are not responsible for the content or practices of these external sites."
        },
        {
          subtitle: "Limitation of Liability",
          text: "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of Paracosm."
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-indigo-400 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Terms of Service</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
          These terms govern your use of Paracosm and outline the rights and responsibilities of all users.
        </p>
        <p className="text-gray-400 text-sm">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Welcome to Paracosm</h2>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            Paracosm is a collaborative platform for creating and sharing fictional worlds. These Terms of Service ("Terms") 
            govern your access to and use of our platform, including our website, services, and applications.
          </p>
          <p>
            By using Paracosm, you agree to these Terms. If you don't agree with any part of these terms, 
            you may not access or use our service.
          </p>
        </div>
      </div>

      {/* Main Sections */}
      {sections.map((section, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
              {section.icon}
            </div>
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
          </div>
          
          <div className="space-y-6">
            {section.content.map((item, itemIndex) => (
              <div key={itemIndex}>
                {item.subtitle && (
                  <h3 className="text-lg font-medium text-white mb-2">{item.subtitle}</h3>
                )}
                <p className="text-gray-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Enforcement */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Enforcement and Violations</h2>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            We take violations of these Terms seriously. Depending on the severity and nature of the violation, 
            we may take the following actions:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Issue warnings or temporary restrictions</li>
            <li>Remove or hide violating content</li>
            <li>Suspend or terminate user accounts</li>
            <li>Report illegal activities to appropriate authorities</li>
          </ul>
          <p>
            We strive to be fair and consistent in our enforcement. If you believe action was taken in error, 
            you can appeal through our contact form.
          </p>
        </div>
      </div>

      {/* Governing Law */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Governing Law and Disputes</h2>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            These Terms are governed by the laws of the United States. Any disputes arising from these Terms 
            or your use of Paracosm will be resolved through binding arbitration, except where prohibited by law.
          </p>
          <p>
            Before pursuing formal dispute resolution, we encourage you to contact us directly to resolve any issues. 
            Most problems can be resolved through open communication.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            If you have any questions about these Terms of Service or need clarification on any point, please don't hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Contact Us
            </a>
            <a
              href="mailto:legal@paracosm.app"
              className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              legal@paracosm.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}