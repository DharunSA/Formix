"use client";

const row1 = [
  { name: "Slack", icon: "chat", color: "#4A154B" },
  { name: "Stripe", icon: "payments", color: "#635BFF" },
  { name: "Zapier", icon: "bolt", color: "#FF4F00" },
  { name: "Klaviyo", icon: "mail", color: "#000000" },
  { name: "Calendly", icon: "calendar_today", color: "#0057FF" },
  { name: "ActiveCampaign", icon: "campaign", color: "#356AE6" },
];

const row2 = [
  { name: "Webflow", icon: "language", color: "#146EF5" },
  { name: "Notion", icon: "description", color: "#000000" },
  { name: "HubSpot", icon: "hub", color: "#FF4F00" },
  { name: "Intercom", icon: "forum", color: "#0057FF" },
  { name: "Mailchimp", icon: "alternate_email", color: "#FFE01B", textDark: true },
  { name: "Google Sheets", icon: "table_chart", color: "#0F9D58" },
];

type IntegrationBadge = {
  name: string;
  icon: string;
  color: string;
  textDark?: boolean;
};

function Badge({ name, icon, color, textDark }: IntegrationBadge) {
  return (
    <div
      className="group flex items-center gap-2.5 px-8 py-4 bg-white rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer select-none shrink-0"
      style={
        {
          "--hover-bg": color,
          "--hover-text": textDark ? "#000" : "#fff",
        } as React.CSSProperties
      }
    >
      <span
        className="material-symbols-outlined text-xl transition-colors duration-300"
        style={{ fontSize: "22px" }}
      >
        {icon}
      </span>
      <span className="font-bold text-xl text-[#1a1c1b] transition-colors duration-300 whitespace-nowrap">
        {name}
      </span>

      <style>{`
        .group:hover span {
          color: var(--hover-text) !important;
        }
        .group:hover {
          background-color: var(--hover-bg) !important;
          color: var(--hover-text) !important;
        }
      `}</style>
    </div>
  );
}

export function IntegrationsSection() {
  // Duplicate items for seamless infinite scroll
  const r1 = [...row1, ...row1];
  const r2 = [...row2, ...row2];

  return (
    <section id="integrations" className="lp-section">
      <div className="lp-container">
        {/* Card wrapper */}
        <div className="lp-integrations-card">
          {/* Header */}
          <div className="text-center mb-12 z-10 relative">
            <span className="lp-font-label uppercase tracking-widest text-lp-accent-purple mb-3 block">
              Integrations
            </span>
            <h2 className="lp-font-headline text-lp-primary max-w-2xl mx-auto">
              Connect with hundreds of your mission-critical tools
            </h2>
          </div>

          {/* Tickers */}
          <div className="w-full overflow-hidden lp-ticker-wrapper relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, #efeeec, transparent)" }} />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, #efeeec, transparent)" }} />

            {/* Row 1 — scrolls left */}
            <div className="flex w-max lp-ticker-left gap-5 mb-5">
              {r1.map((item, i) => (
                <Badge key={i} {...item} />
              ))}
            </div>

            {/* Row 2 — scrolls right */}
            <div className="flex w-max lp-ticker-right gap-5">
              {r2.map((item, i) => (
                <Badge key={i} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
