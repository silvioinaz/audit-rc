import { ProspectInfo, industries } from "@/lib/auditData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  info: ProspectInfo;
  onChange: (info: Partial<ProspectInfo>) => void;
};

export default function ProspectInfoTab({ info, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-1">Prospect Information</h2>
        <p className="text-sm text-muted-foreground">
          Fill in the basics before the call. Discovery data gets filled as you go through the pillars.
        </p>
      </div>

      {/* Pre-call section */}
      <div>
        <div className="section-highlight mb-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">
            Pre-Call — fill before you dial
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Business Name">
            <Input
              placeholder="e.g. ABC Plumbing"
              value={info.businessName}
              onChange={(e) => onChange({ businessName: e.target.value })}
            />
          </Field>
          <Field label="Contact Name">
            <Input
              placeholder="e.g. John Smith"
              value={info.contactName}
              onChange={(e) => onChange({ contactName: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <Input
              placeholder="(705) 555-1234"
              value={info.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <Input
              placeholder="john@abcplumbing.ca"
              value={info.email}
              onChange={(e) => onChange({ email: e.target.value })}
            />
          </Field>
          <Field label="Website">
            <Input
              placeholder="https://abcplumbing.ca"
              value={info.website}
              onChange={(e) => onChange({ website: e.target.value })}
            />
          </Field>
          <Field label="Industry">
            <Select value={info.industry} onValueChange={(v) => onChange({ industry: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select industry..." />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Audit Date">
            <Input
              type="date"
              value={info.auditDate}
              onChange={(e) => onChange({ auditDate: e.target.value })}
            />
          </Field>
          <Field label="Current Google Star Rating">
            <Input
              placeholder="3.8 — check Google before the call"
              value={info.googleRating}
              onChange={(e) => onChange({ googleRating: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Pre-Call Notes">
            <Textarea
              placeholder="Assessment results, referral source, how they found you, anything you know going in..."
              value={info.preCallNotes}
              onChange={(e) => onChange({ preCallNotes: e.target.value })}
              className="min-h-[100px]"
            />
          </Field>
        </div>
      </div>

      {/* Discovery Data */}
      <div>
        <div className="section-highlight mb-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">
            Discovery Data — fill during the call as they tell you
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-4 ml-1">
          These feed the ROI calculations on the Results tab. Ask naturally during the pillar questions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Estimated Monthly Revenue ($)">
            <Input
              placeholder="Ask: rough monthly revenue?"
              value={info.monthlyRevenue}
              onChange={(e) => onChange({ monthlyRevenue: e.target.value })}
            />
          </Field>
          <Field label="Average Job / Transaction Value ($)">
            <Input
              placeholder="Ask: what's an average job worth?"
              value={info.avgJobValue}
              onChange={(e) => onChange({ avgJobValue: e.target.value })}
            />
          </Field>
          <Field label="Customer Database Size">
            <Input
              placeholder="Pillar 4: how many past customers?"
              value={info.customerDbSize}
              onChange={(e) => onChange({ customerDbSize: e.target.value })}
            />
          </Field>
          <Field label="Estimated Missed Calls / Month">
            <Input
              placeholder="Pillar 1: how many calls do you miss?"
              value={info.missedCallsMonth}
              onChange={(e) => onChange({ missedCallsMonth: e.target.value })}
            />
          </Field>
          <Field label="Monthly Leads (all sources)">
            <Input
              placeholder="Pillar 2: how many leads/mo?"
              value={info.monthlyLeads}
              onChange={(e) => onChange({ monthlyLeads: e.target.value })}
            />
          </Field>
          <Field label="Monthly Website Visitors">
            <Input
              placeholder="Know your traffic?"
              value={info.monthlyVisitors}
              onChange={(e) => onChange({ monthlyVisitors: e.target.value })}
            />
          </Field>
          <Field label="Current Website Conversion Rate (%)">
            <Input
              placeholder="2.8 is typical — use if they don't know"
              value={info.conversionRate}
              onChange={(e) => onChange({ conversionRate: e.target.value })}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
