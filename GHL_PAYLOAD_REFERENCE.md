# GHL Webhook Payload Reference

**Webhook URL:** `https://services.leadconnectorhq.com/hooks/ERB3QwqNBa5JjalEmjoc/webhook-trigger/f57ebc0e-4edb-423d-83ff-1c89533e56cf`  
**Method:** `POST`  
**Content-Type:** `application/json`

---

## Prospect Info (Contact Fields)

| Field              | Key                  | Type   | Example                                              |
| ------------------ | -------------------- | ------ | ---------------------------------------------------- |
| First Name         | `first_name`         | string | `"Jane"`                                             |
| Last Name          | `last_name`          | string | `"Doe"`                                              |
| Company Name       | `company_name`       | string | `"ABC Plumbing"`                                     |
| Phone              | `phone`              | string | `"555-123-4567"`                                     |
| Email              | `email`              | string | `"jane@abcplumbing.ca"`                              |
| Website            | `website`            | string | `"https://abcplumbing.ca"`                           |
| Industry           | `industry`           | string | `"Home Services (HVAC, Plumbing, Roofing, ...)"`     |
| Audit Date         | `audit_date`         | string | `"2026-03-10"`                                       |
| Google Star Rating | `google_rating`      | string | `"3.8"`                                              |
| Pre-Call Notes     | `pre_call_notes`     | string | Free text                                            |

## Discovery Data

| Field                   | Key                  | Type   | Example  |
| ----------------------- | -------------------- | ------ | -------- |
| Monthly Revenue ($)     | `monthly_revenue`    | string | `"50000"`|
| Avg Job Value ($)       | `avg_job_value`      | string | `"1200"` |
| Customer DB Size        | `customer_db_size`   | string | `"500"`  |
| Missed Calls / Month    | `missed_calls_month` | string | `"30"`   |
| Monthly Leads           | `monthly_leads`      | string | `"80"`   |
| Monthly Website Visitors| `monthly_visitors`   | string | `"2000"` |
| Conversion Rate (%)     | `conversion_rate`    | string | `"2.8"`  |

## Scores & Tiers

| Field              | Key              | Type   | Example                |
| ------------------ | ---------------- | ------ | ---------------------- |
| Total Score        | `total_score`    | number | `85`                   |
| Max Possible Score | `max_total`      | number | `400`                  |
| Average Per Pillar | `avg_score`      | number | `21`                   |
| Overall Tier Tag   | `overall_tier`   | string | `"audit-poor"`         |

### Tier Logic

| Tier       | Percentage Range | Tag Example      |
| ---------- | ---------------- | ---------------- |
| Critical   | 0–25%            | `audit-critical` |
| Poor       | 26–50%           | `audit-poor`     |
| Fair       | 51–75%           | `audit-fair`     |
| Good       | 76–100%          | `audit-good`     |

## Pillar Breakdown

### `pillar_scores` (object)

```json
{
  "voice-ai": 0,
  "conversational-ai": 35,
  "reputation": 60,
  "database": 25
}
```

### `pillar_tags` (string array)

Per-pillar tier tags using the same tier logic above:

```json
[
  "voice-ai-critical",
  "conversational-ai-poor",
  "reputation-fair",
  "database-poor"
]
```

**Pillar IDs:** `voice-ai`, `conversational-ai`, `reputation`, `database`

## Revenue Gaps

| Field              | Key                  | Type   | Example |
| ------------------ | -------------------- | ------ | ------- |
| Total Revenue Gap  | `total_revenue_gap`  | number | `45000` |

### `gaps` (object — per-pillar rounded values)

```json
{
  "voice-ai": 18000,
  "conversational-ai": 12000,
  "reputation": 9000,
  "database": 6000
}
```

## Raw Answers & Notes

### `answers` (object — question ID → selected option index)

```json
{
  "v1": 0,
  "v2": 1,
  "v3": 2,
  "v4": 0,
  "c1": 1,
  "c2": 0,
  "...": "..."
}
```

**Question ID prefixes:** `v` = Voice AI, `c` = Conversational AI, `r` = Reputation, `d` = Database

### `notes` (object — pillar ID → free text)

```json
{
  "voice-ai": "They miss 40% of calls on weekends",
  "conversational-ai": "",
  "reputation": "Only 3.2 stars, no review system",
  "database": "Haven't contacted past customers in 2 years"
}
```

---

## Full Example Payload

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "company_name": "ABC Plumbing",
  "phone": "555-123-4567",
  "email": "jane@abcplumbing.ca",
  "website": "https://abcplumbing.ca",
  "industry": "Home Services (HVAC, Plumbing, Roofing, Garage Door, Home Maintenance, Home Inspection)",
  "audit_date": "2026-03-10",
  "google_rating": "3.8",
  "pre_call_notes": "Referred by partner agency",
  "monthly_revenue": "50000",
  "avg_job_value": "1200",
  "customer_db_size": "500",
  "missed_calls_month": "30",
  "monthly_leads": "80",
  "monthly_visitors": "2000",
  "conversion_rate": "2.8",
  "total_score": 85,
  "max_total": 400,
  "avg_score": 21,
  "overall_tier": "audit-poor",
  "pillar_tags": [
    "voice-ai-critical",
    "conversational-ai-poor",
    "reputation-fair",
    "database-poor"
  ],
  "total_revenue_gap": 45000,
  "pillar_scores": {
    "voice-ai": 0,
    "conversational-ai": 35,
    "reputation": 60,
    "database": 25
  },
  "gaps": {
    "voice-ai": 18000,
    "conversational-ai": 12000,
    "reputation": 9000,
    "database": 6000
  },
  "answers": {
    "v1": 0, "v2": 1, "v3": 2, "v4": 0,
    "c1": 1, "c2": 0, "c3": 1, "c4": 0,
    "r1": 2, "r2": 1, "r3": 1, "r4": 0,
    "d1": 0, "d2": 1, "d3": 0, "d4": 0, "d5": 0
  },
  "notes": {
    "voice-ai": "They miss 40% of calls on weekends",
    "conversational-ai": "",
    "reputation": "Only 3.2 stars, no review system",
    "database": "Haven't contacted past customers in 2 years"
  }
}
```

---

## GHL Workflow Tips

- **Branch by `overall_tier`** → route `audit-critical` leads to urgent follow-up
- **Filter by `pillar_tags`** → trigger pillar-specific nurture sequences
- **Use `total_revenue_gap`** → personalize emails with dollar amounts
- **Map `first_name`, `last_name`, `email`, `phone`** → standard GHL contact fields
- **Store `company_name`, `industry`** → GHL custom fields
