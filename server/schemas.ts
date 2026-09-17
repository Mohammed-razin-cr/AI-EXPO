import { z } from 'zod';
const text = z.string().min(1).max(10000);
export const promiseResult = z.object({
 overallRiskScore:z.number().min(0).max(100),riskLevel:z.enum(['Low Risk','Moderate Caution','High Financial Risk','Severe Scam Alert']),
 verifiableClaims:z.array(z.object({claim:text,verdict:z.enum(['Verifiable','Exaggerated','Unsubstantiated']),reason:text})).max(30),
 vagueMarketingLanguage:z.array(z.object({phrase:text,whyVague:text,industryReality:text})).max(30),
 missingEvidence:z.array(z.object({missingItem:text,whyCritical:text})).max(30),
 financialRiskIndicators:z.array(z.object({riskFactor:text,redFlagLevel:z.enum(['High','Medium','Critical']),breakdown:text})).max(30),
 questionsToAsk:z.array(z.object({question:text,targetToAsk:text,whatToLookFor:text})).max(30),
 summaryDecisionSupport:text
});
export const triageResult = z.object({urgency:z.enum(['low','medium','high','critical']),department:text,estimatedHours:z.number().min(0).max(720),severityReason:text,suggestedFix:text});
export const reportResult = z.object({report:text,healthScore:z.number().min(0).max(100),actionItems:z.array(text).max(20)});
export const itemSchema = z.object({id:z.string().max(100),type:z.enum(['lost','found']),title:text,description:z.string().max(5000),category:z.string().max(100),location:text,status:z.string().optional()});
