import { ExternalLink, MessageCircle } from "lucide-react";

const WorkGallery = () => {
  const workCategories = [
    {
      title: "Branding + Website",
      subtitle: "Clinic",
      image1: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      image2: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop"
    },
    {
      title: "Design, App UX & UI",
      subtitle: "E-Commerce", 
      image1: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
      image2: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop"
    },
    {
      title: "Motion Design Content",
      subtitle: "Content",
      image1: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop", 
      image2: "https://images.unsplash.com/photo-1634942536808-0d1c6bec556a?w=400&h=300&fit=crop"
    },
    {
      title: "Development",
      subtitle: "Webflow",
      image1: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      image2: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop"
    },
    {
      title: "Packaging Design",
      subtitle: "E-Commerce",
      image1: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      image2: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop"
    },
    {
      title: "App UI/UX Design", 
      subtitle: "E-Commerce",
      image1: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
      image2: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop"
    }
  ];

  const capabilities = [
    { name: "Brand Strategy", message: "Hi! I'm interested in your Brand Strategy services. I'd like to discuss developing a comprehensive brand strategy for my business. Can we schedule a consultation?" },
    { name: "Brand Design", message: "Hello! I need help with Brand Design services. I'm looking to create/redesign my brand identity including logos and visual elements. Let's discuss my project!" },
    { name: "Motion Design", message: "Hi there! I'm interested in your Motion Design services. I need animated content and motion graphics for my brand. Can we talk about my requirements?" },
    { name: "Web Development", message: "Hello! I'd like to inquire about your Web Development services. I need a professional website built for my business. Let's discuss the details!" },
    { name: "Packaging Design", message: "Hi! I'm interested in your Packaging Design services. I need creative packaging solutions for my products. Can we schedule a call to discuss?" },
    { name: "App UI/UX", message: "Hello! I need App UI/UX Design services. I'm looking to create an intuitive and beautiful mobile app interface. Let's talk about my project!" },
    { name: "Web Design", message: "Hi! I'm interested in your Web Design services. I need a stunning website design that converts visitors into customers. Can we discuss my needs?" },
    { name: "Landing Pages", message: "Hello! I need Landing Page design services. I want high-converting landing pages for my marketing campaigns. Let's discuss the project!" },
    { name: "Marketing Posts/Content", message: "Hi there! I'm interested in your Marketing Posts/Content services. I need engaging social media content and marketing materials. Can we chat?" },
    { name: "3D Animation", message: "Hello! I'd like to inquire about your 3D Animation services. I need professional 3D animations for my brand. Let's discuss what you can create!" }
  ];

  const handleCapabilityClick = (capability: typeof capabilities[0]) => {
    const phoneNumber = "+254703026422"; // Updated WhatsApp business number for BrandHUB
    const encodedMessage = encodeURIComponent(capability.message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            All your creative department,{" "}
            <span className="gradient-text">under one roof</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            From strategy to execution, we handle every aspect of your creative needs.
          </p>
          
          {/* WhatsApp CTA */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <MessageCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm text-muted-foreground">
              Click any service below to start a WhatsApp conversation
            </p>
          </div>

          {/* Capabilities List */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {capabilities.map((capability, index) => (
              <button 
                key={index}
                onClick={() => handleCapabilityClick(capability)}
                className="px-4 py-2 glass rounded-full text-sm font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <span className="group-hover:text-accent transition-colors">
                  {capability.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Work Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {workCategories.map((category, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="glass-card card-hover overflow-hidden">
                {/* Image Pair */}
                <div className="flex gap-2 p-4 pb-2">
                  <div className="flex-1 aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={category.image1}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={category.image2}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Category Labels */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.subtitle}
                  </p>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Ready to see what we can create for your brand?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-hero px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1"
            >
              View Pricing
            </button>
            <button 
              onClick={() => window.open('https://cal.com/jeevan-singh/discovery', '_blank')}
              className="btn-glass px-8 py-4 rounded-full font-semibold"
            >
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkGallery;