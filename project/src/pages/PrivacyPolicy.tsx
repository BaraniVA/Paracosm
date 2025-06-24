import React from 'react';
import { Shield, Eye, Lock, Database, Globe, Users } from 'lucide-react';

export function PrivacyPolicy() {
  const lastUpdated = "December 22, 2024";

  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="h-6 w-6" />,
      content: [
        {
          subtitle: "Account Information",
          text: "When you create an account, we collect your email address, username, and any profile information you choose to provide, including profile pictures and bio."
        },
        {
          subtitle: "Content You Create",
          text: "We store the worlds, scrolls, questions, comments, and other content you create on our platform. This includes text, images, and any other media you upload."
        },
        {
          subtitle: "Usage Information",
          text: "We collect information about how you use Paracosm, including pages visited, features used, and interactions with other users' content."
        },
        {
          subtitle: "Technical Information",
          text: "We automatically collect certain technical information, including IP address, browser type, device information, and operating system."
        }
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="h-6 w-6" />,
      content: [
        {
          subtitle: "Provide Our Services",
          text: "We use your information to operate Paracosm, including creating and managing your account, storing your content, and enabling collaboration features."
        },
        {
          subtitle: "Improve Our Platform",
          text: "We analyze usage patterns to improve our features, fix bugs, and develop new functionality that better serves our community."
        },
        {
          subtitle: "Communication",
          text: "We may send you important updates about our service, security alerts, and responses to your support requests."
        },
        {
          subtitle: "Safety and Security",
          text: "We use your information to detect and prevent fraud, abuse, and other harmful activities on our platform."
        }
      ]
    },
    {
      title: "Information Sharing",
      icon: <Users className="h-6 w-6" />,
      content: [
        {
          subtitle: "Public Content",
          text: "Content you post in public worlds, including scrolls, questions, and comments, is visible to other users. Your username is displayed with your contributions."
        },
        {
          subtitle: "Private Worlds",
          text: "Content in private worlds is only visible to you and users you've specifically granted access to."
        },
        {
          subtitle: "Service Providers",
          text: "We may share information with trusted service providers who help us operate our platform, such as hosting and analytics services."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose information if required by law or to protect the rights, property, or safety of Paracosm, our users, or others."
        }
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="h-6 w-6" />,
      content: [
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption to protect your data in transit and at rest."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls to ensure only authorized personnel can access user data, and only when necessary."
        },
        {
          subtitle: "Regular Security Audits",
          text: "We regularly review and update our security practices to protect against emerging threats."
        },
        {
          subtitle: "Incident Response",
          text: "We have procedures in place to quickly respond to and mitigate any security incidents."
        }
      ]
    },
    {
      title: "Your Rights and Choices",
      icon: <Shield className="h-6 w-6" />,
      content: [
        {
          subtitle: "Access and Portability",
          text: "You can access and export your data at any time through your account settings."
        },
        {
          subtitle: "Correction and Updates",
          text: "You can update your profile information and account settings at any time."
        },
        {
          subtitle: "Content Control",
          text: "You can edit or delete your content, including worlds, scrolls, and comments. Note that some content may remain visible if it's been forked or referenced by others."
        },
        {
          subtitle: "Account Deletion",
          text: "You can delete your account at any time. This will remove your personal information, though some content may be retained in anonymized form."
        }
      ]
    },
    {
      title: "International Users",
      icon: <Globe className="h-6 w-6" />,
      content: [
        {
          subtitle: "Data Transfers",
          text: "Paracosm is operated from the United States. By using our service, you consent to the transfer of your information to the US."
        },
        {
          subtitle: "GDPR Compliance",
          text: "For users in the European Union, we comply with GDPR requirements and provide additional rights as required by law."
        },
        {
          subtitle: "Local Laws",
          text: "We respect local privacy laws and regulations in the jurisdictions where we operate."
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-8 w-8 text-indigo-400 mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h1>
        </div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
          Your privacy is important to us. This policy explains how we collect, use, and protect your information.
        </p>
        <p className="text-gray-400 text-sm">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Introduction */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Introduction</h2>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            Welcome to Paracosm. We're committed to protecting your privacy and being transparent about how we handle your data. 
            This Privacy Policy explains what information we collect, how we use it, and your rights regarding your personal information.
          </p>
          <p>
            By using Paracosm, you agree to the collection and use of information in accordance with this policy. 
            If you have any questions about this Privacy Policy, please contact us at privacy@paracosm.app.
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
                <h3 className="text-lg font-medium text-white mb-2">{item.subtitle}</h3>
                <p className="text-gray-300 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Cookies and Tracking */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Cookies and Tracking</h2>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            We use cookies and similar technologies to enhance your experience on Paracosm. These help us:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Keep you logged in to your account</li>
            <li>Remember your preferences and settings</li>
            <li>Analyze how our platform is used to improve our services</li>
            <li>Provide security features and prevent fraud</li>
          </ul>
          <p>
            You can control cookie settings through your browser, though some features may not work properly if cookies are disabled.
          </p>
        </div>
      </div>

      {/* Children's Privacy */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Children's Privacy</h2>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            Paracosm is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
            If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
          </p>
          <p>
            For users between 13 and 18, we recommend parental guidance when using our platform, especially when sharing personal information or creating content.
          </p>
        </div>
      </div>

      {/* Changes to Policy */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Changes to This Policy</h2>
        <div className="text-gray-300 leading-relaxed space-y-4">
          <p>
            We may update this Privacy Policy from time to time. When we do, we'll post the updated policy on this page and update the "Last updated" date. 
            For significant changes, we'll notify you via email or through a prominent notice on our platform.
          </p>
          <p>
            We encourage you to review this Privacy Policy periodically to stay informed about how we're protecting your information.
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl p-8 border border-indigo-500/20">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            If you have any questions about this Privacy Policy or how we handle your data, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Contact Us
            </a>
            <a
              href="mailto:privacy@paracosm.app"
              className="inline-flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              privacy@paracosm.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}