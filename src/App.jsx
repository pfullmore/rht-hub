import { useState, useEffect, useMemo } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CMS_NOFO_URL = "https://apply07.grants.gov/apply/opportunities/instructions/PKG00291485-instructions.pdf";
const GRANTS_GOV   = "https://grants.gov/search-results-detail/360442";
const NRHA_TRACKER = "https://www.ruralhealth.us/programs/center-for-rural-health-innovation-and-system-redesign/rural-health-transformation-program";
const RHIHUB_URL   = "https://www.ruralhealthinfo.org/resources/lists/rhtp";
const SHVS_URL     = "https://shvs.org/tracking-state-releases-of-rural-health-transformation-program-applications/";

const ALL_INITIATIVES = [
  "Technology Innovation","Workforce Development","Chronic Disease","Telehealth",
  "Behavioral Health","Rural Hospital Support","Tribal Health","Value-Based Care",
  "Prevention","FQHC / Community Health","Maternal & Doula","Facility Modernization",
];

// States with RFPs released very recently (within ~30 days of data date)
const RECENTLY_RELEASED = new Set(["FL","AR"]);

const fitColor = { Strong:"#16a34a", Moderate:"#d97706", Limited:"#9ca3af" };
const fitBg    = { Strong:"#dcfce7", Moderate:"#fef3c7", Limited:"#f3f4f6" };

// ─── DATA HOOK ────────────────────────────────────────────────────────────────
function useData() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch("/data.json")
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  return { data, loading, error };
}

// ─── SMALL UI HELPERS ─────────────────────────────────────────────────────────
function Pill({ color, bg, icon, children, style: extra }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700,
      padding:"3px 9px", borderRadius:20, background:bg, color, whiteSpace:"nowrap", ...extra }}>
      {icon && <i className={`ti ${icon}`} style={{ fontSize:11 }} aria-hidden="true" />}
      {children}
    </span>
  );
}

function PortalLink({ url, label, stopProp }) {
  if (!url) return <span style={{ fontSize:11, color:"#9ca3af" }}>TBD</span>;
  const isEmail = url.startsWith("mailto:");
  return (
    <a href={url} target={isEmail ? undefined : "_blank"} rel="noopener noreferrer"
      onClick={stopProp ? e => e.stopPropagation() : undefined}
      style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700,
        padding:"3px 9px", borderRadius:20, background:"#dbeafe", color:"#1e40af",
        textDecoration:"none", whiteSpace:"nowrap" }}>
      <i className={`ti ${isEmail ? "ti-mail" : "ti-browser"}`} style={{ fontSize:11 }} aria-hidden="true" />
      {label || (isEmail ? "Email to apply" : "Open portal")}
      <i className="ti ti-arrow-up-right" style={{ fontSize:10 }} aria-hidden="true" />
    </a>
  );
}

// ─── INITIATIVE TAG ───────────────────────────────────────────────────────────
function InitTag({ label, highlight }) {
  return (
    <span style={{
      fontSize:10, padding:"2px 7px", borderRadius:10, fontWeight:500,
      background: highlight ? "#eff6ff" : "#f3f4f6",
      color: highlight ? "#1e40af" : "#374151",
      border: highlight ? "1px solid #bfdbfe" : "1px solid #d1d5db",
    }}>{label}</span>
  );
}

// ─── STATE CARD ───────────────────────────────────────────────────────────────
function StateCard({ s, onClick, isRecent }) {
  return (
    <button onClick={() => onClick(s)}
      style={{ width:"100%", textAlign:"left", cursor:"pointer", background:"#fff",
        border: isRecent ? "2px solid #7c3aed" : "2px solid #d1d5db",
        borderRadius:10, padding:"14px 16px",
        display:"flex", flexDirection:"column", gap:10, transition:"all 0.15s",
        boxShadow: isRecent ? "0 2px 10px rgba(124,58,237,0.12)" : "0 1px 3px rgba(0,0,0,0.07)",
        position:"relative", overflow:"hidden" }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = isRecent ? "#6d28d9" : "#3b82f6";
        e.currentTarget.style.boxShadow = isRecent ? "0 4px 16px rgba(124,58,237,0.22)" : "0 2px 8px rgba(59,130,246,0.18)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = isRecent ? "#7c3aed" : "#d1d5db";
        e.currentTarget.style.boxShadow = isRecent ? "0 2px 10px rgba(124,58,237,0.12)" : "0 1px 3px rgba(0,0,0,0.07)";
      }}
    >
      {/* Recently released ribbon */}
      {isRecent && (
        <div style={{ position:"absolute", top:0, right:0,
          background:"#7c3aed", color:"#fff", fontSize:9, fontWeight:800,
          padding:"3px 10px 3px 6px", borderBottomLeftRadius:8, letterSpacing:0.4,
          display:"flex", alignItems:"center", gap:3 }}>
          <i className="ti ti-sparkles" style={{ fontSize:9 }} />
          NEW RFP
        </div>
      )}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div>
          <p style={{ margin:0, fontWeight:700, fontSize:15, color:"#111827" }}>{s.name}</p>
          <p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280", fontWeight:600 }}>{s.abbr}</p>
        </div>
        {s.status === "active"
          ? <Pill color="#065f46" bg="#dcfce7" icon="ti-circle-check">Active</Pill>
          : <Pill color="#92400e" bg="#fef3c7" icon="ti-clock">Pending</Pill>}
      </div>

      <div style={{ borderTop:"1.5px solid #e5e7eb", paddingTop:10 }}>
        <p style={{ margin:"0 0 4px", fontSize:12, color:"#374151" }}>{s.agency}</p>
        <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#111827" }}>{s.award}</p>
      </div>

      <div style={{ borderTop:"1.5px solid #e5e7eb", paddingTop:8, display:"flex", flexDirection:"column", gap:6 }}>
        {s.status === "active" ? (
          <>
            <PortalLink url={s.portalUrl} stopProp />
            <p style={{ margin:0, fontSize:11, color:"#6b7280" }}>
              <i className="ti ti-calendar" style={{ fontSize:11, marginRight:3 }} />
              {(s.deadline || "").length > 44 ? (s.deadline || "").slice(0, 44) + "…" : (s.deadline || "See portal")}
            </p>
          </>
        ) : (
          <p style={{ margin:0, fontSize:12, color:"#92400e", fontWeight:500 }}>
            <i className="ti ti-calendar" style={{ fontSize:12, marginRight:4 }} />
            Est. release: {s.anticipatedRelease}
          </p>
        )}
        {/* Show up to 3 initiative tags on the card */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
          {(s.initiatives || []).slice(0, 3).map(i => (
            <InitTag key={i} label={i} />
          ))}
          {(s.initiatives || []).length > 3 && (
            <span style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:"#f3f4f6",
              color:"#9ca3af", border:"1px solid #d1d5db", fontWeight:500 }}>
              +{(s.initiatives || []).length - 3} more
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── STATE OVERLAY ────────────────────────────────────────────────────────────
function Overlay({ s, onClose, isRecent }) {
  const isEmail = s.portalUrl?.startsWith("mailto:");

  const steps = [
    { n:1, icon:"ti-browser",   title:`Visit ${s.name}'s official RHTP page`,
      body:`Navigate to ${s.agency}'s RHTP webpage — all RFPs, NOFOs, timelines, FAQs, and webinar recordings are posted there.${s.portalUrl ? ` Direct link: ${s.portalUrl}` : ""}` },
    { n:2, icon:"ti-download",  title:"Download all required documents",
      body:`Collect: the RFP/NOFO document, state program timeline, budget narrative template, scoring rubric (if posted), and any Q&A addenda posted after release.` },
    { n:3, icon:"ti-checklist", title:"Confirm your eligibility",
      body:`${s.name} RFPs are typically open to healthcare providers, FQHCs, CBOs, tribal organizations${(s.initiatives||[]).includes("Tribal Health") ? " (specifically noted for this state)" : ""}, universities, and nonprofits. Each RFP specifies its own eligible applicant types — confirm before applying.` },
    { n:4, icon:"ti-send",      title:`How ${s.name} receives applications`,
      body:`Submission method: ${s.submission || "TBD"}. ${s.portalUrl ? `Submit at: ${s.portalUrl}. ${isEmail ? "Attach your application per the RFP spec and email directly." : "Register for the portal early — account setup can take several business days."}` : "Check the state RHTP page for submission instructions as they are announced."}` },
    { n:5, icon:"ti-video",     title:`Attend ${s.name} webinars`,
      body:`${s.name} hosts webinars before application deadlines covering scoring criteria, eligible activities, required forms, and Q&A. Recordings are posted on ${s.agency}'s RHTP page.` },
    { n:6, icon:"ti-edit",      title:"Prepare your application",
      body:`Required: project narrative tied to state goals (${(s.initiatives||[]).join(", ")}), budget narrative, organizational qualifications, letters of support, rural population data, and descriptions of proposed interventions.` },
    { n:7, icon:"ti-clock",     title:"Meet the deadline",
      body:`${s.status === "active"
        ? `Current deadline: ${s.deadline}. Submit well before close — portal uploads can fail at the last minute.`
        : `Estimated release: ${s.anticipatedRelease}. Check ${s.portalUrl || "the state RHTP page"} weekly.`}` },
  ];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"flex-start",
      justifyContent:"center", padding:"1.5rem 1rem", overflowY:"auto", background:"rgba(0,0,0,0.78)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:14,
        border: isRecent ? "2px solid #7c3aed" : "2px solid #e5e7eb",
        width:"100%", maxWidth:660, padding:"1.75rem",
        boxShadow:"0 25px 60px rgba(0,0,0,0.35)", marginBottom:"2rem" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#111827" }}>
                {s.name} <span style={{ fontSize:15, color:"#6b7280", fontWeight:500 }}>({s.abbr})</span>
              </h2>
              {isRecent && (
                <span style={{ display:"inline-flex", alignItems:"center", gap:4,
                  background:"#7c3aed", color:"#fff", fontSize:11, fontWeight:800,
                  padding:"3px 10px", borderRadius:20, letterSpacing:0.3 }}>
                  <i className="ti ti-sparkles" style={{ fontSize:11 }} /> Recently released
                </span>
              )}
            </div>
            <p style={{ margin:"4px 0 0", fontSize:13, color:"#6b7280" }}>{s.agency}</p>
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{ background:"#111827", color:"#fff", border:"none", borderRadius:8,
              cursor:"pointer", padding:"7px 14px", fontSize:13, fontWeight:700,
              display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
            <i className="ti ti-x" /> Close
          </button>
        </div>

        {/* Recently released callout */}
        {isRecent && (
          <div style={{ marginBottom:14, padding:"10px 14px", background:"#f5f3ff",
            border:"2px solid #7c3aed", borderRadius:8,
            display:"flex", alignItems:"center", gap:10 }}>
            <i className="ti ti-sparkles" style={{ fontSize:18, color:"#7c3aed", flexShrink:0 }} />
            <p style={{ margin:0, fontSize:13, color:"#4c1d95", fontWeight:600 }}>
              This state recently released new RFP opportunities. Check the portal now for open application windows.
            </p>
          </div>
        )}

        {/* Info grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
          {[
            { label:"Award", val:s.award, icon:"ti-coin" },
            { label:"Status", val:s.status==="active"?"Active — RFPs released":"Pending", icon:"ti-info-circle" },
            { label:s.status==="active"?"Deadline":"Est. Release", val:s.deadline||s.anticipatedRelease||"TBD", icon:"ti-calendar" },
            { label:"Submission", val:s.submission||"TBD", icon:"ti-send" },
          ].map(({ label, val, icon }) => (
            <div key={label} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:"10px 12px" }}>
              <p style={{ margin:0, fontSize:11, color:"#6b7280", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>
                <i className={`ti ${icon}`} style={{ fontSize:11, marginRight:4 }} />{label}
              </p>
              <p style={{ margin:"5px 0 0", fontSize:13, fontWeight:700, color:"#111827" }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Portal link */}
        {s.portalUrl && (
          <div style={{ marginBottom:14, padding:"12px 14px", background:"#eff6ff",
            border:"2px solid #3b82f6", borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
            <div>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#1e40af" }}>
                {isEmail ? "Apply via email" : "Submit via portal"}
              </p>
              <p style={{ margin:0, fontSize:11, color:"#1e3a8a", wordBreak:"break-all" }}>{s.portalUrl}</p>
            </div>
            <a href={s.portalUrl} target={isEmail ? undefined : "_blank"} rel="noopener noreferrer"
              style={{ fontSize:13, padding:"8px 16px", background:"#2563eb", color:"#fff",
                borderRadius:7, textDecoration:"none", fontWeight:700, whiteSpace:"nowrap" }}>
              {isEmail ? "Open email" : "Open portal"} <i className="ti ti-arrow-up-right" style={{ fontSize:12 }} />
            </a>
          </div>
        )}

        {/* ALL Initiatives — full list */}
        <div style={{ marginBottom:14 }}>
          <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700, color:"#111827" }}>
            All key initiatives
            <span style={{ fontSize:11, fontWeight:500, color:"#6b7280", marginLeft:6 }}>
              ({(s.initiatives || []).length} total)
            </span>
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {ALL_INITIATIVES.map(i => {
              const hasIt = (s.initiatives || []).includes(i);
              return (
                <span key={i} style={{
                  fontSize:12, padding:"4px 10px", borderRadius:20, fontWeight:600,
                  background: hasIt ? "#eff6ff" : "#f9fafb",
                  color: hasIt ? "#1e40af" : "#9ca3af",
                  border: hasIt ? "1.5px solid #bfdbfe" : "1.5px solid #e5e7eb",
                  opacity: hasIt ? 1 : 0.55,
                }}>
                  {hasIt && <i className="ti ti-check" style={{ fontSize:10, marginRight:3, color:"#2563eb" }} />}
                  {i}
                </span>
              );
            })}
          </div>
          <p style={{ margin:"8px 0 0", fontSize:11, color:"#9ca3af" }}>
            Blue = initiative present in this state's program. Gray = not a listed focus area.
          </p>
        </div>

        {/* Notes */}
        <div style={{ marginBottom:14, padding:"12px 14px", background:"#fffbeb",
          border:"1px solid #fcd34d", borderRadius:8 }}>
          <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#92400e" }}>Program notes</p>
          <p style={{ margin:0, fontSize:13, color:"#78350f", lineHeight:1.6 }}>{s.notes}</p>
        </div>

        {/* Contact */}
        <div style={{ marginBottom:14, padding:"10px 12px", background:"#f9fafb",
          border:"1px solid #e5e7eb", borderRadius:8 }}>
          <p style={{ margin:"0 0 2px", fontSize:12, fontWeight:700, color:"#374151" }}>Contact</p>
          <p style={{ margin:0, fontSize:13, color:"#6b7280" }}>{s.contact}</p>
        </div>

        {/* Step-by-step guide */}
        <div style={{ marginBottom:14 }}>
          <p style={{ margin:"0 0 12px", fontSize:14, fontWeight:700 }}>How to apply in {s.name}</p>
          {steps.map(st => (
            <div key={st.n} style={{ display:"flex", gap:12, marginBottom:10 }}>
              <div style={{ flexShrink:0, width:26, height:26, borderRadius:"50%",
                background:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{st.n}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:13, color:"#111827" }}>
                  <i className={`ti ${st.icon}`} style={{ fontSize:13, marginRight:5, color:"#6b7280" }} />{st.title}
                </p>
                <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.6 }}>{st.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Key documents */}
        {s.status === "active" && (
          <div style={{ marginBottom:14 }}>
            <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700 }}>Key documents</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                { label:"State RFP / application page", url:s.rfpUrl || RHIHUB_URL, icon:"ti-clipboard-list" },
                { label:"CMS NOFO (federal)", url:CMS_NOFO_URL, icon:"ti-file-text" },
                { label:"NRHA real-time tracker", url:NRHA_TRACKER, icon:"ti-map" },
              ].map(({ label, url, icon }) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px",
                    borderRadius:8, border:"1px solid #d1d5db", color:"#111827",
                    textDecoration:"none", fontSize:13, fontWeight:600, background:"#fff" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <i className={`ti ${icon}`} style={{ fontSize:16, color:"#6b7280" }} />{label}
                  <i className="ti ti-arrow-up-right" style={{ fontSize:13, marginLeft:"auto", color:"#9ca3af" }} />
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding:"10px 14px", background:"#fffbeb",
          border:"1px solid #fcd34d", borderRadius:8 }}>
          <p style={{ margin:0, fontSize:12, color:"#92400e" }}>
            <i className="ti ti-alert-triangle" style={{ fontSize:12, marginRight:5 }} />
            <strong>Always verify</strong> deadlines directly with {s.agency} before applying.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── DEADLINE TRACKER ─────────────────────────────────────────────────────────
function DeadlineTracker({ deadlines }) {
  const [urgFilter, setUrgFilter] = useState("all");
  const [sortBy, setSortBy]       = useState("urgency"); // "urgency" | "dueDate" | "releaseDate"

  const urgMap = {
    open:     { color:"#16a34a", label:"Open now",        icon:"ti-circle-check", order:0 },
    upcoming: { color:"#d97706", label:"Upcoming",        icon:"ti-clock",        order:1 },
    watch:    { color:"#2563eb", label:"Watch for round", icon:"ti-eye",          order:2 },
    pending:  { color:"#9ca3af", label:"Not released",    icon:"ti-minus",        order:3 },
  };

  // Parse a rough date from the nextDue string for sorting
  function parseDue(str) {
    if (!str) return new Date("2099-01-01");
    const m = str.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (\d+),? (\d{4})/i);
    if (m) return new Date(`${m[1]} ${m[2]} ${m[3]}`);
    if (/Q1 2026/i.test(str)) return new Date("2026-03-31");
    if (/Q2 2026/i.test(str)) return new Date("2026-06-30");
    if (/Q3 2026/i.test(str)) return new Date("2026-09-30");
    if (/Q4 2026/i.test(str)) return new Date("2026-12-31");
    if (/Mid-2026/i.test(str)) return new Date("2026-06-30");
    if (/rolling/i.test(str)) return new Date("2026-07-01");
    return new Date("2099-01-01");
  }

  const filtered = useMemo(() => {
    let list = urgFilter === "all" ? [...deadlines] : deadlines.filter(d => d.urgency === urgFilter);
    if (sortBy === "urgency") {
      list.sort((a, b) => (urgMap[a.urgency]?.order ?? 9) - (urgMap[b.urgency]?.order ?? 9));
    } else if (sortBy === "dueDate") {
      list.sort((a, b) => parseDue(a.nextDue) - parseDue(b.nextDue));
    } else if (sortBy === "releaseDate") {
      // "open" items came first historically, then upcoming, then pending
      list.sort((a, b) => {
        const rOrder = { open:0, upcoming:1, watch:2, pending:3 };
        return (rOrder[a.urgency] ?? 9) - (rOrder[b.urgency] ?? 9);
      });
    }
    return list;
  }, [deadlines, urgFilter, sortBy]);

  const urgFilters = ["all","open","upcoming","watch","pending"];
  const urgLabels  = { all:"All states", open:"Open now", upcoming:"Upcoming", watch:"Watch for round", pending:"Not released" };

  // Group by urgency only when not sorting by date
  const grouped = useMemo(() => {
    if (sortBy !== "urgency") return null;
    const g = {};
    for (const u of ["open","upcoming","watch","pending"]) {
      g[u] = filtered.filter(d => d.urgency === u);
    }
    return g;
  }, [filtered, sortBy]);

  function DeadlineRow({ d }) {
    const u = urgMap[d.urgency] || urgMap.pending;
    return (
      <div style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"12px 14px",
        display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:12, alignItems:"start" }}>
        <div>
          <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>{d.name}</p>
          <p style={{ margin:"2px 0 5px", fontSize:11, color:"#6b7280", fontWeight:600 }}>{d.award}</p>
          <PortalLink url={d.portalUrl} label="Open portal" />
        </div>
        <div>
          <p style={{ margin:"0 0 2px", fontSize:11, fontWeight:700, color:"#374151",
            textTransform:"uppercase", letterSpacing:0.4 }}>Current status</p>
          <p style={{ margin:"0 0 6px", fontSize:12, color:"#111827", fontWeight:600 }}>{d.specificDate}</p>
          <p style={{ margin:"0 0 2px", fontSize:11, fontWeight:700, color:"#374151",
            textTransform:"uppercase", letterSpacing:0.4 }}>Next due date</p>
          <p style={{ margin:"2px 0 0", fontSize:12, color:"#1e40af", fontWeight:700 }}>{d.nextDue}</p>
        </div>
        <Pill color={u.color} bg={u.color + "18"} icon={u.icon}>{u.label}</Pill>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        {/* Urgency filter pills */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", flex:1 }}>
          {urgFilters.map(f => {
            const u = urgMap[f];
            const count = f === "all" ? deadlines.length : deadlines.filter(d => d.urgency === f).length;
            return (
              <button key={f} onClick={() => setUrgFilter(f)}
                style={{ padding:"6px 12px", fontSize:12, fontWeight:urgFilter===f?700:500,
                  border:"1.5px solid", cursor:"pointer", borderRadius:20,
                  borderColor: urgFilter===f ? (u?.color || "#2563eb") : "#d1d5db",
                  background: urgFilter===f ? ((u?.color || "#2563eb") + "18") : "#fff",
                  color: urgFilter===f ? (u?.color || "#2563eb") : "#374151",
                  display:"flex", alignItems:"center", gap:4 }}>
                {u && <i className={`ti ${u.icon}`} style={{ fontSize:11 }} />}
                {urgLabels[f]}
                <span style={{ fontSize:10, fontWeight:600, opacity:0.7 }}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <i className="ti ti-arrows-sort" style={{ fontSize:13, color:"#6b7280" }} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ border:"1.5px solid #d1d5db", borderRadius:8, padding:"7px 10px",
              fontSize:12, color:"#111827", background:"#fff", cursor:"pointer" }}>
            <option value="urgency">Sort: by urgency</option>
            <option value="dueDate">Sort: by due date</option>
            <option value="releaseDate">Sort: by release status</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom:14, padding:"10px 14px", background:"#fffbeb",
        border:"1px solid #fcd34d", borderRadius:8, fontSize:13, color:"#92400e" }}>
        <i className="ti ti-info-circle" style={{ fontSize:13, marginRight:6 }} />
        Many states use rolling deadlines. "Next due" shows the soonest estimated close date.
        Always verify exact dates with the state agency before applying.
      </div>

      {/* Results count */}
      <p style={{ margin:"0 0 10px", fontSize:12, color:"#6b7280", fontWeight:500 }}>
        Showing {filtered.length} state{filtered.length !== 1 ? "s" : ""}
        {urgFilter !== "all" ? ` · filtered by "${urgLabels[urgFilter]}"` : ""}
        {sortBy !== "urgency" ? ` · sorted by ${sortBy === "dueDate" ? "due date" : "release status"}` : ""}
      </p>

      {/* Grouped view (when sort = urgency) */}
      {grouped ? (
        ["open","upcoming","watch","pending"].map(u => {
          const items = grouped[u];
          if (!items || items.length === 0) return null;
          const meta = urgMap[u];
          return (
            <div key={u} style={{ marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10,
                padding:"8px 12px", borderRadius:8,
                background:meta.color + "18", borderLeft:`4px solid ${meta.color}` }}>
                <i className={`ti ${meta.icon}`} style={{ fontSize:16, color:meta.color }} />
                <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>
                  {meta.label} <span style={{ fontWeight:500, color:"#6b7280" }}>({items.length})</span>
                </p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {items.map(d => <DeadlineRow key={d.abbr} d={d} />)}
              </div>
            </div>
          );
        })
      ) : (
        /* Flat sorted view */
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {filtered.map(d => <DeadlineRow key={d.abbr} d={d} />)}
        </div>
      )}
    </div>
  );
}

// ─── COMPANY TAB ─────────────────────────────────────────────────────────────
const ANDOR = {
  name:"Andor Health", url:"https://andorhealth.com", tagline:"AI-powered virtual care platform (ThinkAndor®)",
  color:"#1e40af", bg:"#eff6ff", border:"#bfdbfe",
  capabilities:[
    "ThinkAndor® — generative AI virtual care platform (#1 KLAS-rated 2024–2026)",
    "Ambient AI documentation — saves 3+ hrs of nursing documentation per shift",
    "Virtual nursing & remote patient monitoring across hospital wards",
    "AI-enabled triage, virtual rounding, and remote specialty consultations",
    "Real-time EHR integration (Epic, Cerner, athenahealth)",
    "Agentic AI — automates care coordination and expands rural provider capacity",
    "Deployed at Sentara Health (12 hospitals), Ballad Health (rural Appalachia), MUSC",
    "Frost & Sullivan 2025 North American Transformational Innovation Award",
  ],
  rhtAlignment:[
    { initiative:"Technology Innovation", fit:"Strong", reason:"ThinkAndor® directly satisfies CMS RHT priorities for AI, remote monitoring, and technology-enabled rural care delivery." },
    { initiative:"Workforce Development", fit:"Strong", reason:"Ambient AI saves 3+ hrs/shift per floor — directly reduces clinician burnout and extends rural workforce capacity without adding staff." },
    { initiative:"Telehealth", fit:"Strong", reason:"Enables virtual rounding, remote consultations, and specialist access — exactly the telehealth routing rural hospitals need." },
    { initiative:"Chronic Disease", fit:"Moderate", reason:"Remote patient monitoring and predictive care tools support chronic disease management programs." },
    { initiative:"Rural Hospital Support", fit:"Strong", reason:"Deployed at Ballad Health (rural Appalachia). Reduces operational costs by up to 70%." },
    { initiative:"Behavioral Health", fit:"Moderate", reason:"Virtual consultation routing can connect rural patients with behavioral health specialists." },
  ],
};

const PSYNERGY = {
  name:"Psynergy Health", url:"https://psynergy.health", tagline:"Virtual clinical workforce & care coordination services",
  color:"#065f46", bg:"#f0fdf4", border:"#86efac",
  capabilities:[
    "Virtual nursing — remote RNs for assessments, monitoring, documentation, and coordination",
    "Virtual physicians and advanced practice providers (APPs) deployed to rural hospitals",
    "AI-enabled triage and telehealth routing to right-level care",
    "Remote specialty consultation — gives small hospitals access to specialist expertise",
    "Continuous remote patient monitoring — fall prevention, sitter cost reduction",
    "Ambient AI documentation integrated with virtual workforce services",
    "Founded 2023, Orlando FL — explicitly built for rural health transformation",
    "CMS RHTP alignment publicly announced at HIMSS March 9, 2026",
  ],
  rhtAlignment:[
    { initiative:"Workforce Development", fit:"Strong", reason:"Core product: virtual clinical workforce (RNs, physicians, APPs) that augments rural clinical teams — directly solves rural staffing shortages." },
    { initiative:"Telehealth", fit:"Strong", reason:"AI-enabled triage, telehealth routing, and remote specialty consultation are Psynergy's primary service lines." },
    { initiative:"Rural Hospital Support", fit:"Strong", reason:"Designed explicitly for rural hospitals. Reduces ED overutilization and avoidable hospitalizations." },
    { initiative:"Chronic Disease", fit:"Strong", reason:"Remote monitoring and predictive care programs identify and manage chronic diseases earlier." },
    { initiative:"Technology Innovation", fit:"Strong", reason:"Combines ambient AI, interoperability, and virtual workforce — satisfies CMS technology innovation priorities." },
    { initiative:"Behavioral Health", fit:"Moderate", reason:"Virtual APPs and specialty routing can include behavioral health providers, extending mental health access." },
  ],
};

function CompanyMatch({ rfps }) {
  const [view, setView]           = useState("overview");
  const [rfpFilter, setRfpFilter] = useState("all");
  const filtered = rfpFilter === "all" ? rfps : rfps.filter(r => r.andorFit === rfpFilter || r.psynergyFit === rfpFilter);

  function CoCard({ co }) {
    return (
      <div style={{ background:co.bg, border:`2px solid ${co.border}`, borderRadius:12, padding:"1.25rem", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:co.color }}>{co.name}</h3>
            <p style={{ margin:"3px 0 0", fontSize:13, color:"#374151" }}>{co.tagline}</p>
          </div>
          <a href={co.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:12, padding:"6px 12px", background:co.color, color:"#fff",
              borderRadius:7, textDecoration:"none", fontWeight:700 }}>
            Website <i className="ti ti-arrow-up-right" style={{ fontSize:11 }} />
          </a>
        </div>
        <div style={{ marginBottom:12 }}>
          <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:co.color }}>Core capabilities (public record)</p>
          {co.capabilities.map((c, i) => (
            <p key={i} style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.6 }}>• {c}</p>
          ))}
        </div>
        <div>
          <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:co.color }}>RHT initiative alignment</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {co.rhtAlignment.map((a, i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8,
                padding:"10px 12px", display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ minWidth:76, flexShrink:0 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:fitColor[a.fit], background:fitBg[a.fit],
                    padding:"2px 7px", borderRadius:10, display:"block", textAlign:"center", marginBottom:4 }}>{a.fit}</span>
                  <p style={{ margin:0, fontSize:11, fontWeight:700, color:"#374151", textAlign:"center" }}>{a.initiative}</p>
                </div>
                <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.5 }}>{a.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom:14, padding:"12px 16px", background:"#eff6ff",
        border:"2px solid #bfdbfe", borderRadius:10 }}>
        <p style={{ margin:"0 0 4px", fontSize:14, fontWeight:700, color:"#1e40af" }}>
          Andor Health & Psynergy Health — RHT Applicability Analysis
        </p>
        <p style={{ margin:0, fontSize:13, color:"#1e3a8a" }}>
          Based entirely on public information. RFP list is updated daily via <code>data.json</code>.
        </p>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:14, borderBottom:"1.5px solid #e5e7eb", paddingBottom:12 }}>
        {[["overview","Company overview"],["rfps","RFP match matrix"]].map(([id, label]) => (
          <button key={id} onClick={() => setView(id)}
            style={{ padding:"8px 16px", fontSize:13, fontWeight:view===id?700:500, border:"none",
              borderBottom:view===id?"3px solid #2563eb":"3px solid transparent",
              background:"none", cursor:"pointer", color:view===id?"#2563eb":"#6b7280", marginBottom:-13 }}>
            {label}
          </button>
        ))}
      </div>

      {view === "overview" && (
        <div><CoCard co={ANDOR} /><CoCard co={PSYNERGY} /></div>
      )}

      {view === "rfps" && (
        <div>
          <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
            {["all","Strong","Moderate"].map(f => (
              <button key={f} onClick={() => setRfpFilter(f)}
                style={{ padding:"6px 14px", fontSize:12, fontWeight:rfpFilter===f?700:500,
                  border:"1.5px solid", borderColor:rfpFilter===f?"#2563eb":"#d1d5db",
                  borderRadius:20, background:rfpFilter===f?"#eff6ff":"#fff",
                  cursor:"pointer", color:rfpFilter===f?"#1e40af":"#374151" }}>
                {f === "all" ? "All RFPs" : f + " fit"}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map((r, i) => (
              <div key={i} style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"14px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                  <div>
                    <p style={{ margin:0, fontSize:15, fontWeight:800, color:"#111827" }}>{r.state}</p>
                    <p style={{ margin:"3px 0 0", fontSize:13, color:"#374151", fontWeight:600 }}>{r.rfp}</p>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20,
                      background:r.status?.includes("Open")?"#dcfce7":"#fef3c7",
                      color:r.status?.includes("Open")?"#065f46":"#92400e" }}>{r.status}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20,
                      background:"#f3f4f6", color:"#374151" }}>{r.award}</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                  {(r.initiatives || []).map(ini => (
                    <span key={ini} style={{ fontSize:10, padding:"2px 7px", borderRadius:10,
                      background:"#f3f4f6", color:"#374151", border:"1px solid #d1d5db", fontWeight:600 }}>{ini}</span>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                  {[{co:ANDOR, fit:r.andorFit, note:r.andorNote},{co:PSYNERGY, fit:r.psynergyFit, note:r.psynergyNote}].map(({co,fit,note}) => (
                    <div key={co.name} style={{ background:co.bg, border:`1px solid ${co.border}`,
                      borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                        <span style={{ fontSize:10, fontWeight:700, color:fitColor[fit],
                          background:fitBg[fit], padding:"2px 7px", borderRadius:10 }}>{fit}</span>
                        <p style={{ margin:0, fontSize:12, fontWeight:700, color:co.color }}>{co.name}</p>
                      </div>
                      <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.5 }}>{note}</p>
                    </div>
                  ))}
                </div>
                <PortalLink url={r.portalUrl} label="Open portal" />
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, padding:"10px 14px", background:"#f9fafb",
            border:"1px solid #e5e7eb", borderRadius:8, fontSize:12, color:"#6b7280" }}>
            <i className="ti ti-info-circle" style={{ fontSize:12, marginRight:5 }} />
            Based on public information only. Fit ratings reflect capability alignment — not guaranteed outcomes.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id:"states",    label:"States directory",  icon:"ti-map" },
  { id:"deadlines", label:"Deadline tracker",   icon:"ti-calendar-event" },
  { id:"company",   label:"Andor & Psynergy",   icon:"ti-building-hospital" },
  { id:"resources", label:"Key resources",      icon:"ti-link" },
];

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const { data, loading, error } = useData();
  const [tab,          setTab]          = useState("states");
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [initFilter,   setInitFilter]   = useState("all");
  const [sortStates,   setSortStates]   = useState("default"); // "default" | "recent" | "alpha" | "award"
  const [selected,     setSelected]     = useState(null);
  const [showHistory,  setShowHistory]  = useState(false);

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
      height:"100vh", flexDirection:"column", gap:12 }}>
      <i className="ti ti-loader-2" style={{ fontSize:36, color:"#2563eb" }} />
      <p style={{ color:"#6b7280", fontSize:14 }}>Loading RHT data…</p>
    </div>
  );

  if (error) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
      height:"100vh", flexDirection:"column", gap:12 }}>
      <i className="ti ti-alert-circle" style={{ fontSize:36, color:"#dc2626" }} />
      <p style={{ color:"#dc2626", fontSize:14 }}>Failed to load data.json: {error}</p>
      <p style={{ color:"#6b7280", fontSize:12 }}>Make sure data.json exists and is valid JSON.</p>
    </div>
  );

  const { states = [], deadlines = [], rfpOpportunities = [], _meta = {} } = data;

  // Base filter
  let filtered = states.filter(s => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) || s.abbr.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || s.status === statusFilter;
    const mi = initFilter === "all" || (s.initiatives || []).includes(initFilter);
    return ms && mf && mi;
  });

  // Sorting
  if (sortStates === "recent") {
    filtered = [...filtered].sort((a, b) => {
      const aR = RECENTLY_RELEASED.has(a.abbr) ? 0 : 1;
      const bR = RECENTLY_RELEASED.has(b.abbr) ? 0 : 1;
      if (aR !== bR) return aR - bR;
      return a.name.localeCompare(b.name);
    });
  } else if (sortStates === "alpha") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortStates === "award") {
    // Parse dollar amounts for sort
    const parseAward = str => {
      if (!str) return 0;
      const m = str.match(/\$(\d+(?:\.\d+)?)(M|B)?/i);
      if (!m) return 0;
      const n = parseFloat(m[1]);
      return m[2]?.toUpperCase() === "B" ? n * 1000 : n;
    };
    filtered = [...filtered].sort((a, b) => parseAward(b.award) - parseAward(a.award));
  }
  // default = active first, then pending, alpha within groups
  else {
    filtered = [...filtered].sort((a, b) => {
      if (a.status !== b.status) return a.status === "active" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  // Split for grouped display only when not sorting by recent/alpha/award explicitly
  const showGrouped = sortStates === "default";
  const filtActive  = showGrouped ? filtered.filter(s => s.status === "active")  : [];
  const filtPending = showGrouped ? filtered.filter(s => s.status === "pending") : [];
  const filtFlat    = showGrouped ? [] : filtered;

  const recentActive = states.filter(s => s.status === "active" && RECENTLY_RELEASED.has(s.abbr)).length;

  return (
    <div style={{ fontFamily:"'Inter',system-ui,-apple-system,sans-serif",
      background:"#f3f4f6", minHeight:"100vh", padding:"1.5rem 1rem 4rem" }}>
      <div style={{ maxWidth:940, margin:"0 auto" }}>

        {/* HEADER */}
        <div style={{ background:"#1e3a8a", borderRadius:12, padding:"1.5rem", marginBottom:"1rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:"#fff" }}>RHT RFP Central Hub</h1>
              <p style={{ margin:"4px 0 0", fontSize:13, color:"#bfdbfe" }}>
                Rural Health Transformation Program · All 50 states · Updated daily
              </p>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#16a34a", color:"#fff", fontWeight:700 }}>
                {states.filter(s => s.status === "active").length} Active
              </span>
              <span style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#d97706", color:"#fff", fontWeight:700 }}>
                {states.filter(s => s.status === "pending").length} Pending
              </span>
              <span style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#7c3aed", color:"#fff", fontWeight:700 }}>
                <i className="ti ti-sparkles" style={{ fontSize:11, marginRight:3 }} />
                {recentActive} New RFPs
              </span>
            </div>
          </div>

          <div style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <p style={{ margin:0, fontSize:12, color:"#93c5fd" }}>
              <i className="ti ti-refresh" style={{ fontSize:12, marginRight:5 }} />
              Data last updated: <strong style={{ color:"#fff" }}>{_meta.lastUpdated || "Unknown"}</strong>
              {_meta.updatedBy && <span style={{ color:"#bfdbfe" }}> · {_meta.updatedBy}</span>}
            </p>
            {(_meta.updateHistory?.length > 0 || _meta.notes) && (
              <button onClick={() => setShowHistory(v => !v)}
                style={{ fontSize:11, color:"#bfdbfe", background:"none",
                  border:"1px solid #3b5ba9", borderRadius:12, padding:"2px 10px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:4 }}>
                <i className="ti ti-history" style={{ fontSize:11 }} />
                {showHistory ? "Hide" : "Show"} update history
                {_meta.updateHistory?.length > 0 && (
                  <span style={{ background:"#3b5ba9", borderRadius:10, padding:"0 5px", fontSize:10, fontWeight:700 }}>
                    {_meta.updateHistory.length}
                  </span>
                )}
              </button>
            )}
          </div>

          {showHistory && (
            <div style={{ marginTop:10, background:"rgba(0,0,0,0.28)", borderRadius:10, padding:"12px 14px",
              display:"flex", flexDirection:"column", gap:0 }}>
              <p style={{ margin:"0 0 10px", fontSize:11, fontWeight:700, color:"#93c5fd",
                textTransform:"uppercase", letterSpacing:0.6 }}>
                <i className="ti ti-history" style={{ fontSize:11, marginRight:5 }} />
                Update history
              </p>

              {/* Structured history entries */}
              {(_meta.updateHistory || []).map((entry, i) => (
                <div key={i} style={{ display:"flex", gap:10, paddingBottom: i < (_meta.updateHistory.length - 1) || _meta.notes ? 10 : 0,
                  marginBottom: i < (_meta.updateHistory.length - 1) || _meta.notes ? 10 : 0,
                  borderBottom: i < (_meta.updateHistory.length - 1) || _meta.notes ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                  {/* Timeline dot */}
                  <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:0 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%",
                      background: i === 0 ? "#60a5fa" : "#3b5ba9", marginTop:3 }} />
                    {(i < (_meta.updateHistory.length - 1) || _meta.notes) && (
                      <div style={{ width:1, flex:1, background:"rgba(255,255,255,0.1)", marginTop:3 }} />
                    )}
                  </div>
                  <div style={{ flex:1, paddingBottom:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                      <span style={{ fontSize:12, fontWeight:700, color: i === 0 ? "#93c5fd" : "#6b8ec7" }}>
                        {entry.date}
                      </span>
                      {entry.updatedBy && (
                        <span style={{ fontSize:11, color:"#6b8ec7", fontWeight:500 }}>· {entry.updatedBy}</span>
                      )}
                      {i === 0 && (
                        <span style={{ fontSize:10, fontWeight:700, background:"#1e40af",
                          color:"#bfdbfe", padding:"1px 7px", borderRadius:10 }}>latest</span>
                      )}
                    </div>
                    <p style={{ margin:0, fontSize:12, color:"#93c5fd", lineHeight:1.7 }}>{entry.notes}</p>
                    {entry.statesUpdated?.length > 0 && (
                      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6 }}>
                        {entry.statesUpdated.map(abbr => (
                          <span key={abbr} style={{ fontSize:10, fontWeight:700, padding:"1px 6px",
                            borderRadius:8, background:"rgba(59,91,169,0.5)", color:"#bfdbfe" }}>{abbr}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Legacy _meta.notes fallback — shown as oldest entry if no structured history yet */}
              {_meta.notes && !_meta.updateHistory?.length && (
                <div style={{ display:"flex", gap:10 }}>
                  <div style={{ flexShrink:0 }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:"#3b5ba9", marginTop:3 }} />
                  </div>
                  <div>
                    <p style={{ margin:"0 0 3px", fontSize:12, fontWeight:700, color:"#6b8ec7" }}>
                      {_meta.lastUpdated || "Previous version"}
                      <span style={{ fontSize:10, fontWeight:500, marginLeft:6, color:"#6b8ec7" }}>(legacy note)</span>
                    </p>
                    <p style={{ margin:0, fontSize:12, color:"#93c5fd", lineHeight:1.7 }}>{_meta.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* TABS */}
        <div style={{ background:"#fff", borderRadius:10, border:"1.5px solid #e5e7eb",
          marginBottom:"1rem", overflowX:"auto", display:"flex" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex:"0 0 auto", padding:"12px 16px", fontSize:13,
                fontWeight:tab===t.id?700:500, border:"none",
                borderBottom:tab===t.id?"3px solid #2563eb":"3px solid transparent",
                background:"none", cursor:"pointer",
                color:tab===t.id?"#2563eb":"#6b7280",
                display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
              <i className={`ti ${t.icon}`} style={{ fontSize:14 }} />{t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ background:"#fff", borderRadius:10, border:"1.5px solid #e5e7eb", padding:"1.5rem" }}>

          {/* ── STATES DIRECTORY ── */}
          {tab === "states" && (
            <>
              {/* Filters row */}
              <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
                <div style={{ position:"relative", flex:1, minWidth:180 }}>
                  <i className="ti ti-search" style={{ position:"absolute", left:10,
                    top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }} />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by state name or abbreviation…"
                    style={{ width:"100%", boxSizing:"border-box",
                      border:"1.5px solid #d1d5db", borderRadius:8,
                      padding:"9px 12px 9px 34px", fontSize:13, color:"#111827", outline:"none" }} />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  style={{ minWidth:150, border:"1.5px solid #d1d5db", borderRadius:8,
                    padding:"9px 12px", fontSize:13, color:"#111827", background:"#fff" }}>
                  <option value="all">All statuses</option>
                  <option value="active">Active only</option>
                  <option value="pending">Pending only</option>
                </select>
                <select value={initFilter} onChange={e => setInitFilter(e.target.value)}
                  style={{ minWidth:210, border:"1.5px solid #d1d5db", borderRadius:8,
                    padding:"9px 12px", fontSize:13, color:"#111827", background:"#fff" }}>
                  <option value="all">All key initiatives</option>
                  {ALL_INITIATIVES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {/* Sort row */}
              <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
                <i className="ti ti-arrows-sort" style={{ fontSize:13, color:"#6b7280" }} />
                <span style={{ fontSize:12, color:"#6b7280", fontWeight:500 }}>Sort:</span>
                {[
                  { id:"default",  label:"Default (active first)" },
                  { id:"recent",   label:"Recently released", icon:"ti-sparkles" },
                  { id:"alpha",    label:"A → Z" },
                  { id:"award",    label:"Largest award" },
                ].map(opt => (
                  <button key={opt.id} onClick={() => setSortStates(opt.id)}
                    style={{ padding:"5px 12px", fontSize:12, fontWeight:sortStates===opt.id?700:500,
                      border:"1.5px solid", cursor:"pointer", borderRadius:20,
                      borderColor: sortStates===opt.id ? "#7c3aed" : "#d1d5db",
                      background: sortStates===opt.id ? "#f5f3ff" : "#fff",
                      color: sortStates===opt.id ? "#6d28d9" : "#374151",
                      display:"flex", alignItems:"center", gap:4 }}>
                    {opt.icon && <i className={`ti ${opt.icon}`} style={{ fontSize:11 }} />}
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Recently released callout banner */}
              {sortStates === "recent" && (
                <div style={{ marginBottom:14, padding:"10px 14px", background:"#f5f3ff",
                  border:"2px solid #7c3aed", borderRadius:8,
                  display:"flex", alignItems:"center", gap:10 }}>
                  <i className="ti ti-sparkles" style={{ fontSize:18, color:"#7c3aed" }} />
                  <p style={{ margin:0, fontSize:13, color:"#4c1d95", fontWeight:600 }}>
                    Showing recently released RFPs first — {recentActive} states released new opportunities in the last 30 days.
                  </p>
                </div>
              )}

              {/* Active filter indicator */}
              {initFilter !== "all" && (
                <div style={{ marginBottom:12, padding:"8px 12px", background:"#eff6ff",
                  border:"1px solid #bfdbfe", borderRadius:8, display:"flex", alignItems:"center", gap:8 }}>
                  <i className="ti ti-filter" style={{ fontSize:13, color:"#2563eb" }} />
                  <p style={{ margin:0, fontSize:13, color:"#1e40af", fontWeight:600 }}>
                    Filtering by "{initFilter}" — {filtered.length} state{filtered.length !== 1 ? "s" : ""} found
                  </p>
                  <button onClick={() => setInitFilter("all")}
                    style={{ marginLeft:"auto", background:"none", border:"none",
                      cursor:"pointer", fontSize:12, color:"#2563eb", fontWeight:700 }}>
                    Clear ×
                  </button>
                </div>
              )}

              {/* Grouped layout (default sort) */}
              {showGrouped && (
                <>
                  {filtActive.length > 0 && (
                    <div style={{ marginBottom:24 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10,
                        padding:"8px 12px", background:"#f0fdf4", borderRadius:8, borderLeft:"4px solid #16a34a" }}>
                        <i className="ti ti-circle-check" style={{ fontSize:16, color:"#16a34a" }} />
                        <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>
                          Active states — RFPs released <span style={{ fontWeight:500, color:"#6b7280" }}>({filtActive.length})</span>
                        </p>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:12 }}>
                        {filtActive.map(s => <StateCard key={s.abbr} s={s} onClick={setSelected} isRecent={RECENTLY_RELEASED.has(s.abbr)} />)}
                      </div>
                    </div>
                  )}
                  {filtPending.length > 0 && (
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10,
                        padding:"8px 12px", background:"#fffbeb", borderRadius:8, borderLeft:"4px solid #d97706" }}>
                        <i className="ti ti-clock" style={{ fontSize:16, color:"#d97706" }} />
                        <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>
                          Pending states — awaiting RFP release <span style={{ fontWeight:500, color:"#6b7280" }}>({filtPending.length})</span>
                        </p>
                      </div>
                      <div style={{ marginBottom:10, padding:"10px 14px", background:"#fffbeb",
                        border:"1px solid #fcd34d", borderRadius:8, fontSize:13, color:"#92400e" }}>
                        These states received CMS awards but have not yet released RFPs. Click a card to see details and the official state RHTP page.
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:12 }}>
                        {filtPending.map(s => <StateCard key={s.abbr} s={s} onClick={setSelected} isRecent={false} />)}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Flat layout (sorted views) */}
              {!showGrouped && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:12 }}>
                  {filtFlat.map(s => <StateCard key={s.abbr} s={s} onClick={setSelected} isRecent={RECENTLY_RELEASED.has(s.abbr)} />)}
                </div>
              )}

              {filtered.length === 0 && (
                <p style={{ color:"#6b7280", fontSize:14, textAlign:"center", padding:"2rem" }}>
                  No states match your filters.
                </p>
              )}
            </>
          )}

          {/* ── DEADLINE TRACKER ── */}
          {tab === "deadlines" && <DeadlineTracker deadlines={deadlines} />}

          {/* ── COMPANY MATCH ── */}
          {tab === "company" && <CompanyMatch rfps={rfpOpportunities} />}

          {/* ── RESOURCES ── */}
          {tab === "resources" && (
            <div>
              <p style={{ margin:"0 0 16px", fontSize:13, color:"#6b7280" }}>Master documents, trackers, and authoritative sources.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { label:"CMS RHT Program overview", desc:"Official CMS page — program goals, NOFO info, and contacts", url:"https://www.cms.gov/priorities/rural-health-transformation-rht-program/overview", icon:"ti-building-hospital" },
                  { label:"CMS NOFO (full PDF)", desc:"The complete Notice of Funding Opportunity — master federal document", url:CMS_NOFO_URL, icon:"ti-file-text" },
                  { label:"grants.gov official listing", desc:"Federal grants listing with application instructions", url:GRANTS_GOV, icon:"ti-external-link" },
                  { label:"NRHA state RFP tracker", desc:"Real-time interactive map of every state's RFP procurement stage", url:NRHA_TRACKER, icon:"ti-map" },
                  { label:"RHIhub state programs directory", desc:"Links to all 50 state RHTP program pages with application materials", url:RHIHUB_URL, icon:"ti-list" },
                  { label:"SHVS state implementation tracker", desc:"Which agencies lead RHTP in each state", url:SHVS_URL, icon:"ti-chart-bar" },
                  { label:"RHTP Tracker (daily updates)", desc:"Daily updates on RFPs, awards, and documents across all 50 states", url:"https://rhtp.amemobile.net/", icon:"ti-refresh" },
                  { label:"Andor Health (ThinkAndor®)", desc:"AI-powered virtual care platform — KLAS #1 rated 2024–2026", url:"https://andorhealth.com", icon:"ti-robot" },
                  { label:"Psynergy Health", desc:"Virtual clinical workforce for rural health systems", url:"https://psynergy.health", icon:"ti-heart-plus" },
                  { label:"Email CMS directly", desc:"MAHARural@cms.hhs.gov — CMS RHT Program team", url:"mailto:MAHARural@cms.hhs.gov", icon:"ti-mail" },
                ].map(({ label, desc, url, icon }) => (
                  <a key={label} href={url} target={url.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px",
                      borderRadius:8, border:"1.5px solid #e5e7eb", color:"#111827",
                      textDecoration:"none", background:"#fff" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                    <div style={{ width:36, height:36, borderRadius:8, background:"#eff6ff",
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={`ti ${icon}`} style={{ fontSize:18, color:"#2563eb" }} />
                    </div>
                    <div>
                      <p style={{ margin:0, fontSize:14, fontWeight:700 }}>{label}</p>
                      <p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280" }}>{desc}</p>
                    </div>
                    <i className="ti ti-arrow-up-right" style={{ fontSize:15, color:"#9ca3af", marginLeft:"auto", marginTop:2, flexShrink:0 }} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <p style={{ marginTop:"1.5rem", fontSize:11, color:"#9ca3af", textAlign:"center" }}>
          Data sourced from CMS, official state RHTP websites, NRHA, RHIhub, and SHVS.
          Updated manually via Claude. Always verify with the state agency before applying.
        </p>
      </div>

      {selected && (
        <Overlay
          s={selected}
          onClose={() => setSelected(null)}
          isRecent={RECENTLY_RELEASED.has(selected.abbr)}
        />
      )}
    </div>
  );
}
