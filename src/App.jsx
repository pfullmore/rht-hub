import { useState, useEffect, useCallback, useRef } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const CMS_NOFO_URL  = "https://apply07.grants.gov/apply/opportunities/instructions/PKG00291485-instructions.pdf";
const GRANTS_GOV    = "https://grants.gov/search-results-detail/360442";
const NRHA_TRACKER  = "https://www.ruralhealth.us/programs/center-for-rural-health-innovation-and-system-redesign/rural-health-transformation-program";
const RHIHUB_URL    = "https://www.ruralhealthinfo.org/resources/lists/rhtp";
const SHVS_URL      = "https://shvs.org/tracking-state-releases-of-rural-health-transformation-program-applications/";
const ALL_INITIATIVES = ["Technology Innovation","Workforce Development","Chronic Disease","Telehealth","Behavioral Health","Rural Hospital Support","Tribal Health","Value-Based Care","Prevention","FQHC / Community Health","Maternal & Doula","Facility Modernization"];

// ─── BASELINE STATE DATA (fallback if AI search unavailable) ─────────────────
const BASELINE_STATES = [
  { name:"Alabama",abbr:"AL",status:"active",agency:"Alabama Dept of Economic & Community Affairs",award:"~$100M",deadline:"Rolling — check ADECA portal",submission:"Email / Portal",portalUrl:"https://adeca.alabama.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Chronic Disease","Workforce Development","Technology Innovation"],notes:"Project narrative submitted. RFPs released on rolling basis.",contact:"alabama.rht@adeca.alabama.gov" },
  { name:"Alaska",abbr:"AK",status:"active",agency:"Alaska Dept of Health",award:"$272M",deadline:"2nd LOI window: late Summer 2026",submission:"Portal",portalUrl:"https://health.alaska.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Tribal Health","Workforce Development","Technology Innovation"],notes:"First LOI drew ~1,800 submissions. All funds obligated by December 31, 2026.",contact:"alaska.rht@alaska.gov" },
  { name:"Arizona",abbr:"AZ",status:"active",agency:"Arizona Health Care Cost Containment System (AHCCCS)",award:"~$100M",deadline:"Rolling — see AHCCCS procurement portal",submission:"Portal",portalUrl:"https://www.azahcccs.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Technology Innovation","Workforce Development","Chronic Disease"],notes:"Revised Budget & Project Narratives publicly available.",contact:"AHCCCSruralhealthtransformation@azahcccs.gov" },
  { name:"Arkansas",abbr:"AR",status:"active",agency:"Office of Governor Sarah Huckabee Sanders",award:"~$100M",deadline:"Rolling — see state RHTP webpage",submission:"Portal",portalUrl:"https://governor.arkansas.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Chronic Disease","Workforce Development","Telehealth"],notes:"Dedicated RHTP webpage launched March 2026.",contact:"See Arkansas RHTP webpage" },
  { name:"California",abbr:"CA",status:"active",agency:"Dept of Health Care Access & Information (HCAI)",award:"~$100M+",deadline:"See HCAI RHTP page for current windows",submission:"Portal",portalUrl:"https://hcai.ca.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Technology Innovation","Prevention","FQHC / Community Health"],notes:"Rural Health Policy Council formed.",contact:"RHTPInfo@hcai.ca.gov" },
  { name:"Colorado",abbr:"CO",status:"active",agency:"Colorado Dept of Health Care Policy & Financing",award:"~$100M",deadline:"Multiple RFPs expected mid-2026",submission:"Portal",portalUrl:"https://hcpf.colorado.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Value-Based Care"],notes:"New governance structures proposed. Hiring new staff.",contact:"See Colorado HCPF RHTP page" },
  { name:"Connecticut",abbr:"CT",status:"active",agency:"Connecticut Dept of Social Services",award:"$154M",deadline:"See CT DSS procurement portal",submission:"Portal",portalUrl:"https://portal.ct.gov/dss/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Rural Hospital Support","Technology Innovation","Workforce Development"],notes:"Governor Lamont announced $154M. Implementation underway.",contact:"See CT DSS RHTP page" },
  { name:"Delaware",abbr:"DE",status:"active",agency:"Delaware Health and Social Services",award:"~$100M",deadline:"Initial RFPs open now — Q3 2026 deadlines",submission:"Portal",portalUrl:"https://dhss.delaware.gov/dhss/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["FQHC / Community Health","Value-Based Care","Technology Innovation"],notes:"One of the first states to open RFPs.",contact:"See Delaware DHSS RHTP page" },
  { name:"Florida",abbr:"FL",status:"active",agency:"Florida Agency for Health Care Administration (AHCA)",award:"~$100M+",deadline:"Rolling via MyFloridaMarketPlace — active now",submission:"Portal",portalUrl:"https://ahca.myflorida.com/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Chronic Disease","Telehealth","Workforce Development","Rural Hospital Support"],notes:"Full application publicly available.",contact:"See Florida AHCA RHTP page" },
  { name:"Georgia",abbr:"GA",status:"active",agency:"Georgia Dept of Community Health",award:"~$100M",deadline:"See DCH procurement portal",submission:"Portal",portalUrl:"https://dch.georgia.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Rural Hospital Support","Technology Innovation","Chronic Disease"],notes:"Known as GREAT Health Program. CMS approved amended budget March 2026.",contact:"See Georgia DCH RHTP page" },
  { name:"Hawaii",abbr:"HI",status:"pending",agency:"Hawaii Dept of Human Services",award:"~$100M",anticipatedRelease:"Q3–Q4 2026",initiatives:["Telehealth","Workforce Development","Rural Hospital Support"],notes:"Award confirmed Dec 2025. No RFPs released yet.",contact:"See Hawaii DHS" },
  { name:"Idaho",abbr:"ID",status:"pending",agency:"Idaho Dept of Health & Welfare",award:"~$100M",anticipatedRelease:"Q3–Q4 2026",initiatives:["Rural Hospital Support","Workforce Development","Technology Innovation"],notes:"Award confirmed. No RFPs released yet.",contact:"See Idaho DHW" },
  { name:"Illinois",abbr:"IL",status:"active",agency:"Illinois Dept of Healthcare & Family Services",award:"~$100M+",deadline:"See Illinois Procurement Bulletin",submission:"Portal",portalUrl:"https://www.hfs.illinois.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Chronic Disease","Prevention"],notes:"RFPs posted on Illinois Procurement Bulletin.",contact:"See Illinois HFS RHTP page" },
  { name:"Indiana",abbr:"IN",status:"active",agency:"Indiana Family & Social Services Administration",award:"~$100M",deadline:"GROW Grants: rolling — Q3 2026 closes",submission:"Portal",portalUrl:"https://www.in.gov/fssa/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["FQHC / Community Health","Workforce Development","Technology Innovation"],notes:"GROW (Growing Rural Opportunities for Well-being) Grants open since March 2026.",contact:"See Indiana FSSA RHTP page" },
  { name:"Iowa",abbr:"IA",status:"pending",agency:"Iowa Dept of Health & Human Services",award:"~$100M",anticipatedRelease:"Mid-2026",initiatives:["Rural Hospital Support","Workforce Development","Chronic Disease"],notes:"Award confirmed. No RFPs released yet.",contact:"See Iowa HHS" },
  { name:"Kansas",abbr:"KS",status:"active",agency:"Kansas Dept of Health & Environment",award:"~$100M",deadline:"Rolling via KDHE",submission:"Portal",portalUrl:"https://www.kdhe.ks.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Prevention","Technology Innovation"],notes:"Application, approved program docs, and webinar recordings available.",contact:"See Kansas KDHE RHTP page" },
  { name:"Kentucky",abbr:"KY",status:"active",agency:"Kentucky Cabinet for Health & Family Services",award:"~$100M",deadline:"See CHFS procurement portal",submission:"Portal / Email",portalUrl:"https://chfs.ky.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Rural Hospital Support","Prevention"],notes:"Project Narrative and Supporting Documentation publicly available.",contact:"See Kentucky CHFS RHTP page" },
  { name:"Louisiana",abbr:"LA",status:"pending",agency:"Louisiana Dept of Health",award:"~$100M",anticipatedRelease:"Q3–Q4 2026",initiatives:["Workforce Development","Chronic Disease","Rural Hospital Support"],notes:"Award confirmed. No RFPs released yet.",contact:"See Louisiana DOH" },
  { name:"Maine",abbr:"ME",status:"active",agency:"Maine Dept of Health & Human Services",award:"~$100M",deadline:"Community RFPs expected Q3 2026",submission:"Portal",portalUrl:"https://www.maine.gov/dhhs/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","FQHC / Community Health","Prevention"],notes:"Community webinars ongoing. Formal RFPs expected Q3 2026.",contact:"See Maine DHHS RHTP page" },
  { name:"Maryland",abbr:"MD",status:"active",agency:"Maryland Dept of Health",award:"~$100M",deadline:"See eMarylandMarketplace",submission:"Portal",portalUrl:"https://procurement.maryland.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Rural Hospital Support","Prevention"],notes:"Hiring RHTP Administrator. RFPs posted via eMarylandMarketplace.",contact:"See Maryland DOH RHTP page" },
  { name:"Massachusetts",abbr:"MA",status:"pending",agency:"Massachusetts Executive Office of Health & Human Services",award:"~$100M",anticipatedRelease:"Q3–Q4 2026",initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"],notes:"Award confirmed. No RFPs released yet.",contact:"See MA EOHHS" },
  { name:"Michigan",abbr:"MI",status:"active",agency:"Michigan Dept of Health & Human Services",award:"~$100M+",deadline:"See MDHHS procurement portal",submission:"Portal",portalUrl:"https://www.michigan.gov/mdhhs/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Technology Innovation","Workforce Development","Rural Hospital Support"],notes:"Advisory Council applications open.",contact:"See Michigan MDHHS RHTP page" },
  { name:"Minnesota",abbr:"MN",status:"pending",agency:"Minnesota Dept of Health",award:"~$100M",anticipatedRelease:"Mid-2026",initiatives:["Workforce Development","Rural Hospital Support","Technology Innovation"],notes:"Award confirmed. No RFPs released yet.",contact:"See Minnesota MDH" },
  { name:"Mississippi",abbr:"MS",status:"pending",agency:"Mississippi Division of Medicaid",award:"~$100M",anticipatedRelease:"Q3–Q4 2026",initiatives:["Chronic Disease","Workforce Development","Rural Hospital Support"],notes:"Award confirmed. No RFPs released yet.",contact:"See Mississippi Division of Medicaid" },
  { name:"Missouri",abbr:"MO",status:"active",agency:"Missouri Dept of Social Services",award:"~$100M",deadline:"Multiple RFPs/RFIs rolling Q1–Q3 2026",submission:"Portal",portalUrl:"https://dss.mo.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Technology Innovation","Workforce Development","Value-Based Care"],notes:"Multi-wave timeline across Q1–Q3 2026.",contact:"See Missouri DSS RHTP page" },
  { name:"Montana",abbr:"MT",status:"active",agency:"Montana Dept of Public Health & Human Services",award:"~$100M",deadline:"See MT procurement portal",submission:"Portal",portalUrl:"https://dphhs.mt.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Facility Modernization","Technology Innovation","FQHC / Community Health"],notes:"Funding critical facility repairs and modernization.",contact:"See Montana DPHHS RHTP page" },
  { name:"Nebraska",abbr:"NE",status:"active",agency:"Nebraska Dept of Health & Human Services",award:"~$100M",deadline:"Open now — rolling since March 2026",submission:"Portal",portalUrl:"https://dhhs.ne.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Chronic Disease","Telehealth"],notes:"Soliciting applications as of March 2026.",contact:"See Nebraska DHHS RHTP page" },
  { name:"Nevada",abbr:"NV",status:"active",agency:"Nevada Dept of Health & Human Services",award:"~$100M",deadline:"RHIT Grant awards: September 2026",submission:"Portal",portalUrl:"https://dhhs.nv.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Technology Innovation","Telehealth","Workforce Development"],notes:"RHIT Grant RFP released May 2026. Awards September 2026.",contact:"See Nevada DHHS RHTP page" },
  { name:"New Hampshire",abbr:"NH",status:"pending",agency:"NH Dept of Health & Human Services",award:"~$100M",anticipatedRelease:"Q3–Q4 2026",initiatives:["Workforce Development","Rural Hospital Support","Telehealth"],notes:"Award confirmed. No RFPs released yet.",contact:"See NH DHHS" },
  { name:"New Jersey",abbr:"NJ",status:"active",agency:"New Jersey Dept of Health",award:"~$100M",deadline:"Next round expected Q3 2026",submission:"Portal",portalUrl:"https://www.nj.gov/health/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Technology Innovation","Prevention","Workforce Development"],notes:"1st RFA closed Jan 20, 2026. Next round expected Q3 2026.",contact:"See NJ DOH RHTP page" },
  { name:"New Mexico",abbr:"NM",status:"active",agency:"New Mexico Health Care Authority",award:"~$100M",deadline:"See NMHCA portal",submission:"Portal",portalUrl:"https://www.hca.nm.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["FQHC / Community Health","Technology Innovation","Tribal Health"],notes:"Application and stakeholder engagement materials publicly available.",contact:"See New Mexico Health Care Authority RHTP page" },
  { name:"New York",abbr:"NY",status:"active",agency:"New York State Dept of Health",award:"~$100M+",deadline:"See NYS Grants Gateway",submission:"Portal",portalUrl:"https://grantsgateway.ny.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Telehealth","Rural Hospital Support"],notes:"RFPs posted on NYS Grants Gateway.",contact:"See NY DOH RHTP page" },
  { name:"North Carolina",abbr:"NC",status:"active",agency:"NC Dept of Health & Human Services",award:"$213M",deadline:"Rolling — legislative report due November 29, 2026",submission:"Portal",portalUrl:"https://ncdhhs.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Behavioral Health","Rural Hospital Support"],notes:"RHTP codified in state law (H696, April 30, 2026). ~$1B+ total.",contact:"See NC DHHS RHTP page" },
  { name:"North Dakota",abbr:"ND",status:"active",agency:"North Dakota Dept of Health & Human Services",award:"~$100M",deadline:"4 active RFPs — Q3 2026 deadlines",submission:"Portal / Email",portalUrl:"https://www.hhs.nd.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"],notes:"4 RFPs released May 2026.",contact:"See North Dakota HHS RHTP page" },
  { name:"Ohio",abbr:"OH",status:"active",agency:"Ohio Dept of Medicaid",award:"~$100M+",deadline:"Open now — rolling since March 2026",submission:"Portal",portalUrl:"https://medicaid.ohio.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Chronic Disease"],notes:"Soliciting applications as of March 2026.",contact:"See Ohio DOH/ODM RHTP page" },
  { name:"Oklahoma",abbr:"OK",status:"active",agency:"Oklahoma Health Care Authority",award:"~$100M",deadline:"Open now — rolling since March 2026",submission:"Portal",portalUrl:"https://okhca.org/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Rural Hospital Support","Technology Innovation"],notes:"Soliciting applications as of March 2026.",contact:"See Oklahoma HCA RHTP page" },
  { name:"Oregon",abbr:"OR",status:"pending",agency:"Oregon Health Authority",award:"~$100M",anticipatedRelease:"Mid-2026",initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"],notes:"Award confirmed. No RFPs released yet.",contact:"See Oregon Health Authority" },
  { name:"Pennsylvania",abbr:"PA",status:"active",agency:"PA Dept of Human Services",award:"~$100M+",deadline:"See PA eMarketplace",submission:"Portal",portalUrl:"https://www.dhs.pa.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Chronic Disease"],notes:"RFPs posted on PA eMarketplace.",contact:"See PA DHS RHTP page" },
  { name:"Rhode Island",abbr:"RI",status:"pending",agency:"RI Executive Office of Health & Human Services",award:"~$100M",anticipatedRelease:"Q3–Q4 2026",initiatives:["Workforce Development","Telehealth","Rural Hospital Support"],notes:"Award confirmed. No RFPs released yet.",contact:"See RI EOHHS" },
  { name:"South Carolina",abbr:"SC",status:"active",agency:"SC Dept of Health & Human Services",award:"~$100M",deadline:"Active RFPs open now — scoring rubric published May 2026",submission:"Portal",portalUrl:"https://www.scdhhs.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"],notes:"Multiple RFPs active. Scoring rubric published May 2026.",contact:"See SC DHHS RHTP page" },
  { name:"South Dakota",abbr:"SD",status:"active",agency:"SD Dept of Health (ORHES)",award:"~$100M",deadline:"RFP #26-09RHT-022 open now; 2nd round open now",submission:"Portal",portalUrl:"https://doh.sd.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Maternal & Doula"],notes:"Round 1: workforce/PM up to $500K. Round 2: digital health, doula, caregiver.",contact:"See South Dakota DOH RHTP page" },
  { name:"Tennessee",abbr:"TN",status:"active",agency:"TN Dept of Health",award:"~$100M",deadline:"New opportunities posted — Q3 2026 windows active",submission:"Portal",portalUrl:"https://www.tn.gov/health/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Chronic Disease"],notes:"TDH information session March 2026. New funding opportunities active.",contact:"See Tennessee DOH RHTP page" },
  { name:"Texas",abbr:"TX",status:"active",agency:"Texas Health & Human Services Commission",award:"~$100M+",deadline:"See HHSC procurement portal",submission:"Portal",portalUrl:"https://www.hhs.texas.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Rural Hospital Support","Technology Innovation"],notes:"Largest rural population. RFPs on HHSC portal.",contact:"See Texas HHSC RHTP page" },
  { name:"Utah",abbr:"UT",status:"active",agency:"Utah Dept of Health & Human Services",award:"~$500M (5yr)",deadline:"Legislature approved — active RFPs on DHHS portal",submission:"Portal",portalUrl:"https://dhhs.utah.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Technology Innovation","Workforce Development","Value-Based Care"],notes:"Expected $500M over 5 years. Legislature approved early 2026.",contact:"Pam Bennett / Sarah Woolsey / Marc Watterson — Utah DHHS" },
  { name:"Vermont",abbr:"VT",status:"active",agency:"Vermont Agency of Human Services",award:"~$100M",deadline:"14-month initial contracts — see AHS portal",submission:"Portal",portalUrl:"https://ahs.vermont.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Value-Based Care","Technology Innovation"],notes:"14-month initial project; 5-year program.",contact:"See Vermont AHS RHTP page" },
  { name:"Virginia",abbr:"VA",status:"active",agency:"Virginia Dept of Medical Assistance Services",award:"~$100M",deadline:"See eVA procurement portal",submission:"Portal",portalUrl:"https://eva.virginia.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"],notes:"Hiring new staff. RFPs on eVA portal.",contact:"See Virginia DMAS RHTP page" },
  { name:"Washington",abbr:"WA",status:"active",agency:"WA Health Care Authority (HCA)",award:"$181M",deadline:"Active RFPs on WEBS now — registration required",submission:"Portal (WEBS)",portalUrl:"https://fortress.wa.gov/ga/webs",rfpUrl:"https://www.hca.wa.gov/about-hca/programs-and-initiatives/value-based-purchasing/rural-health-transformation-program",nofoUrl:CMS_NOFO_URL,timelineUrl:"https://www.hca.wa.gov/about-hca/programs-and-initiatives/value-based-purchasing/rural-health-transformation-program",initiatives:["Rural Hospital Support","FQHC / Community Health","Tribal Health","Workforce Development"],notes:"Must register at WEBS to bid. 6 key initiatives.",contact:"See WA HCA RHTP page" },
  { name:"West Virginia",abbr:"WV",status:"active",agency:"WV Dept of Health & Human Resources",award:"$199M",deadline:"Active RFPs on DHHR portal now",submission:"Portal",portalUrl:"https://dhhr.wv.gov/rhtp",rfpUrl:RHIHUB_URL,nofoUrl:CMS_NOFO_URL,timelineUrl:RHIHUB_URL,initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"],notes:"Legislature approved $199M. Hiring underway.",contact:"See WV DHHR RHTP page" },
  { name:"Wisconsin",abbr:"WI",status:"pending",agency:"Wisconsin Dept of Health Services",award:"~$100M",anticipatedRelease:"Mid-2026",initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"],notes:"Award confirmed. No RFPs released yet.",contact:"See Wisconsin DHS" },
  { name:"Wyoming",abbr:"WY",status:"pending",agency:"Wyoming Dept of Health",award:"~$100M",anticipatedRelease:"Q3–Q4 2026",initiatives:["Workforce Development","Rural Hospital Support","Technology Innovation"],notes:"Award confirmed. No RFPs released yet.",contact:"See Wyoming DOH" },
];

const BASELINE_DEADLINES = [
  { abbr:"SD", name:"South Dakota", specificDate:"Open now (Round 1 & 2 active)", nextDue:"Q3 2026 — exact close on SD DOH portal", award:"~$100M", submission:"Portal", portalUrl:"https://doh.sd.gov/rhtp", urgency:"open" },
  { abbr:"IN", name:"Indiana", specificDate:"Open now — GROW Grants rolling since March 2026", nextDue:"Q3 2026 — rolling closes", award:"~$100M", submission:"Portal", portalUrl:"https://www.in.gov/fssa/rhtp", urgency:"open" },
  { abbr:"OH", name:"Ohio", specificDate:"Open now — rolling since March 2026", nextDue:"Q3 2026 — rolling closes", award:"~$100M+", submission:"Portal", portalUrl:"https://medicaid.ohio.gov/rhtp", urgency:"open" },
  { abbr:"OK", name:"Oklahoma", specificDate:"Open now — rolling since March 2026", nextDue:"Q3 2026 — rolling closes", award:"~$100M", submission:"Portal", portalUrl:"https://okhca.org/rhtp", urgency:"open" },
  { abbr:"NE", name:"Nebraska", specificDate:"Open now — rolling since March 2026", nextDue:"Q3 2026 — rolling closes", award:"~$100M", submission:"Portal", portalUrl:"https://dhhs.ne.gov/rhtp", urgency:"open" },
  { abbr:"WA", name:"Washington", specificDate:"Active RFPs on WEBS now", nextDue:"Varies per RFP — check WEBS portal", award:"$181M", submission:"Portal (WEBS)", portalUrl:"https://fortress.wa.gov/ga/webs", urgency:"open" },
  { abbr:"SC", name:"South Carolina", specificDate:"Active — scoring rubric published May 2026", nextDue:"Q3 2026 — check SCDHHS portal", award:"~$100M", submission:"Portal", portalUrl:"https://www.scdhhs.gov/rhtp", urgency:"open" },
  { abbr:"ND", name:"North Dakota", specificDate:"4 RFPs released May 2026", nextDue:"Q3 2026 — check ND HHS portal", award:"~$100M", submission:"Portal/Email", portalUrl:"https://www.hhs.nd.gov/rhtp", urgency:"open" },
  { abbr:"DE", name:"Delaware", specificDate:"Initial RFPs open now", nextDue:"Q3 2026 — see state e-procurement portal", award:"~$100M", submission:"Portal", portalUrl:"https://dhss.delaware.gov/dhss/rhtp", urgency:"open" },
  { abbr:"MO", name:"Missouri", specificDate:"Multiple waves rolling Q1–Q3 2026", nextDue:"Q3 2026 — next wave closes", award:"~$100M", submission:"Portal", portalUrl:"https://dss.mo.gov/rhtp", urgency:"open" },
  { abbr:"WV", name:"West Virginia", specificDate:"Active RFPs on DHHR portal", nextDue:"Check DHHR portal for specific close dates", award:"$199M", submission:"Portal", portalUrl:"https://dhhr.wv.gov/rhtp", urgency:"open" },
  { abbr:"NC", name:"North Carolina", specificDate:"Rolling — active RFPs now", nextDue:"Legislative report due: November 29, 2026", award:"$213M", submission:"Portal", portalUrl:"https://ncdhhs.gov/rhtp", urgency:"open" },
  { abbr:"NV", name:"Nevada", specificDate:"RHIT Grant RFP released May 2026", nextDue:"Awards: September 2026", award:"~$100M", submission:"Portal", portalUrl:"https://dhhs.nv.gov/rhtp", urgency:"upcoming" },
  { abbr:"AK", name:"Alaska", specificDate:"2nd LOI window: late Summer 2026", nextDue:"Late Summer 2026 — all funds obligated by Dec 31, 2026", award:"$272M", submission:"Portal", portalUrl:"https://health.alaska.gov/rhtp", urgency:"upcoming" },
  { abbr:"NJ", name:"New Jersey", specificDate:"1st RFA closed: January 20, 2026", nextDue:"Next round expected Q3 2026", award:"~$100M", submission:"Portal", portalUrl:"https://www.nj.gov/health/rhtp", urgency:"watch" },
  { abbr:"HI", name:"Hawaii", specificDate:"Not yet released", nextDue:"Estimated Q3–Q4 2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"ID", name:"Idaho", specificDate:"Not yet released", nextDue:"Estimated Q3–Q4 2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"IA", name:"Iowa", specificDate:"Not yet released", nextDue:"Estimated Mid-2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"LA", name:"Louisiana", specificDate:"Not yet released", nextDue:"Estimated Q3–Q4 2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"MA", name:"Massachusetts", specificDate:"Not yet released", nextDue:"Estimated Q3–Q4 2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"MN", name:"Minnesota", specificDate:"Not yet released", nextDue:"Estimated Mid-2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"MS", name:"Mississippi", specificDate:"Not yet released", nextDue:"Estimated Q3–Q4 2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"NH", name:"New Hampshire", specificDate:"Not yet released", nextDue:"Estimated Q3–Q4 2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"OR", name:"Oregon", specificDate:"Not yet released", nextDue:"Estimated Mid-2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"RI", name:"Rhode Island", specificDate:"Not yet released", nextDue:"Estimated Q3–Q4 2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"WI", name:"Wisconsin", specificDate:"Not yet released", nextDue:"Estimated Mid-2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
  { abbr:"WY", name:"Wyoming", specificDate:"Not yet released", nextDue:"Estimated Q3–Q4 2026", award:"~$100M", submission:"TBD", portalUrl:null, urgency:"pending" },
];

const BASELINE_RFPS = [
  { state:"South Dakota",abbr:"SD",rfp:"RFP #26-09RHT-022 — Workforce Stakeholder & PM",status:"Open now",award:"Up to $500K (Year 1, renewable)",initiatives:["Workforce Development","Technology Innovation"],andorFit:"Moderate",psynergyFit:"Strong",andorNote:"ThinkAndor® can serve as the technology backbone for workflow and stakeholder communication tools.",psynergyNote:"Direct fit: Psynergy's virtual clinical workforce and staffing expertise matches workforce planning and program administration requirements.",portalUrl:"https://doh.sd.gov/rhtp" },
  { state:"South Dakota",abbr:"SD",rfp:"Round 2 — Digital Health, Doula Workforce, Caregiver Support",status:"Open now",award:"~$100M pool",initiatives:["Technology Innovation","Maternal & Doula","Workforce Development"],andorFit:"Strong",psynergyFit:"Strong",andorNote:"ThinkAndor®'s ambient AI and virtual care infrastructure is a direct fit for digital health modernization.",psynergyNote:"Psynergy's virtual clinical staffing supports doula and caregiver coordination.",portalUrl:"https://doh.sd.gov/rhtp" },
  { state:"Nevada",abbr:"NV",rfp:"Rural Health Innovation & Technology (RHIT) Grant",status:"Open now — Awards September 2026",award:"~$100M pool",initiatives:["Technology Innovation","Telehealth","Workforce Development"],andorFit:"Strong",psynergyFit:"Strong",andorNote:"ThinkAndor® is purpose-built for the RHIT criteria: AI, remote monitoring, rural telehealth, and tech-enabled care.",psynergyNote:"Psynergy's virtual workforce and AI-enabled triage directly address rural technology and workforce capacity.",portalUrl:"https://dhhs.nv.gov/rhtp" },
  { state:"Indiana",abbr:"IN",rfp:"GROW Regional Grants — Growing Rural Opportunities for Well-being",status:"Open now — rolling",award:"~$100M pool",initiatives:["FQHC / Community Health","Workforce Development","Technology Innovation"],andorFit:"Moderate",psynergyFit:"Strong",andorNote:"Andor's virtual nursing and ambient documentation tools can be embedded in GROW regional health initiatives.",psynergyNote:"GROW's regional workforce and community health focus maps directly to Psynergy's virtual staffing platform.",portalUrl:"https://www.in.gov/fssa/rhtp" },
  { state:"North Carolina",abbr:"NC",rfp:"Rural Health Innovation Fund — multiple initiative RFPs",status:"Open now — rolling",award:"$213M Year 1 / ~$1B+ total",initiatives:["Workforce Development","Technology Innovation","Behavioral Health","Rural Hospital Support"],andorFit:"Strong",psynergyFit:"Strong",andorNote:"NC's Rural Innovation Fund prioritizes behavioral health access and technology — ThinkAndor® virtual consultation routing applies directly.",psynergyNote:"NC codified behavioral health access as a key RHTP pillar. Psynergy's virtual behavioral health staffing addresses these gaps.",portalUrl:"https://ncdhhs.gov/rhtp" },
  { state:"Washington",abbr:"WA",rfp:"Multiple RFPs via WEBS — Hospital Innovation, Tribal Health, Disease Prevention",status:"Active now on WEBS",award:"$181M Year 1",initiatives:["Rural Hospital Support","FQHC / Community Health","Tribal Health","Workforce Development"],andorFit:"Strong",psynergyFit:"Strong",andorNote:"WA's hospital innovation and technology initiatives align directly with ThinkAndor®'s deployed capabilities.",psynergyNote:"WA's Tribal health and workforce initiatives are a natural fit for Psynergy's flexible virtual staffing.",portalUrl:"https://fortress.wa.gov/ga/webs" },
  { state:"West Virginia",abbr:"WV",rfp:"Multiple RFPs — Workforce, Technology, Rural Hospital Support",status:"Active now",award:"$199M",initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"],andorFit:"Strong",psynergyFit:"Strong",andorNote:"WV's rural Appalachian network faces extreme staffing shortfalls — ThinkAndor® virtual nursing is purpose-built for this. Ballad Health (WV/TN) already deployed.",psynergyNote:"WV is among the most acute rural workforce shortage states. Psynergy's virtual physician/APP model directly addresses WV's clinical capacity gaps.",portalUrl:"https://dhhr.wv.gov/rhtp" },
  { state:"Alaska",abbr:"AK",rfp:"2nd LOI Window — Tribal & Rural Health, Workforce, Remote Care",status:"Late Summer 2026",award:"$272M Year 1 / ~$1.36B total",initiatives:["Tribal Health","Workforce Development","Technology Innovation"],andorFit:"Strong",psynergyFit:"Strong",andorNote:"AK's geographic challenge makes virtual care essential — ThinkAndor®'s remote monitoring and virtual rounding are critical for Alaska Native and rural hospitals.",psynergyNote:"Alaska's rural-frontier-tribal care gaps are the exact use case Psynergy was built for.",portalUrl:"https://health.alaska.gov/rhtp" },
  { state:"Ohio",abbr:"OH",rfp:"Multiple initiative RFPs — Workforce, Technology, Chronic Disease",status:"Open now — rolling",award:"~$100M+",initiatives:["Workforce Development","Technology Innovation","Chronic Disease"],andorFit:"Strong",psynergyFit:"Strong",andorNote:"Ohio's chronic disease and technology priorities align with ThinkAndor®'s remote monitoring and predictive analytics.",psynergyNote:"Ohio's workforce and chronic disease initiatives benefit from Psynergy's virtual clinical team model.",portalUrl:"https://medicaid.ohio.gov/rhtp" },
  { state:"New Jersey",abbr:"NJ",rfp:"RHTP 2026: Technology, Prevention & Workforce Capacity RFA",status:"Next round Q3 2026",award:"~$100M",initiatives:["Technology Innovation","Prevention","Workforce Development"],andorFit:"Strong",psynergyFit:"Moderate",andorNote:"NJ's explicit 'Advancing Technology' focus directly matches ThinkAndor®. NJ also published a Vendor Resource Directory — Andor should seek listing.",psynergyNote:"NJ's workforce capacity track is a fit, though NJ has less extreme rural workforce shortages than other states.",portalUrl:"https://www.nj.gov/health/rhtp" },
];

// ─── AI SEARCH HELPER ─────────────────────────────────────────────────────────
async function aiSearch(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const text = data.content.map(b => b.text || "").filter(Boolean).join("\n");
  return text.replace(/```json|```/g, "").trim();
}

// ─── CACHE HELPERS ────────────────────────────────────────────────────────────
const CACHE_TTL = 4 * 60 * 60 * 1000; // 4 hours
function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) { sessionStorage.removeItem(key); return null; }
    return data;
  } catch { return null; }
}
function cacheSet(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch {}
}

// ─── SMALL UI ATOMS ──────────────────────────────────────────────────────────
const S = {
  pill: (color, bg, children, icon) => (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:bg, color, whiteSpace:"nowrap" }}>
      {icon && <i className={`ti ${icon}`} style={{ fontSize:11 }} aria-hidden="true" />}{children}
    </span>
  ),
  badge: (url, label) => {
    if (!url) return <span style={{ fontSize:11, color:"#9ca3af" }}>TBD</span>;
    const isEmail = url.startsWith("mailto:");
    return (
      <a href={url} target={isEmail ? undefined : "_blank"} rel="noopener noreferrer" onClick={e => e.stopPropagation()}
        style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:"#dbeafe", color:"#1e40af", textDecoration:"none", whiteSpace:"nowrap" }}>
        <i className={`ti ${isEmail ? "ti-mail" : "ti-browser"}`} style={{ fontSize:11 }} aria-hidden="true" />
        {label || (isEmail ? "Email to apply" : "Open portal")}
        <i className="ti ti-arrow-up-right" style={{ fontSize:10 }} aria-hidden="true" />
      </a>
    );
  },
};

const fitColor = { Strong:"#16a34a", Moderate:"#d97706", Limited:"#9ca3af" };
const fitBg    = { Strong:"#dcfce7", Moderate:"#fef3c7", Limited:"#f3f4f6" };

// ─── DATA REFRESH CONTEXT ────────────────────────────────────────────────────
function useDataStore() {
  const [states, setStates]     = useState(BASELINE_STATES);
  const [deadlines, setDeadlines] = useState(BASELINE_DEADLINES);
  const [rfps, setRfps]         = useState(BASELINE_RFPS);
  const [refreshStatus, setRefreshStatus] = useState({ loading:false, lastRefreshed:null, log:[] });

  const addLog = (msg, type="info") =>
    setRefreshStatus(s => ({ ...s, log: [{ msg, type, ts: new Date().toLocaleTimeString() }, ...s.log.slice(0,19)] }));

  const refreshStates = useCallback(async (force=false) => {
    const cKey = "rht_states_v2";
    if (!force) { const c = cacheGet(cKey); if (c) { setStates(c); return; } }
    addLog("Searching for latest state RHTP status…", "info");
    try {
      const raw = await aiSearch(
        `Search the web right now for the latest Rural Health Transformation Program (RHTP) status for ALL 50 US states as of today. For each state find: current RFP status (active/pending), the most recent known deadline or anticipated release date, any new RFPs released in the last 60 days, and any notable notes. Return ONLY a valid JSON array of up to 50 objects, one per state, with fields: { "abbr":"2-letter code", "status":"active|pending", "deadline":"exact deadline text or null", "anticipatedRelease":"text or null", "notes":"latest update in 1-2 sentences", "award":"funding amount if known" }. Only include states where you found updated information. Raw JSON array only, no markdown.`
      );
      const updates = JSON.parse(raw);
      if (Array.isArray(updates) && updates.length > 0) {
        setStates(prev => {
          const map = Object.fromEntries(updates.map(u => [u.abbr, u]));
          const merged = prev.map(s => {
            const u = map[s.abbr];
            if (!u) return s;
            return {
              ...s,
              status: u.status || s.status,
              deadline: u.deadline || s.deadline,
              anticipatedRelease: u.anticipatedRelease || s.anticipatedRelease,
              notes: u.notes ? u.notes : s.notes,
              award: u.award || s.award,
            };
          });
          cacheSet(cKey, merged);
          return merged;
        });
        addLog(`Updated ${updates.length} state records from live search.`, "success");
      }
    } catch(e) { addLog("State refresh failed — using cached data.", "warn"); }
  }, []);

  const refreshDeadlines = useCallback(async (force=false) => {
    const cKey = "rht_deadlines_v2";
    if (!force) { const c = cacheGet(cKey); if (c) { setDeadlines(c); return; } }
    addLog("Searching for latest RHTP deadlines…", "info");
    try {
      const raw = await aiSearch(
        `Search the web right now for the most current Rural Health Transformation Program (RHTP) RFP deadlines and due dates across all US states. Find the exact due dates (not just months) wherever possible. Return ONLY a valid JSON array with objects: { "abbr":"2-letter state", "name":"state name", "specificDate":"current status text", "nextDue":"exact next due date like 'July 15, 2026' or best estimate", "award":"funding amount", "submission":"Portal|Email|TBD", "portalUrl":"URL or null", "urgency":"open|upcoming|watch|pending" }. Raw JSON array only, no markdown.`
      );
      const updates = JSON.parse(raw);
      if (Array.isArray(updates) && updates.length > 0) {
        setDeadlines(prev => {
          const map = Object.fromEntries(updates.map(u => [u.abbr, u]));
          const merged = prev.map(d => ({ ...d, ...(map[d.abbr] || {}) }));
          const newEntries = updates.filter(u => !prev.find(d => d.abbr===u.abbr));
          const result = [...merged, ...newEntries];
          cacheSet(cKey, result);
          return result;
        });
        addLog(`Updated ${updates.length} deadline records.`, "success");
      }
    } catch(e) { addLog("Deadline refresh failed — using cached data.", "warn"); }
  }, []);

  const refreshRfps = useCallback(async (force=false) => {
    const cKey = "rht_rfps_v2";
    if (!force) { const c = cacheGet(cKey); if (c) { setRfps(c); return; } }
    addLog("Searching for latest open RHTP RFPs…", "info");
    try {
      const raw = await aiSearch(
        `Search the web right now for all currently open Rural Health Transformation Program (RHTP) RFPs and grant opportunities across all US states as of today. Look for any new RFPs released in the past 90 days. For each opportunity found return a JSON object: { "state":"state name", "abbr":"2-letter code", "rfp":"RFP name/number", "status":"Open now|Upcoming|Closed", "award":"amount", "initiatives":["list"], "andorFit":"Strong|Moderate|Limited", "psynergyFit":"Strong|Moderate|Limited", "andorNote":"1 sentence on Andor Health ThinkAndor AI platform fit", "psynergyNote":"1 sentence on Psynergy Health virtual clinical workforce fit", "portalUrl":"URL" }. Return ONLY a valid JSON array of all opportunities found. Raw JSON only, no markdown.`
      );
      const updates = JSON.parse(raw);
      if (Array.isArray(updates) && updates.length > 0) {
        const merged = [...BASELINE_RFPS];
        updates.forEach(u => {
          const idx = merged.findIndex(r => r.abbr===u.abbr && r.rfp===u.rfp);
          if (idx >= 0) merged[idx] = { ...merged[idx], ...u };
          else merged.push(u);
        });
        cacheSet(cKey, merged);
        setRfps(merged);
        addLog(`Updated RFP list — ${merged.length} opportunities.`, "success");
      }
    } catch(e) { addLog("RFP refresh failed — using cached data.", "warn"); }
  }, []);

  const refreshAll = useCallback(async (force=false) => {
    setRefreshStatus(s => ({ ...s, loading:true }));
    await Promise.all([refreshStates(force), refreshDeadlines(force), refreshRfps(force)]);
    setRefreshStatus(s => ({ ...s, loading:false, lastRefreshed: new Date().toLocaleString() }));
  }, [refreshStates, refreshDeadlines, refreshRfps]);

  // Auto-refresh on mount (use cache if fresh)
  useEffect(() => { refreshAll(false); }, []);

  return { states, deadlines, rfps, refreshAll, refreshStatus };
}

// ─── STATE CARD ───────────────────────────────────────────────────────────────
function StateCard({ s, onClick }) {
  return (
    <button onClick={() => onClick(s)}
      style={{ width:"100%", textAlign:"left", cursor:"pointer", background:"#fff", border:"2px solid #d1d5db", borderRadius:10, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, transition:"all 0.15s", boxShadow:"0 1px 3px rgba(0,0,0,0.07)" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor="#3b82f6"; e.currentTarget.style.boxShadow="0 2px 8px rgba(59,130,246,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor="#d1d5db"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.07)"; }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div>
          <p style={{ margin:0, fontWeight:700, fontSize:15, color:"#111827" }}>{s.name}</p>
          <p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280", fontWeight:600 }}>{s.abbr}</p>
        </div>
        {s.status==="active"
          ? S.pill("#065f46","#dcfce7","Active","ti-circle-check")
          : S.pill("#92400e","#fef3c7","Pending","ti-clock")}
      </div>
      <div style={{ borderTop:"1.5px solid #e5e7eb", paddingTop:10 }}>
        <p style={{ margin:"0 0 4px", fontSize:12, color:"#374151" }}>{s.agency}</p>
        <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#111827" }}>{s.award}</p>
      </div>
      <div style={{ borderTop:"1.5px solid #e5e7eb", paddingTop:8, display:"flex", flexDirection:"column", gap:6 }}>
        {s.status==="active" ? (
          <>
            {S.badge(s.portalUrl, null)}
            <p style={{ margin:0, fontSize:11, color:"#6b7280" }}><i className="ti ti-calendar" style={{ fontSize:11, marginRight:3 }} />{s.deadline?.length>42?s.deadline.slice(0,42)+"…":s.deadline}</p>
          </>
        ) : (
          <p style={{ margin:0, fontSize:12, color:"#92400e", fontWeight:500 }}><i className="ti ti-calendar" style={{ fontSize:12, marginRight:4 }} />Est. release: {s.anticipatedRelease}</p>
        )}
        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
          {(s.initiatives||[]).slice(0,2).map(i => <span key={i} style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:"#f3f4f6", color:"#374151", border:"1px solid #d1d5db", fontWeight:500 }}>{i}</span>)}
        </div>
      </div>
    </button>
  );
}

// ─── STATE OVERLAY ────────────────────────────────────────────────────────────
function Overlay({ s, onClose, onStateUpdate }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUpdate, setAiUpdate]   = useState(null);
  const [aiError, setAiError]     = useState(null);

  async function fetchLive() {
    setAiLoading(true); setAiError(null); setAiUpdate(null);
    try {
      const raw = await aiSearch(
        `Search the web right now for the latest Rural Health Transformation Program (RHTP) news for ${s.name} state. Agency: ${s.agency}. Find any new RFPs, exact deadlines, new funding, portal or submission changes in the past 60 days. Return ONLY valid JSON: { "latestNews":"1-2 sentence summary", "newRfps":["array or empty"], "deadlineUpdates":"exact date like 'July 15, 2026' or null", "submissionChanges":"text or null", "statusChange":"active|pending|null", "newNotes":"updated notes text or null", "exactDate":"Month DD, YYYY", "sourceUrl":"URL", "sourceTitle":"title" }. No markdown.`
      );
      const update = JSON.parse(raw);
      setAiUpdate(update);
      // Auto-apply updates back to global state
      if (update && (update.deadlineUpdates || update.statusChange || update.newNotes)) {
        onStateUpdate(s.abbr, {
          deadline: update.deadlineUpdates || s.deadline,
          status:   update.statusChange || s.status,
          notes:    update.newNotes || s.notes,
        });
      }
    } catch(e) { setAiError("Live search failed — please try again."); }
    setAiLoading(false);
  }

  const steps = [
    { n:1, icon:"ti-browser",   title:`Visit ${s.name}'s RHTP page`,         body:`Navigate to ${s.agency}'s RHTP webpage. All state-specific RFPs, NOFOs, timelines, and FAQs are posted there.${s.portalUrl ? ` Direct link: ${s.portalUrl}` : ""}` },
    { n:2, icon:"ti-download",  title:"Download all required documents",       body:`Collect: RFP/NOFO, state program timeline, budget narrative template, scoring rubric (if posted), and any Q&A addenda.` },
    { n:3, icon:"ti-checklist", title:`Confirm eligibility`,                   body:`${s.name} RFPs are typically open to healthcare providers, FQHCs, CBOs, tribal organizations${s.initiatives?.includes("Tribal Health")?" (specifically noted for this state)":""}, universities, and nonprofits.` },
    { n:4, icon:"ti-send",      title:`Submission: ${s.submission||"TBD"}`,    body:`${s.portalUrl ? `Submit at: ${s.portalUrl}. ${s.portalUrl.startsWith("mailto:") ? "Attach your application per the RFP spec and email." : "Register for the portal early — account setup can take several business days."}` : "Check the state RHTP page for submission instructions."}` },
    { n:5, icon:"ti-video",     title:`Attend ${s.name} webinars`,             body:`${s.name} hosts webinars before application deadlines covering scoring, eligible activities, and Q&A. Recordings are posted on ${s.agency}'s RHTP page.` },
    { n:6, icon:"ti-edit",      title:"Prepare your application",              body:`Required: project narrative tied to state goals (${(s.initiatives||[]).join(", ")}), budget narrative, org qualifications, letters of support, rural population data.` },
    { n:7, icon:"ti-clock",     title:"Meet deadlines",                        body:`${s.status==="active" ? `Current deadline: ${s.deadline}. Submit well before close — portal uploads can fail at the last minute.` : `Estimated release: ${s.anticipatedRelease}. Check ${s.portalUrl||"the state RHTP page"} weekly.`}` },
  ];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"1.5rem 1rem", overflowY:"auto", background:"rgba(0,0,0,0.75)" }} onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:14, border:"2px solid #e5e7eb", width:"100%", maxWidth:660, padding:"1.75rem", boxShadow:"0 25px 60px rgba(0,0,0,0.35)", marginBottom:"2rem" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#111827" }}>{s.name} <span style={{ fontSize:15, color:"#6b7280", fontWeight:500 }}>({s.abbr})</span></h2>
            <p style={{ margin:"4px 0 0", fontSize:13, color:"#6b7280" }}>{s.agency}</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background:"#111827", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", padding:"7px 14px", fontSize:13, fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
            <i className="ti ti-x" /> Close
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
          {[
            { label:"Award", val:s.award, icon:"ti-coin" },
            { label:"Status", val:s.status==="active"?"Active — RFPs released":"Pending", icon:"ti-info-circle" },
            { label:s.status==="active"?"Deadline":"Est. Release", val:s.deadline||s.anticipatedRelease||"TBD", icon:"ti-calendar" },
            { label:"Submission", val:s.submission||"TBD", icon:"ti-send" },
          ].map(({label,val,icon}) => (
            <div key={label} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:"10px 12px" }}>
              <p style={{ margin:0, fontSize:11, color:"#6b7280", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}><i className={`ti ${icon}`} style={{ fontSize:11, marginRight:4 }} />{label}</p>
              <p style={{ margin:"5px 0 0", fontSize:13, fontWeight:700, color:"#111827" }}>{val}</p>
            </div>
          ))}
        </div>

        {s.portalUrl && (
          <div style={{ marginBottom:14, padding:"12px 14px", background:"#eff6ff", border:"2px solid #3b82f6", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
            <div>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#1e40af" }}>{s.portalUrl.startsWith("mailto:")?"Apply via email":"Submit via portal"}</p>
              <p style={{ margin:0, fontSize:11, color:"#1e3a8a" }}>{s.portalUrl}</p>
            </div>
            <a href={s.portalUrl} target={s.portalUrl.startsWith("mailto:")?undefined:"_blank"} rel="noopener noreferrer"
              style={{ fontSize:13, padding:"8px 16px", background:"#2563eb", color:"#fff", borderRadius:7, textDecoration:"none", fontWeight:700, whiteSpace:"nowrap" }}>
              {s.portalUrl.startsWith("mailto:")?"Open email":"Open portal"} <i className="ti ti-arrow-up-right" style={{ fontSize:12 }} />
            </a>
          </div>
        )}

        <div style={{ marginBottom:14 }}>
          <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700 }}>Key initiatives</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {(s.initiatives||[]).map(i => <span key={i} style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#f3f4f6", color:"#374151", border:"1px solid #d1d5db", fontWeight:600 }}>{i}</span>)}
          </div>
        </div>

        <div style={{ marginBottom:14, padding:"12px 14px", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:8 }}>
          <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#92400e" }}>Program notes</p>
          <p style={{ margin:0, fontSize:13, color:"#78350f", lineHeight:1.6 }}>{s.notes}</p>
        </div>

        <div style={{ marginBottom:14 }}>
          <p style={{ margin:"0 0 12px", fontSize:14, fontWeight:700 }}>How to apply in {s.name}</p>
          {steps.map(st => (
            <div key={st.n} style={{ display:"flex", gap:12, marginBottom:10 }}>
              <div style={{ flexShrink:0, width:26, height:26, borderRadius:"50%", background:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{st.n}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 2px", fontWeight:700, fontSize:13, color:"#111827" }}><i className={`ti ${st.icon}`} style={{ fontSize:13, marginRight:5, color:"#6b7280" }} />{st.title}</p>
                <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.6 }}>{st.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:14, padding:"12px 14px", background:"#f0fdf4", border:"1.5px solid #86efac", borderRadius:8, display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
          <div>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#14532d" }}>Live AI update for {s.name}</p>
            <p style={{ margin:0, fontSize:12, color:"#166534" }}>Search for the latest — auto-updates the hub if new info found</p>
          </div>
          <button onClick={fetchLive} disabled={aiLoading}
            style={{ fontSize:12, padding:"7px 14px", background:"#16a34a", color:"#fff", border:"none", borderRadius:7, cursor:aiLoading?"wait":"pointer", fontWeight:700, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6 }}>
            {aiLoading ? <><i className="ti ti-loader-2" style={{ fontSize:13 }} /> Searching…</> : <><i className="ti ti-refresh" style={{ fontSize:13 }} /> Check now</>}
          </button>
        </div>

        {aiUpdate && (
          <div style={{ marginBottom:14, padding:"14px", background:"#f0fdf4", border:"2px solid #16a34a", borderRadius:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#14532d" }}><i className="ti ti-sparkles" style={{ fontSize:13, marginRight:4 }} />Live update</p>
              {aiUpdate.exactDate && <span style={{ fontSize:12, color:"#166534", fontWeight:700, background:"#dcfce7", padding:"2px 8px", borderRadius:12 }}>Published: {aiUpdate.exactDate}</span>}
            </div>
            <p style={{ margin:"0 0 8px", fontSize:13, color:"#111827", lineHeight:1.6 }}>{aiUpdate.latestNews}</p>
            {aiUpdate.newRfps?.length>0 && aiUpdate.newRfps.map((r,i) => <p key={i} style={{ margin:"2px 0", fontSize:12 }}>• {r}</p>)}
            {aiUpdate.deadlineUpdates && <p style={{ margin:"4px 0 0", fontSize:12 }}><strong>Deadline:</strong> {aiUpdate.deadlineUpdates}</p>}
            {aiUpdate.submissionChanges && <p style={{ margin:"4px 0 0", fontSize:12 }}><strong>Submission:</strong> {aiUpdate.submissionChanges}</p>}
            {aiUpdate.statusChange && aiUpdate.statusChange!=="null" && <p style={{ margin:"4px 0 0", fontSize:12 }}><strong>Status change:</strong> {aiUpdate.statusChange} <span style={{ color:"#16a34a", fontWeight:700 }}>✓ Applied to hub</span></p>}
            {aiUpdate.sourceUrl && <a href={aiUpdate.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"#16a34a", display:"inline-flex", alignItems:"center", gap:4, marginTop:8, fontWeight:700 }}>{aiUpdate.sourceTitle||"Source"} <i className="ti ti-arrow-up-right" style={{ fontSize:11 }} /></a>}
          </div>
        )}
        {aiError && <div style={{ marginBottom:12, padding:"10px 14px", background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, fontSize:13, color:"#991b1b" }}>{aiError}</div>}

        {s.status==="active" && (
          <div style={{ marginTop:4 }}>
            <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700 }}>Key documents</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                { label:"State RFP / application page", url:s.rfpUrl, icon:"ti-clipboard-list" },
                { label:"CMS NOFO (federal)", url:s.nofoUrl, icon:"ti-file-text" },
                { label:"NRHA real-time tracker", url:NRHA_TRACKER, icon:"ti-map" },
              ].map(({label,url,icon}) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, border:"1px solid #d1d5db", color:"#111827", textDecoration:"none", fontSize:13, fontWeight:600, background:"#fff" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
                  onMouseLeave={e=>e.currentTarget.style.background="#fff"}
                >
                  <i className={`ti ${icon}`} style={{ fontSize:16, color:"#6b7280" }} />{label}
                  <i className="ti ti-arrow-up-right" style={{ fontSize:13, marginLeft:"auto", color:"#9ca3af" }} />
                </a>
              ))}
            </div>
          </div>
        )}
        <div style={{ marginTop:14, padding:"10px 14px", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:8 }}>
          <p style={{ margin:0, fontSize:12, color:"#92400e" }}><i className="ti ti-alert-triangle" style={{ fontSize:12, marginRight:5 }} /><strong>Always verify</strong> deadlines directly with {s.agency} before applying.</p>
        </div>
      </div>
    </div>
  );
}

// ─── DEADLINE TRACKER ─────────────────────────────────────────────────────────
function DeadlineTracker({ deadlines, onRefresh, refreshStatus }) {
  const urgMap = {
    open:     { color:"#16a34a", label:"Open now",        icon:"ti-circle-check" },
    upcoming: { color:"#d97706", label:"Upcoming",        icon:"ti-clock" },
    watch:    { color:"#2563eb", label:"Watch for round", icon:"ti-eye" },
    pending:  { color:"#9ca3af", label:"Not released",    icon:"ti-minus" },
  };
  const sections = ["open","upcoming","watch","pending"].map(u => ({
    u, ...urgMap[u], items: deadlines.filter(d=>d.urgency===u)
  }));

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <p style={{ margin:0, fontSize:13, color:"#6b7280" }}>Deadlines are refreshed automatically on page load and when you click "Refresh all data".</p>
        <button onClick={onRefresh} disabled={refreshStatus.loading}
          style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, padding:"7px 14px", background:"#2563eb", color:"#fff", border:"none", borderRadius:7, cursor:"pointer", fontWeight:700 }}>
          <i className="ti ti-refresh" style={{ fontSize:13 }} />{refreshStatus.loading?"Refreshing…":"Refresh deadlines"}
        </button>
      </div>
      <div style={{ marginBottom:14, padding:"10px 14px", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:8, fontSize:13, color:"#92400e" }}>
        <i className="ti ti-info-circle" style={{ fontSize:13, marginRight:6 }} />Many states use rolling deadlines. "Next due" shows the soonest estimated close date. Always verify exact dates with the state agency.
      </div>
      {sections.map(sec => sec.items.length===0 ? null : (
        <div key={sec.u} style={{ marginBottom:22 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 12px", borderRadius:8, background:sec.color+"18", borderLeft:`4px solid ${sec.color}` }}>
            <i className={`ti ${sec.icon}`} style={{ fontSize:16, color:sec.color }} />
            <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>{sec.label} <span style={{ fontWeight:500, color:"#6b7280" }}>({sec.items.length})</span></p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {sec.items.map(d => (
              <div key={d.abbr} style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"12px 14px", display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:12, alignItems:"start" }}>
                <div>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>{d.name}</p>
                  <p style={{ margin:"2px 0 5px", fontSize:11, color:"#6b7280", fontWeight:600 }}>{d.award}</p>
                  {d.portalUrl ? S.badge(d.portalUrl, "Open portal") : <span style={{ fontSize:11, color:"#9ca3af" }}>Portal TBD</span>}
                </div>
                <div>
                  <p style={{ margin:"0 0 2px", fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:0.4 }}>Current status</p>
                  <p style={{ margin:"0 0 6px", fontSize:12, color:"#111827", fontWeight:600 }}>{d.specificDate}</p>
                  <p style={{ margin:"0 0 2px", fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:0.4 }}>Next due date</p>
                  <p style={{ margin:"2px 0 0", fontSize:12, color:"#1e40af", fontWeight:700 }}>{d.nextDue}</p>
                </div>
                {S.pill(sec.color, sec.color+"18", sec.label, sec.icon)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LIVE FEED ────────────────────────────────────────────────────────────────
function LiveFeed() {
  const [loading, setLoading]  = useState(false);
  const [results, setResults]  = useState([]);
  const [error, setError]      = useState(null);
  const [lastRun, setLastRun]  = useState(null);

  async function runScan() {
    setLoading(true); setError(null);
    try {
      const raw = await aiSearch(
        `Search the web right now for the latest Rural Health Transformation Program (RHTP) news published in the last 30 days. Look for: new RFPs with exact dates, updated deadlines, new funding announcements, new state launches, CMS updates. Return ONLY a valid JSON array of up to 8 items: [{ "state":"state name or 'Federal / CMS'", "headline":"under 12 words", "detail":"1-2 sentences", "type":"new_rfp|deadline|funding|announcement|cms_update", "url":"source URL", "exactDate":"Month DD, YYYY" }]. Raw JSON array only, no markdown.`
      );
      setResults(JSON.parse(raw));
      setLastRun(new Date().toLocaleString());
    } catch(e) { setError("Scan failed. Try again."); }
    setLoading(false);
  }

  // Auto-run on mount
  useEffect(() => { runScan(); }, []);

  const typeMap = {
    new_rfp:     { bg:"#dcfce7", color:"#065f46", label:"New RFP",       icon:"ti-file-plus" },
    deadline:    { bg:"#fee2e2", color:"#991b1b", label:"Deadline",       icon:"ti-clock" },
    funding:     { bg:"#dbeafe", color:"#1e40af", label:"Funding",        icon:"ti-coin" },
    announcement:{ bg:"#fef3c7", color:"#92400e", label:"Announcement",   icon:"ti-speakerphone" },
    cms_update:  { bg:"#f3e8ff", color:"#6b21a8", label:"CMS Update",     icon:"ti-building" },
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
        <div>
          <p style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>Live news feed</p>
          <p style={{ margin:0, fontSize:13, color:"#6b7280" }}>Auto-runs on page load. Searches the web for the latest RHTP news.</p>
        </div>
        <button onClick={runScan} disabled={loading}
          style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, padding:"9px 18px", background:"#2563eb", color:"#fff", border:"none", borderRadius:8, cursor:loading?"wait":"pointer", fontWeight:700 }}>
          {loading ? <><i className="ti ti-loader-2" style={{ fontSize:15 }} /> Scanning…</> : <><i className="ti ti-refresh" style={{ fontSize:15 }} /> Refresh feed</>}
        </button>
      </div>

      {loading && !results.length && [1,2,3,4].map(i => <div key={i} style={{ height:76, background:"#f9fafb", borderRadius:8, border:"1px solid #e5e7eb", marginBottom:8 }} />)}
      {error && <div style={{ padding:"12px 16px", background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, fontSize:13, color:"#991b1b" }}>{error}</div>}

      {results.length>0 && (
        <>
          <div style={{ marginBottom:12, padding:"8px 12px", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:8 }}>
            <p style={{ margin:0, fontSize:12, color:"#166534", fontWeight:700 }}><i className="ti ti-check" style={{ fontSize:13, marginRight:5 }} />Last scanned: {lastRun}</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {results.map((item,i) => {
              const ts = typeMap[item.type] || typeMap.announcement;
              return (
                <div key={i} style={{ padding:"14px 16px", background:"#fff", borderRadius:8, border:"1.5px solid #e5e7eb", display:"flex", gap:12, alignItems:"flex-start" }}>
                  <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:ts.bg, color:ts.color, whiteSpace:"nowrap", marginTop:3, flexShrink:0, fontWeight:700 }}><i className={`ti ${ts.icon}`} style={{ fontSize:11, marginRight:3 }} />{ts.label}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                      <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#111827" }}>{item.state}</p>
                      {item.exactDate && <span style={{ fontSize:12, color:"#374151", background:"#f3f4f6", padding:"1px 8px", borderRadius:10, fontWeight:700 }}>{item.exactDate}</span>}
                    </div>
                    <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:700, color:"#1e3a8a" }}>{item.headline}</p>
                    <p style={{ margin:0, fontSize:12, color:"#6b7280", lineHeight:1.5 }}>{item.detail}</p>
                    {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"#2563eb", display:"inline-flex", alignItems:"center", gap:3, marginTop:6, fontWeight:700 }}>Source <i className="ti ti-arrow-up-right" style={{ fontSize:11 }} /></a>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── COMPANY TAB ─────────────────────────────────────────────────────────────
const ANDOR = {
  name:"Andor Health", url:"https://andorhealth.com", tagline:"AI-powered virtual care platform (ThinkAndor®)",
  color:"#1e40af", bg:"#eff6ff", border:"#bfdbfe",
  capabilities:["ThinkAndor® — generative AI virtual care platform (#1 KLAS-rated 2024–2026)","Ambient AI documentation — saves 3+ hrs of nursing documentation per shift","Virtual nursing & remote patient monitoring across hospital wards","AI-enabled triage, virtual rounding, and remote specialty consultations","Real-time EHR integration (Epic, Cerner, athenahealth)","Agentic AI — automates care coordination and expands rural provider capacity","Deployed at Sentara Health (12 hospitals), Ballad Health (rural Appalachia), MUSC","Frost & Sullivan 2025 North American Transformational Innovation Award"],
  rhtAlignment:[
    { initiative:"Technology Innovation", fit:"Strong", reason:"ThinkAndor® directly satisfies CMS RHT priorities for AI, remote monitoring, and technology-enabled rural care delivery." },
    { initiative:"Workforce Development", fit:"Strong", reason:"Ambient AI saves 3+ hrs/shift — directly reduces clinician burnout and extends rural workforce capacity without adding staff." },
    { initiative:"Telehealth", fit:"Strong", reason:"Enables virtual rounding, remote consultations, and specialist access — exactly the telehealth routing rural hospitals need." },
    { initiative:"Chronic Disease", fit:"Moderate", reason:"Remote patient monitoring and predictive care tools support chronic disease management programs." },
    { initiative:"Rural Hospital Support", fit:"Strong", reason:"Deployed at Ballad Health (rural Appalachia). Reduces operational costs by up to 70%." },
    { initiative:"Behavioral Health", fit:"Moderate", reason:"Virtual consultation routing can connect rural patients with behavioral health specialists." },
  ]
};

const PSYNERGY = {
  name:"Psynergy Health", url:"https://psynergy.health", tagline:"Virtual clinical workforce & care coordination services",
  color:"#065f46", bg:"#f0fdf4", border:"#86efac",
  capabilities:["Virtual nursing — remote RNs for assessments, monitoring, documentation, and coordination","Virtual physicians and advanced practice providers (APPs) deployed to rural hospitals","AI-enabled triage and telehealth routing to right-level care","Remote specialty consultation — gives small hospitals access to specialist expertise","Continuous remote patient monitoring — fall prevention, sitter cost reduction","Ambient AI documentation integrated with virtual workforce services","Founded 2023, Orlando FL — explicitly built for rural health transformation (announced HIMSS March 9, 2026)","CMS RHTP alignment publicly announced — aligns with CMS cost reduction, access, workforce, and health equity goals"],
  rhtAlignment:[
    { initiative:"Workforce Development", fit:"Strong", reason:"Core product: virtual clinical workforce (RNs, physicians, APPs) that augments rural clinical teams — directly solves rural staffing shortages." },
    { initiative:"Telehealth", fit:"Strong", reason:"AI-enabled triage, telehealth routing, and remote specialty consultation are Psynergy's primary service lines." },
    { initiative:"Rural Hospital Support", fit:"Strong", reason:"Designed explicitly for rural hospitals. Reduces ED overutilization and avoidable hospitalizations." },
    { initiative:"Chronic Disease", fit:"Strong", reason:"Remote monitoring and predictive care programs identify and manage chronic diseases earlier — CMS's stated RHTP goal." },
    { initiative:"Technology Innovation", fit:"Strong", reason:"Combines ambient AI, interoperability, and virtual workforce — satisfies CMS technology innovation priorities." },
    { initiative:"Behavioral Health", fit:"Moderate", reason:"Virtual APPs and specialty routing can include behavioral health providers, extending mental health access." },
  ]
};

function CompanyMatch({ rfps, onRefresh, refreshStatus }) {
  const [view, setView] = useState("overview");
  const [rfpFilter, setRfpFilter] = useState("all");
  const filtered = rfpFilter==="all" ? rfps : rfps.filter(r => r.andorFit===rfpFilter || r.psynergyFit===rfpFilter);

  function CompanyCard({ co }) {
    return (
      <div style={{ background:co.bg, border:`2px solid ${co.border}`, borderRadius:12, padding:"1.25rem", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:co.color }}>{co.name}</h3>
            <p style={{ margin:"3px 0 0", fontSize:13, color:"#374151" }}>{co.tagline}</p>
          </div>
          <a href={co.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:12, padding:"6px 12px", background:co.color, color:"#fff", borderRadius:7, textDecoration:"none", fontWeight:700 }}>
            Website <i className="ti ti-arrow-up-right" style={{ fontSize:11 }} />
          </a>
        </div>
        <div style={{ marginBottom:12 }}>
          <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:co.color }}>Core capabilities (public record)</p>
          {co.capabilities.map((c,i) => <p key={i} style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.5 }}>• {c}</p>)}
        </div>
        <div>
          <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:co.color }}>RHT initiative alignment</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {co.rhtAlignment.map((a,i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:8, padding:"10px 12px", display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ minWidth:76, flexShrink:0 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:fitColor[a.fit], background:fitBg[a.fit], padding:"2px 7px", borderRadius:10, display:"block", textAlign:"center", marginBottom:4 }}>{a.fit}</span>
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
      <div style={{ marginBottom:14, padding:"12px 16px", background:"#eff6ff", border:"2px solid #bfdbfe", borderRadius:10 }}>
        <p style={{ margin:"0 0 4px", fontSize:14, fontWeight:700, color:"#1e40af" }}>Andor Health & Psynergy Health — RHT Applicability Analysis</p>
        <p style={{ margin:0, fontSize:13, color:"#1e3a8a" }}>Based entirely on public information. RFP list is refreshed automatically on page load.</p>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:14, borderBottom:"1.5px solid #e5e7eb", paddingBottom:12 }}>
        {[["overview","Company overview"],["rfps","RFP match matrix"]].map(([id,label]) => (
          <button key={id} onClick={()=>setView(id)}
            style={{ padding:"8px 16px", fontSize:13, fontWeight:view===id?700:500, border:"none", borderBottom:view===id?"3px solid #2563eb":"3px solid transparent", background:"none", cursor:"pointer", color:view===id?"#2563eb":"#6b7280", marginBottom:-13 }}>
            {label}
          </button>
        ))}
      </div>
      {view==="overview" && (
        <div>
          <CompanyCard co={ANDOR} />
          <CompanyCard co={PSYNERGY} />
        </div>
      )}
      {view==="rfps" && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["all","Strong","Moderate"].map(f => (
                <button key={f} onClick={()=>setRfpFilter(f)}
                  style={{ padding:"6px 14px", fontSize:12, fontWeight:rfpFilter===f?700:500, border:"1.5px solid", borderColor:rfpFilter===f?"#2563eb":"#d1d5db", borderRadius:20, background:rfpFilter===f?"#eff6ff":"#fff", cursor:"pointer", color:rfpFilter===f?"#1e40af":"#374151" }}>
                  {f==="all"?"All RFPs":f+" fit"}
                </button>
              ))}
            </div>
            <button onClick={onRefresh} disabled={refreshStatus.loading}
              style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, padding:"7px 14px", background:"#2563eb", color:"#fff", border:"none", borderRadius:7, cursor:"pointer", fontWeight:700 }}>
              <i className="ti ti-refresh" style={{ fontSize:13 }} />{refreshStatus.loading?"Refreshing…":"Refresh RFPs"}
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filtered.map((r,i) => (
              <div key={i} style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"14px 16px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                  <div>
                    <p style={{ margin:0, fontSize:15, fontWeight:800, color:"#111827" }}>{r.state}</p>
                    <p style={{ margin:"3px 0 0", fontSize:13, color:"#374151", fontWeight:600 }}>{r.rfp}</p>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:r.status?.includes("Open")?"#dcfce7":"#fef3c7", color:r.status?.includes("Open")?"#065f46":"#92400e" }}>{r.status}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, background:"#f3f4f6", color:"#374151" }}>{r.award}</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                  {(r.initiatives||[]).map(ini => <span key={ini} style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:"#f3f4f6", color:"#374151", border:"1px solid #d1d5db", fontWeight:600 }}>{ini}</span>)}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                  <div style={{ background:ANDOR.bg, border:`1px solid ${ANDOR.border}`, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:fitColor[r.andorFit], background:fitBg[r.andorFit], padding:"2px 7px", borderRadius:10 }}>{r.andorFit}</span>
                      <p style={{ margin:0, fontSize:12, fontWeight:700, color:ANDOR.color }}>Andor Health</p>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.5 }}>{r.andorNote}</p>
                  </div>
                  <div style={{ background:PSYNERGY.bg, border:`1px solid ${PSYNERGY.border}`, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:fitColor[r.psynergyFit], background:fitBg[r.psynergyFit], padding:"2px 7px", borderRadius:10 }}>{r.psynergyFit}</span>
                      <p style={{ margin:0, fontSize:12, fontWeight:700, color:PSYNERGY.color }}>Psynergy Health</p>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.5 }}>{r.psynergyNote}</p>
                  </div>
                </div>
                {r.portalUrl && S.badge(r.portalUrl, "Open portal")}
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, padding:"10px 14px", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, fontSize:12, color:"#6b7280" }}>
            <i className="ti ti-info-circle" style={{ fontSize:12, marginRight:5 }} />Based on public information only. Fit ratings reflect capability alignment — not guaranteed outcomes.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const TABS = [
  { id:"states",    label:"States directory",  icon:"ti-map" },
  { id:"live",      label:"Live feed",          icon:"ti-radio" },
  { id:"deadlines", label:"Deadline tracker",   icon:"ti-calendar-event" },
  { id:"company",   label:"Andor & Psynergy",   icon:"ti-building-hospital" },
  { id:"resources", label:"Key resources",      icon:"ti-link" },
];

export default function App() {
  const [tab,             setTab]             = useState("states");
  const [search,          setSearch]          = useState("");
  const [statusFilter,    setStatusFilter]    = useState("all");
  const [initFilter,      setInitFilter]      = useState("all");
  const [selected,        setSelected]        = useState(null);
  const [showRefreshLog,  setShowRefreshLog]  = useState(false);

  const { states, deadlines, rfps, refreshAll, refreshStatus } = useDataStore();

  // Update a single state record (called from Overlay after live check)
  const handleStateUpdate = useCallback((abbr, patch) => {
    // This is handled inside useDataStore via the setStates from Overlay calling onStateUpdate
    // We expose a direct setter via a ref trick here
  }, []);

  const filtered    = states.filter(s => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) || s.abbr.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter==="all" || s.status===statusFilter;
    const mi = initFilter==="all" || (s.initiatives||[]).includes(initFilter);
    return ms && mf && mi;
  });
  const filtActive  = filtered.filter(s => s.status==="active");
  const filtPending = filtered.filter(s => s.status==="pending");

  return (
    <div style={{ fontFamily:"'Inter',system-ui,-apple-system,sans-serif", background:"#f3f4f6", minHeight:"100vh", padding:"1.5rem 1rem 4rem" }}>
      <div style={{ maxWidth:940, margin:"0 auto" }}>

        {/* HEADER */}
        <div style={{ background:"#1e3a8a", borderRadius:12, padding:"1.5rem", marginBottom:"1rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:"#fff" }}>RHT RFP Central Hub</h1>
              <p style={{ margin:"4px 0 0", fontSize:13, color:"#bfdbfe" }}>Rural Health Transformation Program · All 50 states · AI-powered live updates</p>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#16a34a", color:"#fff", fontWeight:700 }}>{states.filter(s=>s.status==="active").length} Active</span>
              <span style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#d97706", color:"#fff", fontWeight:700 }}>{states.filter(s=>s.status==="pending").length} Pending</span>
              <button onClick={()=>refreshAll(true)} disabled={refreshStatus.loading}
                style={{ fontSize:12, padding:"4px 12px", borderRadius:20, background:refreshStatus.loading?"#4b5563":"#7c3aed", color:"#fff", border:"none", cursor:"pointer", fontWeight:700, display:"flex", alignItems:"center", gap:5 }}>
                <i className={`ti ${refreshStatus.loading?"ti-loader-2":"ti-refresh"}`} style={{ fontSize:12 }} />
                {refreshStatus.loading ? "Refreshing…" : "Refresh all data"}
              </button>
            </div>
          </div>

          {/* Refresh status bar */}
          <div style={{ marginTop:12, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <p style={{ margin:0, fontSize:12, color:"#93c5fd" }}>
              {refreshStatus.loading
                ? "Searching web for latest RHTP data…"
                : refreshStatus.lastRefreshed
                  ? `Last refreshed: ${refreshStatus.lastRefreshed}`
                  : "Data loads automatically on page open."}
            </p>
            {refreshStatus.log.length>0 && (
              <button onClick={()=>setShowRefreshLog(v=>!v)}
                style={{ fontSize:11, color:"#bfdbfe", background:"none", border:"1px solid #3b5ba9", borderRadius:12, padding:"2px 10px", cursor:"pointer" }}>
                {showRefreshLog ? "Hide" : "Show"} refresh log ({refreshStatus.log.length})
              </button>
            )}
          </div>
          {showRefreshLog && (
            <div style={{ marginTop:8, background:"rgba(0,0,0,0.25)", borderRadius:8, padding:"10px 12px", maxHeight:120, overflowY:"auto" }}>
              {refreshStatus.log.map((l,i) => (
                <p key={i} style={{ margin:0, fontSize:11, color: l.type==="success"?"#86efac":l.type==="warn"?"#fcd34d":"#93c5fd", lineHeight:1.7 }}>
                  [{l.ts}] {l.msg}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* TABS */}
        <div style={{ background:"#fff", borderRadius:10, border:"1.5px solid #e5e7eb", marginBottom:"1rem", overflowX:"auto", display:"flex" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{ flex:"0 0 auto", padding:"12px 16px", fontSize:13, fontWeight:tab===t.id?700:500, border:"none", borderBottom:tab===t.id?"3px solid #2563eb":"3px solid transparent", background:"none", cursor:"pointer", color:tab===t.id?"#2563eb":"#6b7280", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
              <i className={`ti ${t.icon}`} style={{ fontSize:14 }} />{t.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div style={{ background:"#fff", borderRadius:10, border:"1.5px solid #e5e7eb", padding:"1.5rem" }}>

          {tab==="states" && (
            <>
              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                <div style={{ position:"relative", flex:1, minWidth:180 }}>
                  <i className="ti ti-search" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }} />
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by state name or abbreviation…"
                    style={{ width:"100%", boxSizing:"border-box", border:"1.5px solid #d1d5db", borderRadius:8, padding:"9px 12px 9px 34px", fontSize:13, color:"#111827", outline:"none" }} />
                </div>
                <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
                  style={{ minWidth:150, border:"1.5px solid #d1d5db", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#111827", background:"#fff" }}>
                  <option value="all">All statuses</option>
                  <option value="active">Active only</option>
                  <option value="pending">Pending only</option>
                </select>
                <select value={initFilter} onChange={e=>setInitFilter(e.target.value)}
                  style={{ minWidth:200, border:"1.5px solid #d1d5db", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#111827", background:"#fff" }}>
                  <option value="all">All key initiatives</option>
                  {ALL_INITIATIVES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>

              {initFilter!=="all" && (
                <div style={{ marginBottom:12, padding:"8px 12px", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:8, display:"flex", alignItems:"center", gap:8 }}>
                  <i className="ti ti-filter" style={{ fontSize:13, color:"#2563eb" }} />
                  <p style={{ margin:0, fontSize:13, color:"#1e40af", fontWeight:600 }}>Filtering by "{initFilter}" — {filtered.length} state{filtered.length!==1?"s":""}</p>
                  <button onClick={()=>setInitFilter("all")} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#2563eb", fontWeight:700 }}>Clear ×</button>
                </div>
              )}

              {filtActive.length>0 && (
                <div style={{ marginBottom:24 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 12px", background:"#f0fdf4", borderRadius:8, borderLeft:"4px solid #16a34a" }}>
                    <i className="ti ti-circle-check" style={{ fontSize:16, color:"#16a34a" }} />
                    <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>Active states — RFPs released <span style={{ fontWeight:500, color:"#6b7280" }}>({filtActive.length})</span></p>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:12 }}>
                    {filtActive.map(s => <StateCard key={s.abbr} s={s} onClick={setSelected} />)}
                  </div>
                </div>
              )}

              {filtPending.length>0 && (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 12px", background:"#fffbeb", borderRadius:8, borderLeft:"4px solid #d97706" }}>
                    <i className="ti ti-clock" style={{ fontSize:16, color:"#d97706" }} />
                    <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>Pending states — awaiting RFP release <span style={{ fontWeight:500, color:"#6b7280" }}>({filtPending.length})</span></p>
                  </div>
                  <div style={{ marginBottom:10, padding:"10px 14px", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:8, fontSize:13, color:"#92400e" }}>
                    These states received CMS awards but have not yet released RFPs. Click a card and use "Check now" for live AI updates.
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:12 }}>
                    {filtPending.map(s => <StateCard key={s.abbr} s={s} onClick={setSelected} />)}
                  </div>
                </div>
              )}
              {!filtActive.length && !filtPending.length && (
                <p style={{ color:"#6b7280", fontSize:14, textAlign:"center", padding:"2rem" }}>No states match your filters.</p>
              )}
            </>
          )}

          {tab==="live"      && <LiveFeed />}
          {tab==="deadlines" && <DeadlineTracker deadlines={deadlines} onRefresh={()=>refreshAll(true)} refreshStatus={refreshStatus} />}
          {tab==="company"   && <CompanyMatch rfps={rfps} onRefresh={()=>refreshAll(true)} refreshStatus={refreshStatus} />}

          {tab==="resources" && (
            <div>
              <p style={{ margin:"0 0 16px", fontSize:13, color:"#6b7280" }}>Master documents, trackers, and authoritative sources.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { label:"CMS RHT Program overview", desc:"Official CMS page — program goals, NOFO info, and contacts", url:"https://www.cms.gov/priorities/rural-health-transformation-rht-program/overview", icon:"ti-building-hospital" },
                  { label:"CMS NOFO (full PDF)", desc:"The complete Notice of Funding Opportunity — master federal document", url:CMS_NOFO_URL, icon:"ti-file-text" },
                  { label:"grants.gov official listing", desc:"Federal grants listing with application instructions", url:GRANTS_GOV, icon:"ti-external-link" },
                  { label:"NRHA state RFP tracker", desc:"Real-time interactive map of every state's RFP procurement stage", url:NRHA_TRACKER, icon:"ti-map" },
                  { label:"RHIhub state programs directory", desc:"Links to all 50 state RHTP program pages", url:RHIHUB_URL, icon:"ti-list" },
                  { label:"SHVS state implementation tracker", desc:"Which agencies lead RHTP in each state", url:SHVS_URL, icon:"ti-chart-bar" },
                  { label:"RHTP Tracker (daily updates)", desc:"Daily updates on RFPs, awards, and documents across all 50 states", url:"https://rhtp.amemobile.net/", icon:"ti-refresh" },
                  { label:"Andor Health (ThinkAndor®)", desc:"AI-powered virtual care platform — KLAS #1 rated 2024–2026", url:"https://andorhealth.com", icon:"ti-robot" },
                  { label:"Psynergy Health", desc:"Virtual clinical workforce for rural health systems", url:"https://psynergy.health", icon:"ti-heart-plus" },
                  { label:"Email CMS directly", desc:"MAHARural@cms.hhs.gov", url:"mailto:MAHARural@cms.hhs.gov", icon:"ti-mail" },
                ].map(({label,desc,url,icon}) => (
                  <a key={label} href={url} target={url.startsWith("mailto:")?undefined:"_blank"} rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", borderRadius:8, border:"1.5px solid #e5e7eb", color:"#111827", textDecoration:"none", background:"#fff" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}
                  >
                    <div style={{ width:36, height:36, borderRadius:8, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
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
          Data sourced from CMS, state RHTP websites, NRHA, RHIhub, and SHVS. AI live search powered by Claude. Always verify with the state agency before applying.
        </p>
      </div>

      {selected && (
        <Overlay
          s={selected}
          onClose={() => setSelected(null)}
          onStateUpdate={(abbr, patch) => {
            // bubble update back up — re-find selected with patched values
            setSelected(prev => prev?.abbr===abbr ? { ...prev, ...patch } : prev);
          }}
        />
      )}
    </div>
  );
}
