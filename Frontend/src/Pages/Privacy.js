import React, { useEffect } from 'react';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div>
      
      <Header />
      <div className="bg-white text-primary text-sm font-sans p-8 px-20">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Last Updated: March 2025</p>

        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          pettypets Inc. ("we," "us," or "our") is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and protect your personal
          information when you visit <a href="https://www.pettypets.com" className="text-blue-600 underline">www.pettypets.com</a> (the "Site").
          By using our services, you agree to the terms outlined in this policy.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">We collect the following types of information:</p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Personal Information:</strong> Name, email, shipping address, phone number, and payment details.</li>
          <li><strong>Device & Usage Data:</strong> Browser type, IP address, and interactions with our Site (collected via cookies and analytics tools).</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p className="mb-4">We use your information for the following purposes:</p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Authentication:</strong> To verify your identity when you sign in.</li>
          <li><strong>Order Processing:</strong> To process transactions, deliver products, and provide customer support.</li>
          <li><strong>Marketing Communications:</strong> To send promotional offers if you opt-in (you may unsubscribe anytime).</li>
          <li><strong>Analytics & Website Optimization:</strong> To track Site performance and improve user experience.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
        <p className="mb-4">We use third-party services to process payments and analyze website traffic:</p>
        <ul className="list-disc list-inside mb-4">
          <li><strong>Stripe Payments:</strong> Payments are securely processed via Stripe. We do not store your payment details.</li>
          <li><strong>Google Analytics:</strong> We use Google Analytics to track website activity (<a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 underline">opt-out here</a>).</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Data Storage & Security</h2>
        <p className="mb-4">
          - Personal data is securely stored using encryption and access controls.
          - We retain data only as long as necessary for order processing and legal compliance.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc list-inside mb-4">
          <li>Request access to your personal data.</li>
          <li>Request corrections or deletion of your information.</li>
          <li>Opt-out of marketing emails.</li>
          <li>Delete your account & data by contacting <a href="mailto:support@pettypets.com" className="text-blue-600 underline">support@pettypets.com</a>.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
        <p className="mb-4">We may update this Privacy Policy periodically. Any changes will be posted on this page.</p>

        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions, contact us at <a href="mailto:support@pettypets.com" className="text-blue-600 underline">support@pettypets.com</a>.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;