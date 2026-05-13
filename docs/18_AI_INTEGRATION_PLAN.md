# AI Integration Plan

## 1. Purpose

T-060 defines the operating rules for converting the current AX assistant and translation placeholder into real AI-assisted workflows.

This is a planning and governance ticket. It does not enable real AI calls, does not install a model SDK, and does not add production API keys.

## 2. Current Decision

- Current production state: AI features remain disabled.
- Admin UI state: placeholder and prompt preview only.
- Public user state: no AI-generated output is shown as real-time recommendation.
- Database mutation by AI: prohibited until a later implementation ticket.
- Human approval: required for every AI draft before it can be published or saved as operating content.

## 3. Provider Strategy

Use a provider-adapter boundary instead of binding the product directly to one vendor.

Recommended first implementation shape:

- `AI_PROVIDER`: provider id such as `openai`, `gemini`, or `disabled`.
- `AI_API_KEY`: server-only secret for the selected provider.
- `AI_MODEL`: model id selected by operator after cost and quality review.
- `AI_FEATURES_ENABLED`: global kill switch. Default is `false`.

The application must not expose AI API keys to the browser. All AI calls must run through a server-only Route Handler or Server Action protected by `requireAdminSession()`.

## 4. First AI Use Cases

### 4.1 Translation Draft

Target:

- Accommodation
- Experience
- LocalIncomeProgram
- Course
- TrainingCourse
- Certification

Behavior:

- Generate an English, Simplified Chinese, or Japanese draft from Korean source text.
- Use existing `ContentTranslation` as the storage target only after operator review.
- Preserve LocalIncomeProgram-specific fields:
  - `linkedLifeService`
  - `residentRole`
  - `revenueUse`

Not allowed:

- Auto-save generated translations.
- Auto-publish translations.
- Replace Korean source content.

### 4.2 Product Copy Draft

Target:

- Public detail title suggestions
- Summary refinement
- CTA-supporting but non-booking copy

Rules:

- Do not imply payment, instant booking, guaranteed reservation, vehicle transport, reviews, coupons, or points.
- Keep the platform as inquiry and connection oriented.
- Do not exaggerate facilities, capacity, or experience outcomes beyond stored data.

### 4.3 Promotion Copy Draft

Target channels:

- Kakao channel post
- Blog intro
- Instagram caption
- Short local event notice

Rules:

- Output must remain draft-only.
- Operator must copy or approve final text manually.
- Channel-specific copy must not include personal contact information unless the operator explicitly adds approved public business contact data.

### 4.4 Operations Insight Draft

Input:

- Aggregated `LeadEvent` counts
- Published content counts
- Inquiry and partner application counts

Rules:

- Use only aggregate metrics.
- Do not send raw inquiry messages, applicant names, phone numbers, or email addresses to an AI provider.
- Output must be treated as an advisory note, not an automated operating decision.

## 5. Approval Workflow

Every AI-assisted workflow must follow this sequence:

1. Admin opens an AI-enabled form.
2. Server verifies `requireAdminSession()`.
3. Server validates `AI_FEATURES_ENABLED=true`.
4. Server checks budget and rate limits.
5. Server redacts or excludes personal data.
6. AI returns a draft.
7. UI displays draft in a review state.
8. Operator edits the result.
9. Operator explicitly clicks save or apply.
10. Saved content records review metadata.

Recommended review metadata:

```json
{
  "aiGenerated": true,
  "provider": "openai",
  "model": "example-model-id",
  "promptVersion": "content-translation-v1",
  "reviewStatus": "approved",
  "approvedBy": "admin",
  "approvedAt": "2026-05-13T00:00:00.000Z"
}
```

For MVP-derived tables, keep this metadata in existing JSON fields where available. Do not add a new AI result table until the implementation ticket requires historical draft storage.

## 6. Cost and Rate Limits

Default policy:

- `AI_FEATURES_ENABLED=false`
- No AI call is allowed without explicit production approval.
- No public user-triggered AI call in the first implementation.

Recommended environment controls:

```env
AI_FEATURES_ENABLED="false"
AI_PROVIDER="disabled"
AI_MODEL=""
AI_DAILY_BUDGET_KRW="10000"
AI_MAX_REQUESTS_PER_HOUR="30"
AI_MAX_INPUT_CHARS="6000"
AI_MAX_OUTPUT_CHARS="3000"
AI_REQUIRE_ADMIN_APPROVAL="true"
```

Runtime guardrails:

- Reject calls when daily budget is exhausted.
- Reject calls when per-hour request limit is exceeded.
- Reject calls when input exceeds the configured character cap.
- Log rejected calls without storing raw personal data.
- Keep a manual kill switch by setting `AI_FEATURES_ENABLED=false`.

## 7. Privacy Rules

Never send the following raw values to an AI provider:

- Inquiry name
- Inquiry phone
- Inquiry email
- Partner applicant name
- Partner applicant phone
- Partner applicant email
- Free-form inquiry or application message containing personal data
- Admin credentials, cookies, session values, database URLs, or API keys

Allowed AI inputs:

- Publicly published content title, summary, description
- LocalIncomeProgram public structure fields
- Aggregated LeadEvent metrics
- Public business display name when already shown on public pages

Before sending any free text to AI, apply a redaction pass for:

- Phone numbers
- Email addresses
- Long numeric identifiers
- URLs that may contain private tokens

## 8. Logging and Monitoring

AI calls must use the existing operation logging pattern and avoid raw prompt leakage.

Log allowed fields:

- `event`: `ai_request_started`, `ai_request_succeeded`, `ai_request_failed`, `ai_request_rejected`
- `provider`
- `model`
- `feature`
- `targetType`
- `targetId`
- `inputChars`
- `outputChars`
- `estimatedCostKrw` when available
- `durationMs`
- `adminUserHash` or non-PII admin identifier
- `errorCode`

Do not log:

- Full prompt
- Full completion
- API key
- Personal data
- Admin password or session token

Failure behavior:

- AI failure must not block the original admin CRUD workflow.
- UI should show a clear retry message.
- Existing manually entered text must remain intact.

## 9. Implementation Ticket Split

T-060 only defines the plan. Actual implementation should be split into separate tickets:

- T-072 AI provider adapter and environment guardrails
- T-073 Admin translation draft generation API
- T-074 AI request logging and budget guard
- T-075 AI privacy redaction utility
- T-076 AX assistant copy and operations insight draft UI
- T-077 AI integration QA and rollback checklist

## 10. Acceptance Criteria

- AI provider strategy is documented.
- Cost and rate limit defaults are documented.
- Human approval workflow is documented.
- Privacy exclusion rules are documented.
- Logging rules are documented.
- `.env.example` contains disabled-by-default AI variables.
- No production AI call is enabled by this ticket.
