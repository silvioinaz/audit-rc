export type QuestionOption = {
  label: string;
  points: number;
};

export type Question = {
  id: string;
  text: string;
  options: QuestionOption[];
};

export type PillarStat = {
  primaryStat: string;
  keyStats: string[];
  annualImpact?: string;
  realityCheck: string[];
  source: string;
};

export type Pillar = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  questions: Question[];
  stats: PillarStat;
  maxScore: number;
};

export type ProspectInfo = {
  firstName: string;
  lastName: string;
  companyName: string;
  phone: string;
  email: string;
  website: string;
  industry: string;
  auditDate: string;
  googleRating: string;
  preCallNotes: string;
  monthlyRevenue: string;
  avgJobValue: string;
  customerDbSize: string;
  missedCallsMonth: string;
  monthlyLeads: string;
  monthlyVisitors: string;
  conversionRate: string;
};

export const industries = [
  "Home Services (HVAC, Plumbing, Roofing, Garage Door, Home Maintenance, Home Inspection)",
  "Healthcare & Wellness (Dental, Urgent Care, Clinics, Physical Therapy, Pilates, Body Work)",
  "Real Estate & Property Management",
  "Professional Services (Law, Accounting)",
  "General Contractor",
  "Landscaping",
  "Painting",
  "Windows & Doors",
  "Flooring",
  "Fencing",
  "Other",
];

export const pillars: Pillar[] = [
  {
    id: "voice-ai",
    title: "Voice AI",
    shortTitle: "Voice AI",
    description: "How effectively do you capture and respond to inbound phone calls 24/7?",
    icon: "Phone",
    maxScore: 100,
    stats: {
      primaryStat: "85% of missed callers never call back. Average missed call costs $250. 62% of calls go unanswered.",
      keyStats: [
        "62% of customers switch to competitors after poor service experience",
        "50% switch after only one bad experience",
        "Only 15% will attempt to call back after initial missed call",
        "28% of all business calls go unanswered on average",
      ],
      annualImpact: "$126,000–$1,170,000 per year in lost revenue from missed calls for SMBs",
      realityCheck: [
        "$800–$1,200 cost per missed call for Legal Services",
        "$600–$1,000 cost per missed call for Healthcare/Dental",
        "$400–$800 cost per missed call for Home Services",
        "$300–$600 cost per missed call for Professional Services",
      ],
      source: "Harvard Business Review, Lead Response Management Study, CallRail Study",
    },
    questions: [
      {
        id: "v1",
        text: "What percentage of your incoming calls are answered during business hours?",
        options: [
          { label: "Less than 70% (missing 30%+ of calls)", points: 0 },
          { label: "70-85% (missing 15-30% of calls)", points: 15 },
          { label: "Over 90% (missing less than 10% of calls)", points: 35 },
        ],
      },
      {
        id: "v2",
        text: "How do you handle calls outside of business hours (nights, weekends, holidays)?",
        options: [
          { label: "Voicemail only - no human or system response", points: 0 },
          { label: "Answering service takes basic messages for callback", points: 15 },
          { label: "24/7 call answering with immediate qualification and response", points: 30 },
        ],
      },
      {
        id: "v3",
        text: "How quickly do you respond to voicemails from potential customers?",
        options: [
          { label: "24+ hours or inconsistently", points: 0 },
          { label: "Within same business day (2-8 hours)", points: 10 },
          { label: "Within 5-10 minutes of receiving voicemail", points: 25 },
        ],
      },
      {
        id: "v4",
        text: "Can callers book appointments directly over the phone without waiting for human callback?",
        options: [
          { label: "No - requires human scheduling during business hours only", points: 0 },
          { label: "Can request times but needs human confirmation later", points: 5 },
          { label: "Yes - instant booking system available 24/7", points: 10 },
        ],
      },
    ],
  },
  {
    id: "conversational-ai",
    title: "Conversational AI",
    shortTitle: "Conv. AI",
    description: "How quickly and effectively do you respond across chat, social media, and SMS?",
    icon: "MessageSquare",
    maxScore: 100,
    stats: {
      primaryStat: "21x more likely to qualify leads responding within 5 minutes vs. 30+ minutes. 98% SMS open rate vs. 28% email.",
      keyStats: [
        "100x more likely to connect when responding within 5 minutes vs. 30 minutes",
        "8x greater conversion rates when contacted within first 5 minutes",
        "5x more likely to convert when responding within 5 min vs. 10 min",
        "287% higher conversion with omnichannel approach",
      ],
      annualImpact: "$547,500 annually from $1,500 daily loss due to 6-hour response delays",
      realityCheck: [
        "Only 7% of companies respond to leads within 5 minutes",
        "55% take 5+ days to respond to leads",
        "Average response time: 47 hours across all industries",
        "95% of text messages read within 3 minutes vs. 90 minutes for email",
      ],
      source: "Lead Response Management Study, Inside Sales, Drift Study, Aberdeen Group",
    },
    questions: [
      {
        id: "c1",
        text: "Do you have a chat feature on your website, and how quickly does it respond?",
        options: [
          { label: "No chat available on website", points: 0 },
          { label: "Yes, but only during business hours with delayed response", points: 15 },
          { label: "Yes, 24/7 with instant response (under 1 minute)", points: 35 },
        ],
      },
      {
        id: "c2",
        text: "How quickly do you respond to social media messages and comments?",
        options: [
          { label: "Days later or not at all", points: 0 },
          { label: "Within 24 hours during business days", points: 15 },
          { label: "Within 1 hour with instant responses 24/7", points: 25 },
        ],
      },
      {
        id: "c3",
        text: "Do you use SMS/text messaging to communicate with customers and prospects?",
        options: [
          { label: "No SMS communication at all", points: 0 },
          { label: "One-way reminders/notifications only", points: 10 },
          { label: "Two-way conversations with instant responses", points: 20 },
        ],
      },
      {
        id: "c4",
        text: "Can customers book appointments through your chat, social, or SMS channels?",
        options: [
          { label: "No - must call or visit website separately", points: 0 },
          { label: "Can request appointment but needs human confirmation", points: 10 },
          { label: "Yes - instant automated booking from any channel", points: 20 },
        ],
      },
    ],
  },
  {
    id: "reputation",
    title: "Reputation Management",
    shortTitle: "Reputation",
    description: "How proactively do you request, manage, and respond to online reviews?",
    icon: "Star",
    maxScore: 100,
    stats: {
      primaryStat: "One negative review = 22% customer loss. One star increase = 5-9% revenue increase. 89% of prospects check reviews.",
      keyStats: [
        "15-25% premium pricing possible with 4.7+ star ratings",
        "20% sales drop when rating falls below 4.0 stars",
        "42% lower purchase intent from single bad review on first page",
        "Double traffic when rating increases from 3.9 to 4.0 stars",
      ],
      annualImpact: "$60K-$108K annual revenue increase from 1-star improvement on $100K monthly revenue",
      realityCheck: [
        "73% of consumers only trust reviews written in last month",
        "33% more likely to visit businesses that respond to reviews",
        "89% of consumers read reviews before making purchase decisions",
        "87% engage with businesses that have 3-4 star ratings on Google",
      ],
      source: "Harvard Business Review, Cornell University, Journal of Marketing Research",
    },
    questions: [
      {
        id: "r1",
        text: "How do you request reviews from satisfied customers?",
        options: [
          { label: "We don't actively request reviews", points: 0 },
          { label: "Manual requests occasionally when we remember", points: 10 },
          { label: "Automated system with optimized timing after positive experiences", points: 30 },
        ],
      },
      {
        id: "r2",
        text: "How many review platforms do you actively monitor and manage?",
        options: [
          { label: "None or only 1 platform", points: 0 },
          { label: "2-3 platforms (e.g., Google, Facebook, Yelp)", points: 15 },
          { label: "4+ platforms including industry-specific review sites", points: 20 },
        ],
      },
      {
        id: "r3",
        text: "How quickly do you respond to reviews (both positive and negative)?",
        options: [
          { label: "We don't respond or take over a week", points: 0 },
          { label: "Within 2-3 days with generic responses", points: 10 },
          { label: "Within 24 hours with personalized, thoughtful responses", points: 30 },
        ],
      },
      {
        id: "r4",
        text: "Do you display customer reviews and ratings prominently on your website?",
        options: [
          { label: "No reviews displayed on website", points: 0 },
          { label: "A few static testimonials manually added", points: 10 },
          { label: "Live feed of latest reviews with automated widget showing star ratings", points: 20 },
        ],
      },
    ],
  },
  {
    id: "database",
    title: "Database Reactivation",
    shortTitle: "DB Reactivation",
    description: "How effectively do you communicate with and nurture past customers?",
    icon: "Database",
    maxScore: 100,
    stats: {
      primaryStat: "67% of past customers would buy again if contacted. 5x cheaper than acquiring new customers.",
      keyStats: [
        "5x less expensive to retain existing customers than acquire new ones",
        "7x ROI for database reactivation vs. new customer acquisition",
        "25% revenue increase possible from reactivating just 20% of dormant customers",
        "$200,000+ potential from systematically reactivating 20% of dormant customers",
      ],
      annualImpact: "$15K–$40K annually from past customers for home services businesses",
      realityCheck: [
        "75% of customers at typical businesses haven't been contacted in 12+ months",
        "67% purchase again when properly reactivated within 90 days",
        "3x lifetime value from reactivated customers vs. new acquisitions",
        "40% referral rate from successfully reactivated customers",
      ],
      source: "Bain & Company Research",
    },
    questions: [
      {
        id: "d1",
        text: "How frequently do you contact your past customers with personalized outreach?",
        options: [
          { label: "Never or rarely (few times per year or not at all)", points: 0 },
          { label: "Occasionally (monthly or quarterly generic campaigns)", points: 10 },
          { label: "Regularly with personalized, behavior-based outreach", points: 25 },
        ],
      },
      {
        id: "d2",
        text: "What level of personalization do you use in your customer communications?",
        options: [
          { label: "No personalization - same message to everyone", points: 0 },
          { label: "Basic personalization (name, past purchase mentioned)", points: 15 },
          { label: "Advanced personalization (preferences, behavior patterns, optimal timing)", points: 25 },
        ],
      },
      {
        id: "d3",
        text: "Do you have a system to identify customers at risk of churning or likely to return?",
        options: [
          { label: "No tracking or identification system", points: 0 },
          { label: "Basic tracking (last purchase date only)", points: 10 },
          { label: "Predictive system with proactive outreach triggers", points: 20 },
        ],
      },
      {
        id: "d4",
        text: "How do you measure the success and ROI of your reactivation efforts?",
        options: [
          { label: "We don't measure reactivation results", points: 0 },
          { label: "Basic metrics (open rates, click rates)", points: 10 },
          { label: "Advanced metrics (reactivation rate, lifetime value impact, ROI)", points: 15 },
        ],
      },
      {
        id: "d5",
        text: "Are your reactivation campaigns automated and integrated with your CRM?",
        options: [
          { label: "No CRM or automation - all manual", points: 0 },
          { label: "CRM exists but limited or no automation", points: 5 },
          { label: "Fully integrated with automated workflows and triggers", points: 15 },
        ],
      },
    ],
  },
];

export function getScoreLabel(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "Excellent";
  if (pct >= 60) return "Good";
  if (pct >= 40) return "Fair";
  return "Poor";
}

export function getScoreColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "text-info";
  if (pct >= 60) return "text-success";
  if (pct >= 40) return "text-warning";
  return "text-destructive";
}

export function getScoreBorderColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "border-info";
  if (pct >= 60) return "border-success";
  if (pct >= 40) return "border-warning";
  return "border-destructive";
}

export function getScoreBgColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return "bg-info";
  if (pct >= 60) return "bg-success";
  if (pct >= 40) return "bg-warning";
  return "bg-destructive";
}
