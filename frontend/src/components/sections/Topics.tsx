import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, ThumbsUp, Send, Sparkles } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  description: string;
  author: string;
  votes: number;
  tags: string[];
}

const initialTopics: Topic[] = [
  {
    id: 1,
    title: "Virtual Threads in Production",
    description: "Real-world experiences with Project Loom virtual threads and how they changed our application architecture",
    author: "Anna K.",
    votes: 24,
    tags: ["Java 21", "Concurrency"],
  },
  {
    id: 2,
    title: "GraalVM Native Images",
    description: "Building and deploying native Java applications with GraalVM for faster startup and lower memory",
    author: "Marcus B.",
    votes: 18,
    tags: ["GraalVM", "Performance"],
  },
  {
    id: 3,
    title: "Spring Boot 3 Migration Stories",
    description: "Lessons learned from migrating large Spring Boot 2 applications to Spring Boot 3",
    author: "Lisa M.",
    votes: 21,
    tags: ["Spring Boot", "Migration"],
  },
  {
    id: 4,
    title: "Pattern Matching Best Practices",
    description: "How to effectively use pattern matching for switch and instanceof in modern Java",
    author: "Thomas S.",
    votes: 15,
    tags: ["Java 21", "Language Features"],
  },
  {
    id: 5,
    title: "Kubernetes Operators in Java",
    description: "Building Kubernetes operators using the Java Operator SDK",
    author: "Julia W.",
    votes: 12,
    tags: ["Kubernetes", "Cloud Native"],
  },
  {
    id: 6,
    title: "AI/ML Integration with Java",
    description: "Integrating LLMs and ML models into Java applications using Langchain4j",
    author: "Felix R.",
    votes: 28,
    tags: ["AI/ML", "LLM"],
  },
];

export const Topics = () => {
  const { toast } = useToast();
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [newTopic, setNewTopic] = useState({ title: "", description: "", author: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVote = (id: number) => {
    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, votes: topic.votes + 1 } : topic
    ).sort((a, b) => b.votes - a.votes));
    
    toast({
      title: "Vote recorded! 👍",
      description: "Thanks for supporting this topic idea.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTopic.title.trim() || !newTopic.author.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and your name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const topic: Topic = {
      id: Date.now(),
      title: newTopic.title,
      description: newTopic.description || "No description provided",
      author: newTopic.author,
      votes: 0,
      tags: ["New"],
    };

    setTopics([topic, ...topics]);
    setNewTopic({ title: "", description: "", author: "" });
    setIsSubmitting(false);

    toast({
      title: "Topic Submitted! 🎉",
      description: "Your topic idea has been added to the list.",
    });
  };

  return (
    <section id="topics" className="py-24 bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Session <span className="text-gradient">Topics</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Suggest topics you'd like to present or discuss. Vote for your favorites!
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Topic Suggestion Form */}
          <div className="lg:col-span-2">
            <Card className="glass-card shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="text-primary" />
                  Suggest a Topic
                </CardTitle>
                <CardDescription>
                  Have an idea? Share it with the community!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic-title">Topic Title *</Label>
                    <Input
                      id="topic-title"
                      placeholder="e.g., Reactive Streams Deep Dive"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic-desc">Description</Label>
                    <Textarea
                      id="topic-desc"
                      placeholder="What would you like to cover?"
                      value={newTopic.description}
                      onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic-author">Your Name *</Label>
                    <Input
                      id="topic-author"
                      placeholder="Your name"
                      value={newTopic.author}
                      onChange={(e) => setNewTopic({ ...newTopic, author: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Topic
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Topic List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={20} />
              <span className="font-semibold">{topics.length} Topics Suggested</span>
            </div>

            {topics.map((topic, index) => (
              <Card 
                key={topic.id} 
                className="glass-card hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    {/* Vote Button */}
                    <button
                      onClick={() => handleVote(topic.id)}
                      className="flex flex-col items-center justify-center min-w-[60px] p-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors group"
                    >
                      <ThumbsUp 
                        size={20} 
                        className="text-muted-foreground group-hover:text-primary transition-colors" 
                      />
                      <span className="text-lg font-bold mt-1">{topic.votes}</span>
                    </button>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{topic.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{topic.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {topic.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        <span className="text-xs text-muted-foreground ml-auto">
                          by {topic.author}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
