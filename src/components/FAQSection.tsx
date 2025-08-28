import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const FAQSection = () => {
  const faqs = [
    {
      question: 'How fast will I receive my designs?',
      answer:
        'Most requests are completed within 1–3 working days. Complex items like websites or animations may take longer, but we provide updates every 48 hours to keep you informed of progress.',
    },
    {
      question: 'Is the work really unlimited?',
      answer:
        'Yes! You can add as many design requests as you want to your queue. We process them one at a time to ensure quality and focus on each project.',
    },
    {
      question: 'What happens after I subscribe?',
      answer:
        "Within 24 hours, you'll receive an invitation to your dedicated Trello board. This is where you'll submit all requests, track progress, and communicate with your team. We include a guided walkthrough to get you started.",
    },
    {
      question: 'How do I submit design requests?',
      answer:
        "Simply add your request to the 'Backlog' column on your Trello board with detailed notes, examples, and any files you'd like to include. The more specific you are, the better we can deliver exactly what you need.",
    },
    {
      question: "What if I'm not happy with a design?",
      answer:
        "We offer unlimited revisions until you're 100% satisfied. Your success is our priority, and we won't stop until you love the final result.",
    },
    {
      question: 'Do you work on single projects?',
      answer:
        'Absolutely! Book a call with us to discuss a one-time sprint for branding, web design, or Webflow development. We can structure a custom project timeline for your needs.',
    },
    {
      question: 'How does pausing my subscription work?',
      answer:
        "You can pause your billing at any time. We operate on 31-day cycles, so if you've used 21 days and pause, your remaining 10 days are banked for when you resume. No days are lost.",
    },
    {
      question: 'Can you handle big projects with multiple pages?',
      answer:
        'Yes! We break large projects into phases and provide progress updates every 24–48 hours. This ensures you stay informed and can provide feedback throughout the development process.',
    },
    {
      question: 'Do you both design and build websites?',
      answer:
        'Absolutely. Web design and Webflow development are included in both subscription packages. We handle everything from concept to live website.',
    },
    {
      question: 'What if I only need one thing designed?',
      answer:
        'Subscribe for a month, get your design completed, then pause or cancel. Your unused time is preserved, so you only pay for what you use.',
    },
    {
      question: "What's your refund policy?",
      answer:
        "We offer a 60% refund within the first 7 days if you're not impressed with our work. This gives you time to experience our quality and process risk-free.",
    },
    {
      question: 'Can I cancel anytime?',
      answer:
        'Yes, there are no contracts or commitments. You can cancel your subscription at any time, and any unused days will be preserved if you decide to return.',
    },
    {
      question: 'Why choose BrandHUB over an agency or freelancer?',
      answer:
        'We offer a flat monthly rate with no surprises, a streamlined process that eliminates back-and-forth, and internal quality reviews before any work reaches you. Plus, you get an entire creative team, not just one person.',
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about our design subscription service.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="glass-card p-8">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-white/10 last:border-b-0"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Still have questions CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Still have questions? We'd love to help.
          </p>
          <Button
            variant="hero"
            size="lg"
            onClick={() =>
              window.open('https://cal.com/jeevan-singh/discovery', '_blank')
            }
          >
            Book a Call
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
