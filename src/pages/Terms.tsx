import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";

const Terms = () => {
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
            Terms & <span className="gradient-text">Conditions</span>
          </h1>
          <p className="text-muted-foreground">Last updated: May 31, 2025</p>
        </div>

        {/* Content */}
        <div className="glass-card p-8 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">1. Intellectual Property & Content</h2>
            <p className="text-muted-foreground">
              All site content and marks are owned or licensed by BrandHUB. No reuse without permission is allowed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">2. Ownership of Deliverables</h2>
            <p className="text-muted-foreground">
              All design deliverables and source files created for the Client are the Client's sole property. 
              BrandHUB may showcase work publicly unless restricted by NDA (see §19).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">3. Third-Party Fonts</h2>
            <p className="text-muted-foreground">
              If fonts need licenses, client must obtain licenses once disclosed by BrandHUB.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">4. User Representations & Prohibited Activities</h2>
            <p className="text-muted-foreground">
              No bots, hacking, disruption, malicious code, harassment, or rights violations are permitted. 
              Users must comply with all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">5. Feedback</h2>
            <p className="text-muted-foreground">
              Client feedback becomes BrandHUB property (unless §2 conflicts). This allows us to improve our services 
              and processes based on client input.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">6. Privacy Reference</h2>
            <p className="text-muted-foreground">
              Use of our services implies consent to the Privacy Policy. Site is hosted in England, UK. 
              Users consent to data transfer there.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">7. Refunds</h2>
            <p className="text-muted-foreground">
              Refunds are at BrandHUB's discretion. Requests in the first month may revoke rights to deliverables 
              and incur a 25% cancellation fee. Completed work is non-refundable. Stripe fees are non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">8. Modifications</h2>
            <p className="text-muted-foreground">
              Terms and site can change without notice. Connection interruptions may occur and are disclaimed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">9. Governing Law & Venue</h2>
            <p className="text-muted-foreground">
              Governed by the laws of England, United Kingdom. Disputes resolved in state or federal courts 
              in England, UK. Users consent to jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">10. Disclaimer & Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Services provided "as-is" with no warranties. No indirect or consequential damages. 
              Indemnification clause applies. Users assume responsibility for their use of services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">11. Licensing & Showcasing</h2>
            <p className="text-muted-foreground">
              Client responsible for licenses. BrandHUB licenses not transferred unless stated. 
              Showcasing permitted unless NDA restricts. Referrals may be made via third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 text-primary">Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms & Conditions, please contact us at:{" "}
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

export default Terms;