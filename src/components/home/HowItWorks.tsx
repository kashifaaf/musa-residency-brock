import { Search, Home, Calendar, CreditCard } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search for homes",
    description: "Browse available creative spaces in your desired location and dates",
  },
  {
    icon: Home,
    title: "Request to book",
    description: "Send a booking request with a personal message to the host",
  },
  {
    icon: Calendar,
    title: "Get approved",
    description: "Hosts have 24 hours to review and approve your request",
  },
  {
    icon: CreditCard,
    title: "Secure payment",
    description: "Payment is processed only after host approval for peace of mind",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground">
            Book your next creative stay in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}