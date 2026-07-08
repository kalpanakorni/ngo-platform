/**
 * Lightweight FAQ-matching engine. Tries to answer from a curated knowledge
 * base first (fast, free, deterministic); only falls back to an LLM call
 * when nothing matches closely enough and OPENAI_API_KEY is configured.
 */

const FAQ = [
  {
    keywords: ['donate', 'donation', 'give money', 'contribute'],
    answer:
      'You can donate on the Donate page — choose a one-time or monthly gift, pick a cause, and check out securely by card. Want me to take you there?',
  },
  {
    keywords: ['volunteer', 'volunteering', 'help out', 'join'],
    answer:
      'We would love your help. Visit the Volunteer page to see open opportunities filtered by location and skill, and submit a quick application.',
  },
  {
    keywords: ['request help', 'need help', 'assistance', 'support request'],
    answer:
      'If you or someone you know needs assistance, use the Request Help page. Choose a category (medical, education, disaster relief, etc.) and our team will follow up.',
  },
  {
    keywords: ['campaign', 'fundraiser', 'project'],
    answer:
      'Check the Campaigns page for active fundraisers with live progress bars. You can filter by cause and share any campaign with your network.',
  },
  {
    keywords: ['contact', 'phone', 'email', 'reach', 'address'],
    answer: 'You can reach our team through the Contact page — it has a form, our office location on a map, and social links.',
  },
  {
    keywords: ['about', 'mission', 'vision', 'who are you', 'history'],
    answer: 'We are a nonprofit focused on emergency relief, education, and community health. See the About page for our full story and team.',
  },
  {
    keywords: ['tax', 'receipt', 'deductible'],
    answer: 'Yes — every donation over $10 automatically generates a tax-deductible receipt sent to your email.',
  },
  {
    keywords: ['recurring', 'monthly', 'cancel subscription'],
    answer: 'Monthly donations can be paused or cancelled anytime from your account dashboard under "My Donations".',
  },
];

function matchFaq(message) {
  const text = message.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const entry of FAQ) {
    const score = entry.keywords.reduce((acc, kw) => (text.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return bestScore > 0 ? best.answer : null;
}

async function getAiFallback(message) {
  if (!process.env.OPENAI_API_KEY) {
    return "I don't have an exact answer for that yet, but I can connect you with our team via the Contact page, or you can rephrase your question.";
  }
  // Example shape only — wire up your preferred LLM provider here.
  // const completion = await openaiClient.chat.completions.create({ ... });
  // return completion.choices[0].message.content;
  return "I don't have an exact answer for that yet, but I can connect you with our team via the Contact page.";
}

exports.getChatbotReply = async (message) => {
  const faqAnswer = matchFaq(message);
  if (faqAnswer) return { source: 'faq', reply: faqAnswer };
  const aiAnswer = await getAiFallback(message);
  return { source: 'ai-fallback', reply: aiAnswer };
};
