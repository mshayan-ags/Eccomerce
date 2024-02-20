import React, { useEffect } from 'react';
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const TermsOfUse = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // This makes the scrolling smooth
    });
  }, [])
  return (
    <div>
      
      <Header />
      <div className="bg-white text-primary text-sm font-sans p-8 px-20">
        <h1 className="text-4xl font-bold mb-6">Terms of Use</h1>
        <p className="mb-4">Updated January 2025</p>

        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          Welcome to <strong>pettypets.com</strong>. By accessing or using our Site, you agree to comply with the following Terms of Use.
          Please read these carefully. If you do not agree, please discontinue use of the Site.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Use of the Site</h2>
        <p className="mb-4">
          pettypets.com is operated by <strong>pettypets Inc.</strong> to provide a convenient online shopping experience.
          All transactions are subject to the terms outlined below.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Order Fulfillment and Shipping</h2>
        <p className="mb-4">
          - Orders are processed by pettypets Inc. and sourced from trusted suppliers.
          <br />- Shipping times vary based on availability and location.
          <br />- All applicable shipping and handling charges will be shown during checkout.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Payment Processing</h2>
        <p className="mb-4">
          - Payments are securely processed through <strong>Stripe</strong>.
          <br />- pettypets Inc. does not store or retain payment details.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Refunds and Returns</h2>
        <p className="mb-4">
          - All sales are final once an order is processed.
          <br />- If you receive a defective or damaged product, contact us at support@pettypets.com.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
        <p className="mb-4">
          The Site and all content and products are provided "as is" without warranties. pettypets Inc. is not liable for
          product defects, shipping delays, or third-party supplier issues.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
        <p className="mb-4">
          Any disputes will be resolved through binding arbitration in Chicago, Illinois, under the American Arbitration Association.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
        <p className="mb-4">
          pettypets Inc. reserves the right to modify these Terms at any time. Updates will be posted on this page.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at <strong>support@pettypets.com</strong>.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfUse;

