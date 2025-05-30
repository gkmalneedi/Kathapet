import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive the latest news in your inbox.",
    });
    
    setEmail("");
  };

  return (
    <section className="bg-blue-600 rounded-lg p-8 text-white text-center mb-12">
      <h3 className="text-2xl font-bold mb-4">Stay Updated with NewsHub</h3>
      <p className="text-blue-100 mb-6">
        Get the latest news delivered directly to your inbox. Never miss important stories again.
      </p>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 text-gray-900"
        />
        <Button type="submit" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
          Subscribe
        </Button>
      </form>
    </section>
  );
}
