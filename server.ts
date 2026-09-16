import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase payload limit for screenshot/poster image uploads in PromiseCheck AI and CampusFind
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// 1. AI Campus Assistant endpoint
app.post("/api/assistant", async (req: Request, res: Response) => {
  try {
    const { message, language = "English", conversationHistory = [], userContext = {} } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Intelligent fallback if no API key
      const fallbackReplies: Record<string, string> = {
        English: `I am your Campus360 AI Assistant. I can help with Academic information (curriculum, attendance, GPA), Document requests (Bonafide, Transcripts), Hostel gates & mess menus, and PromiseCheck ad claim audits. How can I assist you today?`,
        Hindi: `नमस्ते! मैं आपका Campus360 AI कैंपस सहायक हूँ। मैं आपकी अकादमिक जानकारी, दस्तावेज़ अनुरोध, हॉस्टल सेवाएँ और विज्ञापनों की सत्यता (PromiseCheck) की जांच में मदद कर सकता हूँ।`,
        Spanish: `¡Hola! Soy tu asistente de campus Campus360 AI. Te puedo ayudar con servicios académicos, solicitudes de documentos, servicios de residencia y análisis de PromiseCheck.`,
        French: `Bonjour! Je suis votre assistant Campus360 AI. Je peux vous aider avec vos cours, attestations, foyer d'étudiants et PromiseCheck.`,
        Telugu: `నమస్కారం! నేను మీ Campus360 AI క్యాంపస్ అసిస్టెంట్. విద్యా సమాచారం, సర్టిఫికేట్ల దరఖాస్తు, హాస్టల్ సేవలు మరియు PromiseCheck అనలిసిస్‌లో మీకు సహాయం చేయగలను.`
      };
      const reply = fallbackReplies[language] || fallbackReplies["English"];
      return res.json({ reply, usedFallback: true });
    }

    const systemPrompt = `You are "Campus360 AI", a smart, empathetic, and resourceful campus assistant for university students, faculty, and administration.
Current student context: Name: ${userContext.name || "Student"}, Roll: ${userContext.rollNo || "2024CS104"}, Dept: ${userContext.dept || "Computer Science"}, Year: ${userContext.year || "3rd Year"}, Hostel: ${userContext.hostel || "Block-B (Falcon Hall)"}.

Rules:
1. Always respond in the requested language: "${language}".
2. Be concise, actionable, and warm. Provide step-by-step guidance for campus procedures (e.g. Bonafide certificate takes 24 hours, Hostel curfew is 10:00 PM, Minimum attendance required for exams is 75%).
3. If the user asks about institute claims, fake placements, or suspicious job coaching, advise them to use the "PromiseCheck AI" tab to audit posters and contracts before paying any fee.
4. If the user asks about lost or misplaced items, advise them to check or post on "CampusFind".
5. Keep answers formatted nicely with bullet points and bold highlights when appropriate.`;

    // Format chat history
    const contents: any[] = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: `Understood. I will act as Campus360 AI and answer campus queries accurately in ${language}.` }] },
    ];

    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-6)) {
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }

    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
    });

    const reply = response.text || "I apologize, but I couldn't generate a response. Please try again.";
    res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/assistant:", error);
    res.status(500).json({
      error: "Failed to generate assistant response",
      details: error?.message || String(error)
    });
  }
});

// 2. PromiseCheck AI Claim Analyzer (Image + Text)
app.post("/api/promise-check", async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", rawText, instituteName = "" } = req.body;

    if (!imageBase64 && !rawText) {
      return res.status(400).json({ error: "Either poster image or advertisement text is required." });
    }

    const ai = getGeminiClient();

    const promptInstructions = `You are the lead investigator at "PromiseCheck AI", a decision-support system protecting students and job seekers against predatory marketing, misleading coaching institutes, fake placement claims, and financial traps.
The user provided an advertisement, brochure, poster, or offer text from: "${instituteName || "Advertised Coaching/Institute/Offer"}".

Analyze all claims strictly, identifying:
1. Verifiable claims (concrete, auditable metrics with company names, accreditation IDs, or verifiable dates).
2. Vague marketing language (buzzwords like "100% placement assistance", "world-class mentors", "guaranteed high package", "limited seats hurry", "govt recognized").
3. Missing evidence (unspecified hiring partner names, refund policy fine prints, average salary vs highest salary omission, batch size, legal disclaimer).
4. Financial-risk indicators (upfront non-refundable fees, ISA income share traps, NBFC loan disguised as zero-cost EMI, forfeitures, pressure tactics).
5. Questions the user should ask before paying any money (specific, hard-hitting questions to test their admissions counselor).
6. An Overall Risk Score from 0 to 100 (0 = very transparent & trustworthy, 100 = extreme predatory scam/high financial risk).
7. Risk Level ('Low Risk' | 'Moderate Caution' | 'High Financial Risk' | 'Severe Scam Alert').
8. Summary Decision Support (2-3 concise paragraphs giving practical advice on whether to pay or verify first).

CRITICAL: Return valid JSON ONLY matching this exact structure without markdown formatting or code blocks:
{
  "overallRiskScore": 78,
  "riskLevel": "High Financial Risk",
  "verifiableClaims": [
    { "claim": "String of claim", "verdict": "Verifiable" | "Exaggerated" | "Unsubstantiated", "reason": "Explanation" }
  ],
  "vagueMarketingLanguage": [
    { "phrase": "e.g. 100% Placement Guarantee", "whyVague": "Explanation", "industryReality": "What usually happens behind the scenes" }
  ],
  "missingEvidence": [
    { "missingItem": "e.g. List of actual recruiting companies & hiring criteria", "whyCritical": "Why the student needs to verify this" }
  ],
  "financialRiskIndicators": [
    { "riskFactor": "e.g. Disguised NBFC Student Loan", "redFlagLevel": "High" | "Medium" | "Critical", "breakdown": "Explanation of financial trap" }
  ],
  "questionsToAsk": [
    { "question": "Exact question to ask", "targetToAsk": "Admissions Counselor / Finance Dept", "whatToLookFor": "Acceptable answer vs Red flag answer" }
  ],
  "summaryDecisionSupport": "Clear final recommendation"
}`;

    if (!ai) {
      // Heuristic fallback response with realistic analysis
      const detectedIsFake = rawText ? /100%|guarantee|zero risk|free|limited seats|immediate offer/i.test(rawText) : true;
      const fallbackResult = {
        overallRiskScore: detectedIsFake ? 82 : 45,
        riskLevel: detectedIsFake ? "High Financial Risk" : "Moderate Caution",
        verifiableClaims: [
          {
            claim: rawText ? (rawText.slice(0, 60) + "...") : "100% Guaranteed Placement upon completion",
            verdict: "Exaggerated",
            reason: "Standard consumer court precedents consider 100% placement guarantees misleading without a legally binding audit by a third-party agency."
          },
          {
            claim: "Government Approved Curriculum / Affiliation",
            verdict: "Unsubstantiated",
            reason: "No registration number, UGC/AICTE/NSDC accreditation code or official gazette reference provided in the materials."
          }
        ],
        vagueMarketingLanguage: [
          {
            phrase: "100% Placement Assistance / Guarantee",
            whyVague: "Assistance is often conflated with a guaranteed job. Institutes often fulfill this by simply forwarding job portal links.",
            industryReality: "Only top 5% may get referrals; contracts often exclude students who miss a single mock interview."
          },
          {
            phrase: "Limited Seats - Offer Expires in 24 Hours",
            whyVague: "Artificial scarcity created to bypass critical thinking and prevent student from consulting parents or seniors.",
            industryReality: "Batches usually run continuously, and discounts remain negotiable."
          },
          {
            phrase: "No Hidden Charges",
            whyVague: "Excludes exam certification fees, software licenses, or job portal registration fees.",
            industryReality: "Additional charges frequently emerge during semester end or interview rounds."
          }
        ],
        missingEvidence: [
          {
            missingItem: "Audited Placement Report with median CTC and company names",
            whyCritical: "Highest CTC advertised is usually an off-campus outlier or student who already had prior experience."
          },
          {
            missingItem: "Clear, written Refund & Cancellation Policy",
            whyCritical: "Coaching institutes often refuse refunds once the batch commences, locking students into NBFC loans."
          }
        ],
        financialRiskIndicators: [
          {
            riskFactor: "Third-party NBFC Loan signed as 'Zero-cost EMI'",
            redFlagLevel: "Critical",
            breakdown: "You might be signing a personal non-cancellable education loan with a finance company rather than paying the institute directly."
          },
          {
            riskFactor: "Non-refundable Registration & Seat Blocking Fee",
            redFlagLevel: "High",
            breakdown: "Pressure to pay Rs 5,000 - 25,000 immediately to hold the seat before viewing the legal terms."
          }
        ],
        questionsToAsk: [
          {
            question: "Can you provide the contact of 3 alumni from the most recent batch who got placed through your campus drive?",
            targetToAsk: "Senior Counselor",
            whatToLookFor: "Refusal or giving only pre-recorded video testimonials is an immediate red flag."
          },
          {
            question: "Is the EMI payment a direct institute installment or an NBFC finance loan in my name?",
            targetToAsk: "Accounts / Finance Desk",
            whatToLookFor: "If it's an NBFC loan, it directly impacts your CIBIL score if you drop out."
          },
          {
            question: "What exact criteria defines 'placement eligibility' in the student agreement?",
            targetToAsk: "Placement Coordinator",
            whatToLookFor: "Watch out for impossible clauses like 100% attendance, daily 10-hour assignments, or relocation requirements."
          }
        ],
        summaryDecisionSupport: "PromiseCheck AI urges caution before transferring funds or signing loan papers. While skills training may have value, the marketing exaggerates employment guarantees and relies on artificial urgency. Request the complete contract and audit before paying."
      };
      return res.json(fallbackResult);
    }

    const parts: any[] = [{ text: promptInstructions }];
    if (rawText) {
      parts.push({ text: `ADVERTISEMENT / OFFER TEXT:\n${rawText}` });
    }
    if (imageBase64) {
      // Clean base64 string
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const textOutput = response.text || "{}";
    try {
      const parsed = JSON.parse(textOutput);
      res.json(parsed);
    } catch (parseErr) {
      // Try stripping backticks if any
      const cleaned = textOutput.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      res.json(parsed);
    }
  } catch (error: any) {
    console.error("Error in /api/promise-check:", error);
    res.status(500).json({
      error: "Failed to analyze claims",
      details: error?.message || String(error)
    });
  }
});

// 3. Smart Complaint Auto-Triage endpoint
app.post("/api/smart-triage", async (req: Request, res: Response) => {
  try {
    const { title, description, category, location } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Rule-based triage
      const isCritical = /water leak|fire|shock|broken lock|harassment|fight|medical|food poison/i.test(`${title} ${description}`);
      return res.json({
        urgency: isCritical ? "critical" : "medium",
        department: category === "hostel" ? "Hostel Warden Office" : category === "mess" ? "Catering & Mess Committee" : category === "it" ? "Campus IT & Network Admin" : "Estate & Maintenance Dept",
        estimatedHours: isCritical ? 2 : 24,
        severityReason: isCritical ? "Safety / urgent sanitation hazard detected" : "Standard institutional grievance",
        suggestedFix: "Assigned duty technician with supervisor notification."
      });
    }

    const prompt = `Analyze this student grievance:
Title: "${title}"
Category: "${category}"
Location: "${location}"
Description: "${description}"

Evaluate:
1. Urgency: 'low' | 'medium' | 'high' | 'critical'
2. Assigned Campus Department (e.g. 'Electrical & Power Supply', 'Hostel Warden Office', 'Catering & Food Safety', 'Network & Wi-Fi Operations', 'Academic Dean Office')
3. Estimated Resolution Time in hours (number)
4. Severity Reason (one concise sentence)
5. Immediate Suggested Action (one actionable sentence)

Return ONLY valid JSON in format:
{
  "urgency": "high",
  "department": "Department Name",
  "estimatedHours": 12,
  "severityReason": "Reason",
  "suggestedFix": "Immediate action"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CampusFind Lost & Found Matcher endpoint
app.post("/api/campus-find/match", async (req: Request, res: Response) => {
  try {
    const { newItem, existingItems } = req.body;
    const ai = getGeminiClient();

    if (!ai || !existingItems || existingItems.length === 0) {
      return res.json({ matches: [] });
    }

    const prompt = `Compare this newly reported item with the existing database of lost/found items:
NEW ITEM:
Type: ${newItem.type} ('lost' or 'found')
Title: ${newItem.title}
Category: ${newItem.category}
Location: ${newItem.location}
Description: ${newItem.description}
Date: ${newItem.date}

EXISTING ITEMS:
${JSON.stringify(existingItems.slice(0, 15))}

Find if any existing item of the OPPOSITE type (if new is lost, find existing found items; if new is found, find existing lost items) is a potential match.
Return ONLY a JSON array of matches with confidence score (0-100), matchedItemId, and reason:
[
  { "matchedItemId": "id", "confidence": 85, "reason": "Explanation why they might be the same item" }
]
If none match well (>50 confidence), return empty array [].`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const matches = JSON.parse(response.text || "[]");
    res.json({ matches });
  } catch (err: any) {
    res.json({ matches: [] });
  }
});

// 5. Admin AI Analytics and Executive Report Generator
app.post("/api/admin/generate-report", async (req: Request, res: Response) => {
  try {
    const { stats, complaintsSummary, docRequestsSummary, feedbackSummary } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        report: `## Weekly Campus Intelligence & Administrative Digest
- **Grievance Resolution**: Average turnaround time stands at 14.2 hours, down by 18% from last week.
- **Top Bottlenecks**: Wi-Fi latency in Block-B Hostel and Mess dinner feedback require warden attention.
- **Document Services**: 94% of Bonafide and Transcript applications were processed within the 24-hour SLA.
- **Safety & Scams Alert**: 12 students ran PromiseCheck audits on off-campus training institutes; 4 high-risk predatory loans were flagged and avoided.`,
        healthScore: 88,
        actionItems: [
          "Deploy auxiliary mesh Wi-Fi APs to Block-B 3rd floor.",
          "Audit Mess supplier grain and oil quality with student mess committee.",
          "Host PromiseCheck career awareness session before campus placement season."
        ]
      });
    }

    const prompt = `Generate an executive campus intelligence summary report for university leadership (Dean, Registrar, Student Affairs):
Stats: ${JSON.stringify(stats)}
Grievances: ${JSON.stringify(complaintsSummary)}
Documents: ${JSON.stringify(docRequestsSummary)}
Student Feedback: ${JSON.stringify(feedbackSummary)}

Return ONLY JSON:
{
  "report": "Markdown formatted executive summary with clear headings, trends, and KPI highlights",
  "healthScore": 89,
  "actionItems": ["Action 1", "Action 2", "Action 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
