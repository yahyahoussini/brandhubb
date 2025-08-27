import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            className="mb-8"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-muted-foreground">Effective: May 31, 2025</p>
        </div>

        {/* Content */}
        <div className="glass-card p-8 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">Data Categories We Collect</h2>
            <p className="text-muted-foreground">
              We collect personal information (email, name, payment/billing info), cookies & usage data 
              (IP addresses, user agents, page views, timestamps, device IDs) to provide and improve our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">Purposes of Data Collection</h2>
            <div className="text-muted-foreground space-y-2">
              <p>We use your data to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Provide and maintain our service</li>
                <li>Notify you of changes to our service</li>
                <li>Provide interactive features and customer support</li>
                <li>Conduct analytics and monitoring</li>
                <li>Handle billing and account management</li>
                <li>Send marketing and promotional communications (opt-out available)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">Data Retention & Transfer</h2>
            <p className="text-muted-foreground">
              Data is kept as necessary for business purposes. Data may be transferred outside your jurisdiction. 
              We take reasonable steps to ensure security, but cannot guarantee 100% protection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">Data Disclosures</h2>
            <p className="text-muted-foreground">
              We may disclose your data for legal obligations, mergers & acquisitions, to affiliates and 
              service providers, for purpose-bound disclosures, or with your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">GDPR Rights</h2>
            <div className="text-muted-foreground space-y-2">
              <p>Under GDPR, you have rights to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Access your personal data</li>
                <li>Rectify inaccurate information</li>
                <li>Delete your data</li>
                <li>Restrict processing</li>
                <li>Object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">CalOPPA Compliance</h2>
            <p className="text-muted-foreground">
              We provide anonymous browsing capabilities, clearly labeled privacy policy, change notices, 
              and editing options via email. We honor Do Not Track signals when enabled in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">CCPA Rights</h2>
            <p className="text-muted-foreground">
              California residents have rights to know what personal data is collected, delete personal data, 
              and opt-out of data sales. We do not sell personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">Service Providers & Analytics</h2>
            <div className="text-muted-foreground space-y-2">
              <p>We use third-party services including:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Google Analytics for website analytics</li>
                <li>Google Ads and Facebook Ads for behavioral remarketing</li>
                <li>Stripe for payment processing (no card storage on our servers)</li>
              </ul>
              <p className="mt-2">Opt-out links are available for advertising services.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">Payment Processing</h2>
            <p className="text-muted-foreground">
              All payment processing is handled via Stripe. We do not store credit card information on our servers. 
              Please refer to Stripe's privacy policy for information about payment data handling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not intended for users under 13 years of age. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about this Privacy Policy or to exercise your rights, please contact us at:{" "}
              <a href="mailto:info@brandhub.co.ke" className="text-accent hover:underline">
                info@brandhub.co.ke
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;