import { useState } from "react";

const CMS_NOFO_URL = "https://apply07.grants.gov/apply/opportunities/instructions/PKG00291485-instructions.pdf";
const GRANTS_GOV_URL = "https://grants.gov/search-results-detail/360442";
const NRHA_TRACKER = "https://www.ruralhealth.us/programs/center-for-rural-health-innovation-and-system-redesign/rural-health-transformation-program";
const RHIHUB_URL = "https://www.ruralhealthinfo.org/resources/lists/rhtp";
const SHVS_URL = "https://shvs.org/tracking-state-releases-of-rural-health-transformation-program-applications/";

const ALL_INITIATIVES = ["Technology Innovation","Workforce Development","Chronic Disease","Telehealth","Behavioral Health","Rural Hospital Support","Tribal Health","Value-Based Care","Prevention","FQHC / Community Health","Maternal & Doula","Facility Modernization"];

const BASE_STATES = [
  { name:"Alabama", abbr:"AL", status:"active", agency:"Alabama Dept of Economic & Community Affairs", award:"~$100M", deadline:"Rolling — earliest submissions due Q3 2026", submission:"Email / Portal", portalUrl:"https://adeca.alabama.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Chronic Disease","Workforce Development","Technology Innovation"], notes:"Project narrative submitted. RFPs released on rolling basis.", contact:"alabama.rht@adeca.alabama.gov" },
  { name:"Alaska", abbr:"AK", status:"active", agency:"Alaska Dept of Health", award:"$272M", deadline:"2nd LOI window: late Summer 2026 (exact date TBD)", submission:"Portal", portalUrl:"https://health.alaska.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Tribal Health","Workforce Development","Technology Innovation"], notes:"First LOI drew ~1,800 submissions Feb–Mar 2026. All funds must be obligated by December 31, 2026.", contact:"alaska.rht@alaska.gov" },
  { name:"Arizona", abbr:"AZ", status:"active", agency:"Arizona Health Care Cost Containment System (AHCCCS)", award:"~$100M", deadline:"See AHCCCS procurement portal — rolling opportunities", submission:"Portal", portalUrl:"https://www.azahcccs.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Technology Innovation","Workforce Development","Chronic Disease"], notes:"Revised Budget & Project Narratives publicly available. RFPs on AHCCCS procurement page.", contact:"AHCCCSruralhealthtransformation@azahcccs.gov" },
  { name:"Arkansas", abbr:"AR", status:"active", agency:"Office of Governor Sarah Huckabee Sanders", award:"~$100M", deadline:"Rolling — see state RHTP webpage for current windows", submission:"Portal", portalUrl:"https://governor.arkansas.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Chronic Disease","Workforce Development","Telehealth"], notes:"Dedicated RHTP webpage launched March 2026. RFP opportunities posted as program matures.", contact:"See Arkansas RHTP webpage" },
  { name:"California", abbr:"CA", status:"active", agency:"Dept of Health Care Access & Information (HCAI)", award:"~$100M+", deadline:"See HCAI RHTP page for current application windows", submission:"Portal", portalUrl:"https://hcai.ca.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Technology Innovation","Prevention","FQHC / Community Health"], notes:"Rural Health Policy Council formed. FAQ and timeline published on HCAI website.", contact:"RHTPInfo@hcai.ca.gov" },
  { name:"Colorado", abbr:"CO", status:"active", agency:"Colorado Dept of Health Care Policy & Financing", award:"~$100M", deadline:"Multiple RFPs expected mid-2026 — Q3 2026 estimated first due dates", submission:"Portal", portalUrl:"https://hcpf.colorado.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Value-Based Care"], notes:"New governance structures proposed. Hiring new staff. RFPs expected mid-2026.", contact:"See Colorado HCPF RHTP page" },
  { name:"Connecticut", abbr:"CT", status:"active", agency:"Connecticut Dept of Social Services", award:"$154M", deadline:"See CT DSS procurement portal — rolling", submission:"Portal", portalUrl:"https://portal.ct.gov/dss/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Rural Hospital Support","Technology Innovation","Workforce Development"], notes:"Governor Lamont announced $154M. Implementation underway.", contact:"See CT DSS RHTP page" },
  { name:"Delaware", abbr:"DE", status:"active", agency:"Delaware Health and Social Services", award:"~$100M", deadline:"Initial RFPs open now — see state e-procurement; Q3 2026 deadlines", submission:"Portal", portalUrl:"https://dhss.delaware.gov/dhss/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["FQHC / Community Health","Value-Based Care","Technology Innovation"], notes:"One of the first states to open RFPs. FQHC Value-Based Care Readiness initiative active.", contact:"See Delaware DHSS RHTP page" },
  { name:"Florida", abbr:"FL", status:"active", agency:"Florida Agency for Health Care Administration (AHCA)", award:"~$100M+", deadline:"Rolling via MyFloridaMarketPlace — current openings active now", submission:"Portal", portalUrl:"https://ahca.myflorida.com/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Chronic Disease","Telehealth","Workforce Development","Rural Hospital Support"], notes:"Full application publicly available. Regional map on AHCA RHTP page.", contact:"See Florida AHCA RHTP page" },
  { name:"Georgia", abbr:"GA", status:"active", agency:"Georgia Dept of Community Health", award:"~$100M", deadline:"See DCH procurement portal — rolling", submission:"Portal", portalUrl:"https://dch.georgia.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Rural Hospital Support","Technology Innovation","Chronic Disease"], notes:"CMS approved amended first-year budget March 2026. Known as GREAT Health Program.", contact:"See Georgia DCH RHTP page" },
  { name:"Hawaii", abbr:"HI", status:"pending", agency:"Hawaii Dept of Human Services", award:"~$100M", anticipatedRelease:"Q3–Q4 2026", initiatives:["Telehealth","Workforce Development","Rural Hospital Support"], notes:"Award confirmed Dec 2025. Implementation planning underway. No RFPs released yet.", contact:"See Hawaii DHS" },
  { name:"Idaho", abbr:"ID", status:"pending", agency:"Idaho Dept of Health & Welfare", award:"~$100M", anticipatedRelease:"Q3–Q4 2026", initiatives:["Rural Hospital Support","Workforce Development","Technology Innovation"], notes:"Award confirmed. Implementation planning phase. No RFPs released yet.", contact:"See Idaho DHW" },
  { name:"Illinois", abbr:"IL", status:"active", agency:"Illinois Dept of Healthcare & Family Services", award:"~$100M+", deadline:"See Illinois Procurement Bulletin — rolling", submission:"Portal", portalUrl:"https://www.hfs.illinois.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Chronic Disease","Prevention"], notes:"Application submitted. RFPs posted on Illinois Procurement Bulletin.", contact:"See Illinois HFS RHTP page" },
  { name:"Indiana", abbr:"IN", status:"active", agency:"Indiana Family & Social Services Administration", award:"~$100M", deadline:"GROW Regional Grants: rolling — next round closes Q3 2026", submission:"Portal", portalUrl:"https://www.in.gov/fssa/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["FQHC / Community Health","Workforce Development","Technology Innovation"], notes:"GROW (Growing Rural Opportunities for Well-being) Regional Grants open since March 2026. Rolling acceptance.", contact:"See Indiana FSSA RHTP page" },
  { name:"Iowa", abbr:"IA", status:"pending", agency:"Iowa Dept of Health & Human Services", award:"~$100M", anticipatedRelease:"Mid-2026", initiatives:["Rural Hospital Support","Workforce Development","Chronic Disease"], notes:"Award confirmed. No RFPs released yet.", contact:"See Iowa HHS" },
  { name:"Kansas", abbr:"KS", status:"active", agency:"Kansas Dept of Health & Environment", award:"~$100M", deadline:"Rolling via KDHE — current windows active", submission:"Portal", portalUrl:"https://www.kdhe.ks.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Prevention","Technology Innovation"], notes:"Application, approved program docs, and webinar recordings available on KDHE page.", contact:"See Kansas KDHE RHTP page" },
  { name:"Kentucky", abbr:"KY", status:"active", agency:"Kentucky Cabinet for Health & Family Services", award:"~$100M", deadline:"See CHFS procurement portal — rolling", submission:"Portal / Email", portalUrl:"https://chfs.ky.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Rural Hospital Support","Prevention"], notes:"Project Narrative, Summary, and Supporting Documentation publicly available.", contact:"See Kentucky CHFS RHTP page" },
  { name:"Louisiana", abbr:"LA", status:"pending", agency:"Louisiana Dept of Health", award:"~$100M", anticipatedRelease:"Q3–Q4 2026", initiatives:["Workforce Development","Chronic Disease","Rural Hospital Support"], notes:"Award confirmed. Implementation planning underway.", contact:"See Louisiana DOH" },
  { name:"Maine", abbr:"ME", status:"active", agency:"Maine Dept of Health & Human Services", award:"~$100M", deadline:"Community partner RFPs expected Q3 2026 — webinars ongoing", submission:"Portal", portalUrl:"https://www.maine.gov/dhhs/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","FQHC / Community Health","Prevention"], notes:"Hosting community webinars for clinicians and partners. Budget amended. Formal RFPs expected Q3 2026.", contact:"See Maine DHHS RHTP page" },
  { name:"Maryland", abbr:"MD", status:"active", agency:"Maryland Dept of Health", award:"~$100M", deadline:"See eMarylandMarketplace — procurement postings active", submission:"Portal", portalUrl:"https://procurement.maryland.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Rural Hospital Support","Prevention"], notes:"Hiring RHTP Administrator. Stakeholder meetings held. RFPs posted via eMarylandMarketplace.", contact:"See Maryland DOH RHTP page" },
  { name:"Massachusetts", abbr:"MA", status:"pending", agency:"Massachusetts Executive Office of Health & Human Services", award:"~$100M", anticipatedRelease:"Q3–Q4 2026", initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"], notes:"Award confirmed. Implementation planning phase.", contact:"See MA EOHHS" },
  { name:"Michigan", abbr:"MI", status:"active", agency:"Michigan Dept of Health & Human Services", award:"~$100M+", deadline:"See MDHHS procurement portal — rolling", submission:"Portal", portalUrl:"https://www.michigan.gov/mdhhs/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Technology Innovation","Workforce Development","Rural Hospital Support"], notes:"Seeking applicants for Rural Health Transformation Advisory Council. Implementation ramping up.", contact:"See Michigan MDHHS RHTP page" },
  { name:"Minnesota", abbr:"MN", status:"pending", agency:"Minnesota Dept of Health", award:"~$100M", anticipatedRelease:"Mid-2026", initiatives:["Workforce Development","Rural Hospital Support","Technology Innovation"], notes:"Award confirmed. No RFPs released yet.", contact:"See Minnesota MDH" },
  { name:"Mississippi", abbr:"MS", status:"pending", agency:"Mississippi Division of Medicaid", award:"~$100M", anticipatedRelease:"Q3–Q4 2026", initiatives:["Chronic Disease","Workforce Development","Rural Hospital Support"], notes:"Award confirmed. Implementation planning underway.", contact:"See Mississippi Division of Medicaid" },
  { name:"Missouri", abbr:"MO", status:"active", agency:"Missouri Dept of Social Services", award:"~$100M", deadline:"Multiple RFPs/RFIs rolling Q1–Q3 2026 — next deadlines Q3 2026", submission:"Portal", portalUrl:"https://dss.mo.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Technology Innovation","Workforce Development","Value-Based Care"], notes:"Released multi-wave timeline for RFIs and RFPs across Q1–Q3 2026.", contact:"See Missouri DSS RHTP page" },
  { name:"Montana", abbr:"MT", status:"active", agency:"Montana Dept of Public Health & Human Services", award:"~$100M", deadline:"See MT procurement portal — rolling", submission:"Portal", portalUrl:"https://dphhs.mt.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Facility Modernization","Technology Innovation","FQHC / Community Health"], notes:"Plans to fund critical facility repairs and modernization across rural facilities including CHCs.", contact:"See Montana DPHHS RHTP page" },
  { name:"Nebraska", abbr:"NE", status:"active", agency:"Nebraska Dept of Health & Human Services", award:"~$100M", deadline:"Applications open now — rolling since March 2026", submission:"Portal", portalUrl:"https://dhhs.ne.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Chronic Disease","Telehealth"], notes:"Soliciting applications as of March 2026.", contact:"See Nebraska DHHS RHTP page" },
  { name:"Nevada", abbr:"NV", status:"active", agency:"Nevada Dept of Health & Human Services", award:"~$100M", deadline:"RHIT Grant awards: September 2026 (RFP open now)", submission:"Portal", portalUrl:"https://dhhs.nv.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Technology Innovation","Telehealth","Workforce Development"], notes:"Rural Health Innovation & Technology (RHIT) Grant RFP released May 2026. Awards September 2026. Contracts: Sept 15, 2026 – Sept 30, 2027.", contact:"See Nevada DHHS RHTP page" },
  { name:"New Hampshire", abbr:"NH", status:"pending", agency:"NH Dept of Health & Human Services", award:"~$100M", anticipatedRelease:"Q3–Q4 2026", initiatives:["Workforce Development","Rural Hospital Support","Telehealth"], notes:"Award confirmed. No RFPs released yet.", contact:"See NH DHHS" },
  { name:"New Jersey", abbr:"NJ", status:"active", agency:"New Jersey Dept of Health", award:"~$100M", deadline:"1st RFA closed January 20, 2026 — next round expected Q3 2026", submission:"Portal", portalUrl:"https://www.nj.gov/health/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Technology Innovation","Prevention","Workforce Development"], notes:"First RFA closed Jan 20, 2026. Published Vendor Resource Directory. Next round expected Q3 2026.", contact:"See NJ DOH RHTP page" },
  { name:"New Mexico", abbr:"NM", status:"active", agency:"New Mexico Health Care Authority", award:"~$100M", deadline:"See NMHCA portal — current opportunities active", submission:"Portal", portalUrl:"https://www.hca.nm.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["FQHC / Community Health","Technology Innovation","Tribal Health"], notes:"Application and stakeholder engagement materials publicly available.", contact:"See New Mexico Health Care Authority RHTP page" },
  { name:"New York", abbr:"NY", status:"active", agency:"New York State Dept of Health", award:"~$100M+", deadline:"See NYS Grants Gateway — rolling opportunities", submission:"Portal", portalUrl:"https://grantsgateway.ny.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Telehealth","Rural Hospital Support"], notes:"Application submitted. RFPs posted on NYS Grants Gateway.", contact:"See NY DOH RHTP page" },
  { name:"North Carolina", abbr:"NC", status:"active", agency:"NC Dept of Health & Human Services", award:"$213M", deadline:"Rolling — first legislative report due November 29, 2026", submission:"Portal", portalUrl:"https://ncdhhs.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Behavioral Health","Rural Hospital Support"], notes:"RHTP codified in state law (H696, April 30, 2026). Total expected ~$1B+ over 5 years. Rural Innovation Fund active.", contact:"See NC DHHS RHTP page" },
  { name:"North Dakota", abbr:"ND", status:"active", agency:"North Dakota Dept of Health & Human Services", award:"~$100M", deadline:"4 active RFPs open now — released May 2026, deadlines Q3 2026", submission:"Portal / Email", portalUrl:"https://www.hhs.nd.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"], notes:"4 RFPs released approximately May 2026. Deadlines expected Q3 2026. Check NRHA tracker for exact dates.", contact:"See North Dakota HHS RHTP page" },
  { name:"Ohio", abbr:"OH", status:"active", agency:"Ohio Dept of Medicaid", award:"~$100M+", deadline:"Applications open now — rolling since March 2026", submission:"Portal", portalUrl:"https://medicaid.ohio.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Chronic Disease"], notes:"Soliciting applications as of March 2026.", contact:"See Ohio DOH/ODM RHTP page" },
  { name:"Oklahoma", abbr:"OK", status:"active", agency:"Oklahoma Health Care Authority", award:"~$100M", deadline:"Applications open now — rolling since March 2026", submission:"Portal", portalUrl:"https://okhca.org/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Rural Hospital Support","Technology Innovation"], notes:"Soliciting applications as of March 2026.", contact:"See Oklahoma HCA RHTP page" },
  { name:"Oregon", abbr:"OR", status:"pending", agency:"Oregon Health Authority", award:"~$100M", anticipatedRelease:"Mid-2026", initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"], notes:"Award confirmed. Implementation planning underway.", contact:"See Oregon Health Authority" },
  { name:"Pennsylvania", abbr:"PA", status:"active", agency:"PA Dept of Human Services", award:"~$100M+", deadline:"See PA eMarketplace — active RFPs rolling", submission:"Portal", portalUrl:"https://www.dhs.pa.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Chronic Disease"], notes:"Application submitted. RFPs expected on PA eMarketplace.", contact:"See PA DHS RHTP page" },
  { name:"Rhode Island", abbr:"RI", status:"pending", agency:"RI Executive Office of Health & Human Services", award:"~$100M", anticipatedRelease:"Q3–Q4 2026", initiatives:["Workforce Development","Telehealth","Rural Hospital Support"], notes:"Award confirmed. No RFPs released yet.", contact:"See RI EOHHS" },
  { name:"South Carolina", abbr:"SC", status:"active", agency:"SC Dept of Health & Human Services", award:"~$100M", deadline:"Multiple RFPs open now — scoring rubric published May 2026", submission:"Portal", portalUrl:"https://www.scdhhs.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"], notes:"RFP overview and scoring rubric published May 2026. Multiple RFPs active.", contact:"See SC DHHS RHTP page" },
  { name:"South Dakota", abbr:"SD", status:"active", agency:"SD Dept of Health (ORHES)", award:"~$100M", deadline:"RFP #26-09RHT-022 open now — 2nd round also open now", submission:"Portal", portalUrl:"https://doh.sd.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Maternal & Doula"], notes:"Round 1: RFP #26-09RHT-022 — workforce/PM contractor up to $500K, renewable. Round 2: digital health, caregiver support, doula workforce.", contact:"See South Dakota DOH RHTP page" },
  { name:"Tennessee", abbr:"TN", status:"active", agency:"TN Dept of Health", award:"~$100M", deadline:"New opportunities posted — see TDH portal, Q3 2026 windows active", submission:"Portal", portalUrl:"https://www.tn.gov/health/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Chronic Disease"], notes:"TDH information session March 2026. New funding opportunities posted to TDH portal.", contact:"See Tennessee DOH RHTP page" },
  { name:"Texas", abbr:"TX", status:"active", agency:"Texas Health & Human Services Commission", award:"~$100M+", deadline:"See HHSC procurement portal — rolling", submission:"Portal", portalUrl:"https://www.hhs.texas.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Rural Hospital Support","Technology Innovation"], notes:"Application submitted. Largest rural population in nation. RFPs on HHSC portal.", contact:"See Texas HHSC RHTP page" },
  { name:"Utah", abbr:"UT", status:"active", agency:"Utah Dept of Health & Human Services", award:"~$500M (5yr)", deadline:"Legislature approved — see DHHS portal for active RFPs", submission:"Portal", portalUrl:"https://dhhs.utah.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Technology Innovation","Workforce Development","Value-Based Care"], notes:"Expected $500M over 5 years. Legislature approval granted early 2026. Workgroup proposals ran fall 2025.", contact:"Pam Bennett / Sarah Woolsey / Marc Watterson — Utah DHHS" },
  { name:"Vermont", abbr:"VT", status:"active", agency:"Vermont Agency of Human Services", award:"~$100M", deadline:"14-month initial contracts — see AHS portal", submission:"Portal", portalUrl:"https://ahs.vermont.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Value-Based Care","Technology Innovation"], notes:"CMS cooperative agreement oversight. 14-month initial project timeline; potential for additional budget periods.", contact:"See Vermont AHS RHTP page" },
  { name:"Virginia", abbr:"VA", status:"active", agency:"Virginia Dept of Medical Assistance Services", award:"~$100M", deadline:"See eVA procurement portal — rolling", submission:"Portal", portalUrl:"https://eva.virginia.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"], notes:"Hiring new staff. RFPs expected on eVA procurement portal.", contact:"See Virginia DMAS RHTP page" },
  { name:"Washington", abbr:"WA", status:"active", agency:"WA Health Care Authority (HCA)", award:"$181M", deadline:"Active RFPs on WEBS now — registration required before bidding", submission:"Portal (WEBS — registration required)", portalUrl:"https://fortress.wa.gov/ga/webs", rfpUrl:"https://www.hca.wa.gov/about-hca/programs-and-initiatives/value-based-purchasing/rural-health-transformation-program", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.hca.wa.gov/about-hca/programs-and-initiatives/value-based-purchasing/rural-health-transformation-program", initiatives:["Rural Hospital Support","FQHC / Community Health","Tribal Health","Workforce Development"], notes:"Must register at WEBS to view and submit bids. 6 key initiatives. Led by HCA + DOH + DSHS.", contact:"See WA HCA RHTP page" },
  { name:"West Virginia", abbr:"WV", status:"active", agency:"WV Dept of Health & Human Resources", award:"$199M", deadline:"Legislature approved — active RFPs on DHHR portal now", submission:"Portal", portalUrl:"https://dhhr.wv.gov/rhtp", rfpUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", nofoUrl:CMS_NOFO_URL, timelineUrl:"https://www.ruralhealthinfo.org/resources/lists/rhtp", initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"], notes:"Legislature passed RHTP supplemental appropriation. $199M deployed. Hiring underway.", contact:"See WV DHHR RHTP page" },
  { name:"Wisconsin", abbr:"WI", status:"pending", agency:"Wisconsin Dept of Health Services", award:"~$100M", anticipatedRelease:"Mid-2026", initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"], notes:"Award confirmed. No RFPs released yet.", contact:"See Wisconsin DHS" },
  { name:"Wyoming", abbr:"WY", status:"pending", agency:"Wyoming Dept of Health", award:"~$100M", anticipatedRelease:"Q3–Q4 2026", initiatives:["Workforce Development","Rural Hospital Support","Technology Innovation"], notes:"Award confirmed. No RFPs released yet.", contact:"See Wyoming DOH" },
];

const DEADLINE_ROWS = [
  { abbr:"SD", name:"South Dakota", specificDate:"Open now (Round 1 & 2 active)", nextDue:"Q3 2026 — exact close date on SD DOH portal", award:"~$100M", submission:"Portal", portalUrl:"https://doh.sd.gov/rhtp", urgency:"open" },
  { abbr:"IN", name:"Indiana", specificDate:"Open now — GROW Grants rolling since March 2026", nextDue:"Q3 2026 — rolling closes", award:"~$100M", submission:"Portal", portalUrl:"https://www.in.gov/fssa/rhtp", urgency:"open" },
  { abbr:"OH", name:"Ohio", specificDate:"Open now — rolling since March 2026", nextDue:"Q3 2026 — rolling closes", award:"~$100M+", submission:"Portal", portalUrl:"https://medicaid.ohio.gov/rhtp", urgency:"open" },
  { abbr:"OK", name:"Oklahoma", specificDate:"Open now — rolling since March 2026", nextDue:"Q3 2026 — rolling closes", award:"~$100M", submission:"Portal", portalUrl:"https://okhca.org/rhtp", urgency:"open" },
  { abbr:"NE", name:"Nebraska", specificDate:"Open now — rolling since March 2026", nextDue:"Q3 2026 — rolling closes", award:"~$100M", submission:"Portal", portalUrl:"https://dhhs.ne.gov/rhtp", urgency:"open" },
  { abbr:"WA", name:"Washington", specificDate:"Active RFPs on WEBS now", nextDue:"Varies per RFP — check WEBS portal (registration required)", award:"$181M", submission:"Portal (WEBS)", portalUrl:"https://fortress.wa.gov/ga/webs", urgency:"open" },
  { abbr:"SC", name:"South Carolina", specificDate:"Active RFPs open — scoring rubric published May 2026", nextDue:"Q3 2026 — check SCDHHS portal", award:"~$100M", submission:"Portal", portalUrl:"https://www.scdhhs.gov/rhtp", urgency:"open" },
  { abbr:"ND", name:"North Dakota", specificDate:"4 RFPs released May 2026", nextDue:"Q3 2026 — check ND HHS portal for exact close dates", award:"~$100M", submission:"Portal/Email", portalUrl:"https://www.hhs.nd.gov/rhtp", urgency:"open" },
  { abbr:"DE", name:"Delaware", specificDate:"Initial RFPs open now", nextDue:"Q3 2026 — see state e-procurement portal", award:"~$100M", submission:"Portal", portalUrl:"https://dhss.delaware.gov/dhss/rhtp", urgency:"open" },
  { abbr:"MO", name:"Missouri", specificDate:"Multiple waves rolling Q1–Q3 2026", nextDue:"Q3 2026 — next wave closes", award:"~$100M", submission:"Portal", portalUrl:"https://dss.mo.gov/rhtp", urgency:"open" },
  { abbr:"WV", name:"West Virginia", specificDate:"Active RFPs on DHHR portal now", nextDue:"Check DHHR portal for specific close dates", award:"$199M", submission:"Portal", portalUrl:"https://dhhr.wv.gov/rhtp", urgency:"open" },
  { abbr:"NV", name:"Nevada", specificDate:"RHIT Grant RFP released May 2026", nextDue:"Awards: September 2026 — contracts Sept 15–Sept 30, 2027", award:"~$100M", submission:"Portal", portalUrl:"https://dhhs.nv.gov/rhtp", urgency:"upcoming" },
  { abbr:"AK", name:"Alaska", specificDate:"2nd LOI window expected late Summer 2026", nextDue:"Late Summer 2026 — exact date TBD, all funds obligated by Dec 31, 2026", award:"$272M", submission:"Portal", portalUrl:"https://health.alaska.gov/rhtp", urgency:"upcoming" },
  { abbr:"NJ", name:"New Jersey", specificDate:"1st RFA closed: January 20, 2026", nextDue:"Next round expected Q3 2026 — watch NJ DOH RHTP page", award:"~$100M", submission:"Portal", portalUrl:"https://www.nj.gov/health/rhtp", urgency:"watch" },
  { abbr:"NC", name:"North Carolina", specificDate:"Rolling — active RFPs now", nextDue:"Legislative report due: November 29, 2026", award:"$213M", submission:"Portal", portalUrl:"https://ncdhhs.gov/rhtp", urgency:"open" },
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

const ANDOR = {
  name:"Andor Health",
  url:"https://andorhealth.com",
  tagline:"AI-powered virtual care platform (ThinkAndor®)",
  color:"#1e40af", bg:"#eff6ff", border:"#bfdbfe",
  capabilities:[
    "ThinkAndor® — generative AI virtual care collaboration platform (#1 KLAS-rated 2024, 2025, 2026)",
    "Ambient AI documentation — eliminates 3+ hours of nursing documentation per shift",
    "Virtual nursing & remote patient monitoring across hospital wards",
    "AI-enabled triage, virtual rounding, and remote specialty consultations",
    "Real-time clinical workflow orchestration — integrates with EHRs (Epic, Cerner, athenahealth)",
    "Agentic AI infrastructure — automates care coordination and expands rural provider capacity",
    "Virtual clinical workforce tools — reduces need for on-site staffing",
    "Frost & Sullivan 2025 North American Transformational Innovation Award — Acute Care Virtual Health",
    "Deployed at scale: Sentara Health (12 hospitals), Ballad Health, Medical University of South Carolina"
  ],
  rhtAlignment:[
    { initiative:"Technology Innovation", fit:"Strong", reason:"ThinkAndor® directly satisfies CMS RHT priorities for AI, remote monitoring, robotics, and technology-enabled rural care delivery." },
    { initiative:"Workforce Development", fit:"Strong", reason:"Ambient AI documentation saves 3+ hours/shift per floor — directly reduces clinician burnout and extends rural workforce capacity without adding staff." },
    { initiative:"Telehealth", fit:"Strong", reason:"Platform enables virtual rounding, remote consultations, and specialist access — exactly the telehealth routing and specialty access rural hospitals need." },
    { initiative:"Chronic Disease", fit:"Moderate", reason:"Remote patient monitoring and predictive care tools support chronic disease management programs aligned with CMS prevention goals." },
    { initiative:"Rural Hospital Support", fit:"Strong", reason:"Deployed at rural health systems (Ballad Health serves rural Appalachia). Reduces operational costs by up to 70% — critical for financially strained rural hospitals." },
    { initiative:"Behavioral Health", fit:"Moderate", reason:"Virtual consultation routing can connect rural patients with behavioral health specialists, addressing access gaps CMS identifies as a key RHTP priority." },
    { initiative:"Facility Modernization", fit:"Moderate", reason:"Cloud-based EHR-integrated platform supports states funding technology infrastructure modernization at rural facilities." },
  ]
};

const PSYNERGY = {
  name:"Psynergy Health",
  url:"https://psynergy.health",
  tagline:"Virtual clinical workforce & care coordination services",
  color:"#065f46", bg:"#f0fdf4", border:"#86efac",
  capabilities:[
    "Virtual nursing — remote RNs supporting assessments, monitoring, documentation, and coordination",
    "Virtual physicians and advanced practice providers (APPs) deployed to rural hospitals",
    "AI-enabled triage and telehealth routing to right-level care",
    "Remote specialty consultation — giving small hospitals access to specialist expertise",
    "Continuous remote patient monitoring — fall prevention, sitter cost reduction, staff safety",
    "Ambient AI documentation integrated with virtual workforce services",
    "Flexible staffing models — scale clinical capacity without increasing administrative burden",
    "Interoperability platform for fragmented rural patient data",
    "Founded 2023, Orlando FL — specifically designed for rural health transformation (announced March 9, 2026)",
    "CMS RHTP alignment announced publicly at HIMSS 2026 (booth 5639)"
  ],
  rhtAlignment:[
    { initiative:"Workforce Development", fit:"Strong", reason:"Core product: virtual clinical workforce (RNs, physicians, APPs) that augments rural clinical teams without requiring local hiring — directly solves rural staffing shortages CMS prioritizes." },
    { initiative:"Telehealth", fit:"Strong", reason:"AI-enabled triage, telehealth routing, and remote specialty consultation are Psynergy's primary service lines — textbook fit for RHTP telehealth initiatives." },
    { initiative:"Rural Hospital Support", fit:"Strong", reason:"Designed explicitly for rural hospitals. Reduces ED overutilization and avoidable hospitalizations. Helps small hospitals access specialist expertise equivalent to major urban centers." },
    { initiative:"Chronic Disease", fit:"Strong", reason:"Remote monitoring and predictive care programs identify and manage chronic diseases earlier, reducing readmissions and lowering healthcare costs — CMS's stated RHTP goal." },
    { initiative:"Technology Innovation", fit:"Strong", reason:"Combines ambient AI, interoperability, and virtual workforce — satisfies CMS technology innovation and advanced technology priorities under the RHTP." },
    { initiative:"Behavioral Health", fit:"Moderate", reason:"Virtual APPs and specialty routing can include behavioral health providers, extending mental health access to underserved rural populations." },
    { initiative:"FQHC / Community Health", fit:"Moderate", reason:"Virtual staffing models can support FQHCs and community health centers facing workforce shortages — applicable to state RFPs targeting CHC capacity." },
  ]
};

const RFP_OPPORTUNITIES = [
  { state:"South Dakota", abbr:"SD", rfp:"RFP #26-09RHT-022 — Workforce Stakeholder & PM", status:"Open now", award:"Up to $500K (Year 1, renewable)", initiatives:["Workforce Development","Technology Innovation"], andorFit:"Moderate", psynergyFit:"Strong", andorNote:"Andor's ThinkAndor® platform can serve as the technology backbone for the workforce/PM contractor — supporting stakeholder communication and workflow tools.", psynergyNote:"Direct fit: Psynergy's virtual clinical workforce and staffing model expertise aligns perfectly with the workforce planning, EMS expansion, and program administration requirements.", portalUrl:"https://doh.sd.gov/rhtp" },
  { state:"South Dakota", abbr:"SD", rfp:"Round 2 — Digital Health Modernization, Doula Workforce, Caregiver Support", status:"Open now", award:"~$100M pool", initiatives:["Technology Innovation","Maternal & Doula","Workforce Development"], andorFit:"Strong", psynergyFit:"Strong", andorNote:"ThinkAndor®'s ambient AI and virtual care infrastructure is a direct fit for digital health modernization. Virtual rounding supports caregiver programs.", psynergyNote:"Psynergy's virtual clinical staffing supports doula workforce expansion and caregiver coordination — highly applicable to these specific RFP categories.", portalUrl:"https://doh.sd.gov/rhtp" },
  { state:"Nevada", abbr:"NV", rfp:"Rural Health Innovation & Technology (RHIT) Grant", status:"Open now — Awards September 2026", award:"~$100M pool", initiatives:["Technology Innovation","Telehealth","Workforce Development"], andorFit:"Strong", psynergyFit:"Strong", andorNote:"ThinkAndor® is purpose-built for the RHIT grant criteria: AI, remote monitoring, rural telehealth, and technology-enabled care delivery. Strong KLAS and Frost & Sullivan validation.", psynergyNote:"Psynergy's virtual workforce and AI-enabled triage services directly address rural technology and workforce capacity — exactly what Nevada's RHIT grant funds.", portalUrl:"https://dhhs.nv.gov/rhtp" },
  { state:"Indiana", abbr:"IN", rfp:"GROW Regional Grants — Growing Rural Opportunities for Well-being", status:"Open now — rolling", award:"~$100M pool", initiatives:["FQHC / Community Health","Workforce Development","Technology Innovation"], andorFit:"Moderate", psynergyFit:"Strong", andorNote:"Andor's virtual nursing and ambient documentation tools can be embedded in GROW regional health initiatives to improve clinician efficiency and access.", psynergyNote:"GROW's regional workforce and community health focus maps directly to Psynergy's virtual staffing and care coordination platform — strong case for GROW partnership.", portalUrl:"https://www.in.gov/fssa/rhtp" },
  { state:"North Carolina", abbr:"NC", rfp:"Rural Health Innovation Fund — multiple initiative RFPs", status:"Open now — rolling", award:"$213M Year 1 / ~$1B+ total", initiatives:["Workforce Development","Technology Innovation","Behavioral Health","Rural Hospital Support"], andorFit:"Strong", psynergyFit:"Strong", andorNote:"NC's Rural Innovation Fund prioritizes behavioral health access and technology — ThinkAndor®'s virtual consultation routing and ambient documentation are directly applicable.", psynergyNote:"NC codified behavioral health access as a key RHTP pillar. Psynergy's virtual behavioral health provider staffing addresses the specific gaps NC's law targets.", portalUrl:"https://ncdhhs.gov/rhtp" },
  { state:"Washington", abbr:"WA", rfp:"Multiple RFPs via WEBS — Hospital Innovation, Tribal Health, Disease Prevention", status:"Active now on WEBS — registration required", award:"$181M Year 1", initiatives:["Rural Hospital Support","FQHC / Community Health","Tribal Health","Workforce Development"], andorFit:"Strong", psynergyFit:"Strong", andorNote:"WA's hospital innovation and technology initiatives align directly with ThinkAndor®'s deployed capabilities. Prior rural health system deployments (Ballad Health) provide proof of concept.", psynergyNote:"WA's Tribal health and workforce initiatives are a natural fit for Psynergy's flexible virtual staffing — particularly for tribal facilities lacking on-site specialty staff.", portalUrl:"https://fortress.wa.gov/ga/webs" },
  { state:"West Virginia", abbr:"WV", rfp:"Multiple RFPs — Workforce, Technology, Rural Hospital Support", status:"Active on DHHR portal now", award:"$199M", initiatives:["Workforce Development","Technology Innovation","Rural Hospital Support"], andorFit:"Strong", psynergyFit:"Strong", andorNote:"WV's rural Appalachian hospital network faces extreme staffing shortfalls — ThinkAndor®'s virtual nursing and ambient AI tools are purpose-built for this scenario. Ballad Health (WV/TN) already deployed.", psynergyNote:"WV is among the most acute rural workforce shortage states. Psynergy's virtual physician and APP model directly addresses WV's documented clinical capacity gaps.", portalUrl:"https://dhhr.wv.gov/rhtp" },
  { state:"New Jersey", abbr:"NJ", rfp:"RHTP 2026: Technology, Prevention & Workforce Capacity RFA (next round expected Q3 2026)", status:"Next round Q3 2026", award:"~$100M", initiatives:["Technology Innovation","Prevention","Workforce Development"], andorFit:"Strong", psynergyFit:"Moderate", andorNote:"NJ's explicit focus on 'Advancing Technology' directly matches ThinkAndor®'s AI platform. NJ also published a Vendor Resource Directory — Andor should seek listing.", psynergyNote:"NJ's workforce capacity track is a fit for Psynergy's virtual staffing, though NJ has less extreme rural workforce shortages than other states.", portalUrl:"https://www.nj.gov/health/rhtp" },
  { state:"Alaska", abbr:"AK", rfp:"2nd LOI Window — Tribal & Rural Health, Workforce, Remote Care", status:"Late Summer 2026", award:"$272M Year 1 / ~$1.36B total", initiatives:["Tribal Health","Workforce Development","Technology Innovation"], andorFit:"Strong", psynergyFit:"Strong", andorNote:"AK's massive geographic challenge makes virtual care essential — ThinkAndor®'s remote monitoring and virtual rounding are critical tools for Alaska Native and rural Alaskan hospitals.", psynergyNote:"Alaska's rural-frontier-tribal care gaps are the exact use case Psynergy was built for. Virtual physicians and APPs can serve remote communities that cannot recruit on-site providers.", portalUrl:"https://health.alaska.gov/rhtp" },
  { state:"Ohio", abbr:"OH", rfp:"Multiple initiative RFPs — Workforce, Technology, Chronic Disease", status:"Open now — rolling", award:"~$100M+", initiatives:["Workforce Development","Technology Innovation","Chronic Disease"], andorFit:"Strong", psynergyFit:"Strong", andorNote:"Ohio's chronic disease and technology priorities align with ThinkAndor®'s remote monitoring and predictive analytics capabilities for rural population health.", psynergyNote:"Ohio's workforce and chronic disease initiatives benefit from Psynergy's virtual clinical team model — especially remote monitoring programs for high-burden chronic conditions.", portalUrl:"https://medicaid.ohio.gov/rhtp" },
];

const fitColor = { Strong:"#16a34a", Moderate:"#d97706", Limited:"#9ca3af" };
const fitBg = { Strong:"#dcfce7", Moderate:"#fef3c7", Limited:"#f3f4f6" };

function Pill({ color, bg, children, icon }) {
  return <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:bg, color, whiteSpace:"nowrap" }}>{icon && <i className={`ti ${icon}`} style={{ fontSize:11 }} aria-hidden="true" />}{children}</span>;
}

function SubPill({ url, label }) {
  if (!url) return <span style={{ fontSize:11, color:"#9ca3af" }}>TBD</span>;
  const isEmail = url.startsWith("mailto:");
  return (
    <a href={url} target={isEmail ? undefined : "_blank"} rel="noopener noreferrer"
      style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:"#dbeafe", color:"#1e40af", textDecoration:"none", whiteSpace:"nowrap" }}>
      <i className={`ti ${isEmail ? "ti-mail" : "ti-browser"}`} style={{ fontSize:11 }} aria-hidden="true" />
      {label}
      <i className="ti ti-arrow-up-right" style={{ fontSize:10 }} aria-hidden="true" />
    </a>
  );
}

function StateCard({ s, onClick }) {
  const isEmail = s.portalUrl?.startsWith("mailto:");
  return (
    <button onClick={() => onClick(s)}
      style={{ width:"100%", textAlign:"left", cursor:"pointer", background:"#ffffff", border:"2px solid #d1d5db", borderRadius:10, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10, transition:"all 0.15s", boxShadow:"0 1px 3px rgba(0,0,0,0.07)", position:"relative" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor="#3b82f6"; e.currentTarget.style.boxShadow="0 2px 8px rgba(59,130,246,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor="#d1d5db"; e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.07)"; }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div>
          <p style={{ margin:0, fontWeight:700, fontSize:15, color:"#111827" }}>{s.name}</p>
          <p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280", fontWeight:600 }}>{s.abbr}</p>
        </div>
        {s.status==="active" ? <Pill color="#065f46" bg="#dcfce7" icon="ti-circle-check">Active</Pill> : <Pill color="#92400e" bg="#fef3c7" icon="ti-clock">Pending</Pill>}
      </div>
      <div style={{ borderTop:"1.5px solid #e5e7eb", paddingTop:10 }}>
        <p style={{ margin:"0 0 4px", fontSize:12, color:"#374151", lineHeight:1.4 }}>{s.agency}</p>
        <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#111827" }}>{s.award}</p>
      </div>
      <div style={{ borderTop:"1.5px solid #e5e7eb", paddingTop:8, display:"flex", flexDirection:"column", gap:6 }}>
        {s.status==="active" ? (
          <>
            <div onClick={e => e.stopPropagation()}>
              <SubPill url={s.portalUrl} label={isEmail ? "Email to apply" : "Open portal"} />
            </div>
            <p style={{ margin:0, fontSize:11, color:"#6b7280" }}><i className="ti ti-calendar" style={{ fontSize:11, marginRight:3 }} aria-hidden="true" />{s.deadline?.length > 40 ? s.deadline.slice(0,40)+"…" : s.deadline}</p>
          </>
        ) : (
          <p style={{ margin:0, fontSize:12, color:"#92400e", fontWeight:500 }}><i className="ti ti-calendar" style={{ fontSize:12, marginRight:4 }} aria-hidden="true" />Est. release: {s.anticipatedRelease}</p>
        )}
        <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
          {s.initiatives.slice(0,2).map(i => <span key={i} style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:"#f3f4f6", color:"#374151", border:"1px solid #d1d5db", fontWeight:500 }}>{i}</span>)}
        </div>
      </div>
    </button>
  );
}

function Overlay({ s, onClose }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiUpdate, setAiUpdate] = useState(null);
  const [aiError, setAiError] = useState(null);

  const isEmail = s.portalUrl?.startsWith("mailto:");

  async function fetchLive() {
    setAiLoading(true); setAiError(null); setAiUpdate(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          messages:[{ role:"user", content:`Search the web right now for the latest Rural Health Transformation Program (RHTP) news for ${s.name} state. Find: any new RFPs, exact deadline dates, new funding announcements, portal or submission changes from the past 60 days. State agency: ${s.agency}. Return ONLY valid JSON: { "latestNews":"1-2 sentence summary", "newRfps":["list new RFPs, or empty"], "deadlineUpdates":"exact date if found like 'July 15, 2026', or null", "submissionChanges":"changes to how/where to submit, or null", "exactDate":"exact publication date as 'Month DD, YYYY'", "sourceUrl":"URL", "sourceTitle":"source title" }. No markdown, no backticks.` }]
        })
      });
      const data = await res.json();
      const text = data.content.map(i=>i.text||"").filter(Boolean).join("\n");
      setAiUpdate(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch(e) { setAiError("Live search failed — please try again."); }
    setAiLoading(false);
  }

  const steps = [
    { n:1, icon:"ti-browser", title:`Visit ${s.name}'s RHTP page`, body:`Navigate to ${s.agency}'s official RHTP webpage. This is where all state-specific RFPs, NOFOs, timelines, FAQs, and webinar recordings are posted.${s.portalUrl ? ` Direct link: ${s.portalUrl}` : ""}` },
    { n:2, icon:"ti-file-download", title:"Download all required documents", body:`For each ${s.name} opportunity: download the RFP/NOFO document, state program timeline, budget narrative template, scoring rubric (if posted), and any addenda. ${s.name} may post updated Q&A documents after release — check back regularly.` },
    { n:3, icon:"ti-checklist", title:"Confirm eligibility for this state", body:`${s.name} RFPs are typically open to: healthcare providers, FQHCs, community-based organizations, tribal organizations (${s.initiatives.includes("Tribal Health") ? "specifically noted for this state" : "where applicable"}), universities, and nonprofits. Each RFP specifies its own eligible applicant types.` },
    { n:4, icon:"ti-send", title:`How ${s.name} receives applications`, body:`Submission method: ${s.submission || "TBD"}. ${s.portalUrl ? `Submit at: ${s.portalUrl}. ${isEmail ? "Prepare your application as a PDF or per the RFP spec and email to the listed address." : "Register for the portal early — account setup can take several business days."}` : "Check the state RHTP page for submission instructions as they are announced."}` },
    { n:5, icon:"ti-video", title:`Attend ${s.name} informational webinars`, body:`${s.name} hosts webinars or information sessions before application deadlines. These cover scoring criteria, eligible activities, required forms, and Q&A. Recordings are typically posted on ${s.agency}'s RHTP page. Register early — seats may be limited.` },
    { n:6, icon:"ti-edit", title:"Prepare your application", body:`Typical ${s.name} requirements: project narrative tied to the state's specific RHTP strategic goals (${s.initiatives.join(", ")}), budget narrative, organizational qualifications, data on rural population served, letters of support from local health system partners.` },
    { n:7, icon:"ti-clock", title:`Meet ${s.name}'s deadlines`, body:`${s.status==="active" ? `Current deadline: ${s.deadline}. Submit${s.portalUrl ? ` via ${s.portalUrl}` : ""} well before the deadline — portal uploads and email attachments can fail at the last minute.` : `${s.name} has not yet released its RFPs. Estimated release: ${s.anticipatedRelease}. Set a calendar reminder to check ${s.portalUrl || "the state RHTP page"} weekly.`}` },
  ];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"1.5rem 1rem", overflowY:"auto", background:"rgba(0,0,0,0.72)" }} onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:"#ffffff", borderRadius:14, border:"2px solid #e5e7eb", width:"100%", maxWidth:660, padding:"1.75rem", boxShadow:"0 25px 60px rgba(0,0,0,0.35)", marginBottom:"2rem" }} onClick={e => e.stopPropagation()}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <h2 style={{ margin:0, fontSize:22, fontWeight:800, color:"#111827" }}>{s.name} <span style={{ fontSize:15, color:"#6b7280", fontWeight:500 }}>({s.abbr})</span></h2>
            <p style={{ margin:"4px 0 0", fontSize:13, color:"#6b7280" }}>{s.agency}</p>
          </div>
          <button onClick={onClose} aria-label="Close state details" style={{ background:"#111827", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", padding:"7px 12px", fontSize:16, fontWeight:700, lineHeight:1, display:"flex", alignItems:"center", gap:5 }}>
            <i className="ti ti-x" style={{ fontSize:16 }} /> Close
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
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
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#1e40af" }}>{isEmail ? "Apply via email" : "Submit via portal"}</p>
              <p style={{ margin:0, fontSize:12, color:"#1e3a8a" }}>{s.portalUrl}</p>
            </div>
            <a href={s.portalUrl} target={isEmail?undefined:"_blank"} rel="noopener noreferrer"
              style={{ fontSize:13, padding:"8px 16px", background:"#2563eb", color:"#fff", border:"none", borderRadius:7, textDecoration:"none", fontWeight:700, whiteSpace:"nowrap" }}>
              {isEmail ? "Open email" : "Open portal"} <i className="ti ti-arrow-up-right" style={{ fontSize:13 }} />
            </a>
          </div>
        )}

        <div style={{ marginBottom:14 }}>
          <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700, color:"#111827" }}>Key initiatives for this state</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {s.initiatives.map(i => <span key={i} style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#f3f4f6", color:"#374151", border:"1px solid #d1d5db", fontWeight:600 }}>{i}</span>)}
          </div>
        </div>

        <div style={{ marginBottom:14, padding:"12px 14px", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:8 }}>
          <p style={{ margin:"0 0 4px", fontSize:12, fontWeight:700, color:"#92400e" }}>Program notes</p>
          <p style={{ margin:0, fontSize:13, color:"#78350f", lineHeight:1.6 }}>{s.notes}</p>
        </div>

        <div style={{ marginBottom:16 }}>
          <p style={{ margin:"0 0 12px", fontSize:14, fontWeight:700, color:"#111827" }}>How to apply in {s.name} — step by step</p>
          {steps.map(st => (
            <div key={st.n} style={{ display:"flex", gap:12, marginBottom:12 }}>
              <div style={{ flexShrink:0, width:28, height:28, borderRadius:"50%", background:"#2563eb", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{st.n}</span>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 3px", fontWeight:700, fontSize:13, color:"#111827" }}><i className={`ti ${st.icon}`} style={{ fontSize:13, marginRight:5, color:"#6b7280" }} />{st.title}</p>
                <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.6 }}>{st.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:14, padding:"12px 14px", background:"#f0fdf4", border:"1.5px solid #86efac", borderRadius:8, display:"flex", justifyContent:"space-between", alignItems:"center", gap:10 }}>
          <div>
            <p style={{ margin:0, fontSize:13, fontWeight:700, color:"#14532d" }}>Live AI update for {s.name}</p>
            <p style={{ margin:0, fontSize:12, color:"#166534" }}>Search for the latest announcements right now</p>
          </div>
          <button onClick={fetchLive} disabled={aiLoading} style={{ fontSize:12, padding:"7px 14px", background:"#16a34a", color:"#fff", border:"none", borderRadius:7, cursor:aiLoading?"wait":"pointer", fontWeight:700, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:6 }}>
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
            {aiUpdate.newRfps?.length>0 && <div style={{ marginBottom:8 }}>{aiUpdate.newRfps.map((r,i) => <p key={i} style={{ margin:"2px 0", fontSize:12 }}>• {r}</p>)}</div>}
            {aiUpdate.deadlineUpdates && <p style={{ margin:"4px 0 0", fontSize:12 }}><strong>Deadline update:</strong> {aiUpdate.deadlineUpdates}</p>}
            {aiUpdate.sourceUrl && <a href={aiUpdate.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"#16a34a", display:"inline-flex", alignItems:"center", gap:4, marginTop:8, fontWeight:700 }}>{aiUpdate.sourceTitle||"Source"} <i className="ti ti-arrow-up-right" style={{ fontSize:11 }} /></a>}
          </div>
        )}
        {aiError && <div style={{ marginBottom:12, padding:"10px 14px", background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, fontSize:13, color:"#991b1b" }}>{aiError}</div>}

        {s.status==="active" && (
          <div>
            <p style={{ margin:"0 0 8px", fontSize:13, fontWeight:700, color:"#111827" }}>Key documents</p>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                { label:"State RFP / application page", url:s.rfpUrl, icon:"ti-clipboard-list" },
                { label:"CMS NOFO (federal)", url:s.nofoUrl, icon:"ti-file-text" },
                { label:"NRHA real-time tracker", url:NRHA_TRACKER, icon:"ti-map" },
              ].map(({label,url,icon}) => (
                <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:8, border:"1px solid #d1d5db", color:"#111827", textDecoration:"none", fontSize:13, fontWeight:600, background:"#ffffff" }}
                  onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
                  onMouseLeave={e=>e.currentTarget.style.background="#ffffff"}
                >
                  <i className={`ti ${icon}`} style={{ fontSize:16, color:"#6b7280" }} />{label}
                  <i className="ti ti-arrow-up-right" style={{ fontSize:13, marginLeft:"auto", color:"#9ca3af" }} />
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop:16, padding:"10px 14px", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:8 }}>
          <p style={{ margin:0, fontSize:12, color:"#92400e" }}><i className="ti ti-alert-triangle" style={{ fontSize:12, marginRight:5 }} /><strong>Always verify</strong> deadlines and requirements directly with {s.agency} before applying.</p>
        </div>
      </div>
    </div>
  );
}

function DeadlineTracker() {
  const sections = [
    { label:"Open now — accepting applications", items: DEADLINE_ROWS.filter(d=>d.urgency==="open"), color:"#16a34a", icon:"ti-circle-check" },
    { label:"Upcoming — watch these dates", items: DEADLINE_ROWS.filter(d=>d.urgency==="upcoming"), color:"#d97706", icon:"ti-clock" },
    { label:"Watch for next round", items: DEADLINE_ROWS.filter(d=>d.urgency==="watch"), color:"#2563eb", icon:"ti-eye" },
    { label:"Not yet released — pending states", items: DEADLINE_ROWS.filter(d=>d.urgency==="pending"), color:"#9ca3af", icon:"ti-minus" },
  ];
  return (
    <div>
      <div style={{ marginBottom:16, padding:"12px 14px", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:8, fontSize:13, color:"#92400e" }}>
        <i className="ti ti-info-circle" style={{ fontSize:14, marginRight:6 }} /><strong>Note:</strong> Many state RFPs use rolling or portal-based deadlines. The "next due" dates shown are the earliest estimated close dates based on state announcements as of June 2026. Use the Live Feed tab or the "Check now" button on each state card for real-time exact dates. Always verify with the state agency.
      </div>
      {sections.map(sec => (
        <div key={sec.label} style={{ marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 12px", borderRadius:8, background:sec.color+"18", borderLeft:`4px solid ${sec.color}` }}>
            <i className={`ti ${sec.icon}`} style={{ fontSize:16, color:sec.color }} /><p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>{sec.label} <span style={{ fontWeight:500, color:"#6b7280" }}>({sec.items.length})</span></p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {sec.items.map(d => (
              <div key={d.abbr} style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"12px 14px", display:"grid", gridTemplateColumns:"1fr 1fr auto", gap:12, alignItems:"start", boxShadow:"0 1px 2px rgba(0,0,0,0.04)" }}>
                <div>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>{d.name}</p>
                  <p style={{ margin:"2px 0 4px", fontSize:11, color:"#6b7280", fontWeight:600 }}>{d.award}</p>
                  {d.portalUrl ? (
                    <a href={d.portalUrl} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:11, fontWeight:700, color:"#1e40af", background:"#dbeafe", padding:"2px 8px", borderRadius:10, textDecoration:"none" }}>
                      <i className="ti ti-browser" style={{ fontSize:10 }} /> Open portal <i className="ti ti-arrow-up-right" style={{ fontSize:10 }} />
                    </a>
                  ) : <span style={{ fontSize:11, color:"#9ca3af" }}>Portal TBD</span>}
                </div>
                <div>
                  <p style={{ margin:"0 0 3px", fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:0.4 }}>Current status</p>
                  <p style={{ margin:"0 0 6px", fontSize:12, color:"#111827", fontWeight:600 }}>{d.specificDate}</p>
                  <p style={{ margin:0, fontSize:11, fontWeight:700, color:"#374151", textTransform:"uppercase", letterSpacing:0.4 }}>Next due date</p>
                  <p style={{ margin:"2px 0 0", fontSize:12, color:"#1e40af", fontWeight:700 }}>{d.nextDue}</p>
                </div>
                <Pill color={sec.color} bg={sec.color+"18"} icon={sec.icon}>{sec.label.split("—")[0].trim()}</Pill>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CompanyMatch() {
  const [view, setView] = useState("overview");
  const [rfpFilter, setRfpFilter] = useState("all");

  function CompanyCard({ co }) {
    return (
      <div style={{ background:co.bg, border:`2px solid ${co.border}`, borderRadius:12, padding:"1.25rem", marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
          <div>
            <h3 style={{ margin:0, fontSize:18, fontWeight:800, color:co.color }}>{co.name}</h3>
            <p style={{ margin:"3px 0 0", fontSize:13, color:"#374151" }}>{co.tagline}</p>
          </div>
          <a href={co.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize:12, padding:"6px 12px", background:co.color, color:"#fff", borderRadius:7, textDecoration:"none", fontWeight:700, whiteSpace:"nowrap" }}>
            Website <i className="ti ti-arrow-up-right" style={{ fontSize:11 }} />
          </a>
        </div>
        <div style={{ marginBottom:12 }}>
          <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:co.color }}>Core capabilities (public record)</p>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {co.capabilities.map((c,i) => <p key={i} style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.5 }}>• {c}</p>)}
          </div>
        </div>
        <div>
          <p style={{ margin:"0 0 8px", fontSize:12, fontWeight:700, color:co.color }}>RHT initiative alignment</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {co.rhtAlignment.map((a,i) => (
              <div key={i} style={{ background:"#ffffff", border:"1px solid #e5e7eb", borderRadius:8, padding:"10px 12px", display:"flex", alignItems:"flex-start", gap:10 }}>
                <div style={{ minWidth:80 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:fitColor[a.fit], background:fitBg[a.fit], padding:"2px 7px", borderRadius:10 }}>{a.fit} fit</span>
                  <p style={{ margin:"4px 0 0", fontSize:11, fontWeight:700, color:"#374151" }}>{a.initiative}</p>
                </div>
                <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.5 }}>{a.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredRfps = rfpFilter==="all" ? RFP_OPPORTUNITIES : RFP_OPPORTUNITIES.filter(r => r.andorFit===rfpFilter||r.psynergyFit===rfpFilter);

  return (
    <div>
      <div style={{ marginBottom:16, padding:"12px 16px", background:"#eff6ff", border:"2px solid #bfdbfe", borderRadius:10 }}>
        <p style={{ margin:"0 0 4px", fontSize:14, fontWeight:700, color:"#1e40af" }}>Andor Health & Psynergy Health — RHT Applicability Analysis</p>
        <p style={{ margin:0, fontSize:13, color:"#1e3a8a", lineHeight:1.6 }}>Based entirely on public information. This analysis maps each company's publicly stated capabilities to open and upcoming RHT RFPs across all 50 states.</p>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:16, borderBottom:"1.5px solid #e5e7eb", paddingBottom:12 }}>
        {[["overview","Company overview"],["rfps","RFP match matrix"]].map(([id,label]) => (
          <button key={id} onClick={()=>setView(id)} style={{ padding:"8px 16px", fontSize:13, fontWeight:view===id?700:500, border:"none", borderBottom:view===id?"3px solid #2563eb":"3px solid transparent", background:"none", cursor:"pointer", color:view===id?"#2563eb":"#6b7280", marginBottom:-13 }}>
            {label}
          </button>
        ))}
      </div>

      {view==="overview" && (
        <div>
          <CompanyCard co={ANDOR} />
          <CompanyCard co={PSYNERGY} />
          <div style={{ padding:"12px 14px", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, fontSize:12, color:"#6b7280", marginTop:8 }}>
            <i className="ti ti-info-circle" style={{ fontSize:13, marginRight:5 }} />This analysis is based solely on publicly available information including company websites, press releases, KLAS ratings, and news coverage. It does not constitute an endorsement or partnership claim.
          </div>
        </div>
      )}

      {view==="rfps" && (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
            <p style={{ margin:0, fontSize:13, fontWeight:600, color:"#374151" }}>Filter by fit level:</p>
            {["all","Strong","Moderate"].map(f => (
              <button key={f} onClick={()=>setRfpFilter(f)} style={{ padding:"6px 14px", fontSize:12, fontWeight:rfpFilter===f?700:500, border:"1.5px solid", borderColor:rfpFilter===f?"#2563eb":"#d1d5db", borderRadius:20, background:rfpFilter===f?"#eff6ff":"#fff", cursor:"pointer", color:rfpFilter===f?"#1e40af":"#374151" }}>
                {f==="all"?"All RFPs":f+" fit"}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {filteredRfps.map((r,i) => (
              <div key={i} style={{ background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"14px 16px", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                  <div>
                    <p style={{ margin:0, fontSize:15, fontWeight:800, color:"#111827" }}>{r.state}</p>
                    <p style={{ margin:"3px 0 0", fontSize:13, color:"#374151", fontWeight:600 }}>{r.rfp}</p>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background: r.status.includes("Open")?"#dcfce7":"#fef3c7", color: r.status.includes("Open")?"#065f46":"#92400e" }}>{r.status}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:20, background:"#f3f4f6", color:"#374151" }}>{r.award}</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:10 }}>
                  {r.initiatives.map(ini => <span key={ini} style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:"#f3f4f6", color:"#374151", border:"1px solid #d1d5db", fontWeight:600 }}>{ini}</span>)}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                  <div style={{ background:ANDOR.bg, border:`1px solid ${ANDOR.border}`, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:fitColor[r.andorFit], background:fitBg[r.andorFit], padding:"2px 7px", borderRadius:10 }}>{r.andorFit} fit</span>
                      <p style={{ margin:0, fontSize:12, fontWeight:700, color:ANDOR.color }}>Andor Health</p>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.5 }}>{r.andorNote}</p>
                  </div>
                  <div style={{ background:PSYNERGY.bg, border:`1px solid ${PSYNERGY.border}`, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:fitColor[r.psynergyFit], background:fitBg[r.psynergyFit], padding:"2px 7px", borderRadius:10 }}>{r.psynergyFit} fit</span>
                      <p style={{ margin:0, fontSize:12, fontWeight:700, color:PSYNERGY.color }}>Psynergy Health</p>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:"#374151", lineHeight:1.5 }}>{r.psynergyNote}</p>
                  </div>
                </div>
                <a href={r.portalUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, color:"#1e40af", background:"#dbeafe", padding:"5px 12px", borderRadius:7, textDecoration:"none" }}>
                  <i className="ti ti-browser" style={{ fontSize:12 }} /> Open portal <i className="ti ti-arrow-up-right" style={{ fontSize:11 }} />
                </a>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, padding:"10px 14px", background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, fontSize:12, color:"#6b7280" }}>
            <i className="ti ti-info-circle" style={{ fontSize:12, marginRight:5 }} />Based on public information only. Fit ratings reflect capability alignment with publicly stated RFP requirements — not guaranteed outcomes.
          </div>
        </div>
      )}
    </div>
  );
}

function LiveFeed() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [lastRun, setLastRun] = useState(null);

  async function runScan() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          tools:[{ type:"web_search_20250305", name:"web_search" }],
          messages:[{ role:"user", content:`Search the web right now for the latest Rural Health Transformation Program (RHTP) news published in the last 30 days. Look for: new state RFP releases with exact dates, updated deadlines, new funding announcements, new state program launches, CMS updates. Return ONLY a valid JSON array of up to 6 items: [{ "state":"state name or 'Federal / CMS'", "headline":"under 12 words", "detail":"1-2 sentences", "type":"new_rfp|deadline|funding|announcement|cms_update", "url":"source URL", "exactDate":"Month DD, YYYY — the exact article or release publication date" }]. Raw JSON array only, no markdown.` }]
        })
      });
      const data = await res.json();
      const text = data.content.map(i=>i.text||"").filter(Boolean).join("\n");
      setResults(JSON.parse(text.replace(/```json|```/g,"").trim()));
      setLastRun(new Date().toLocaleString());
    } catch(e) { setError("Live scan failed. Try again."); }
    setLoading(false);
  }

  const typeMap = { new_rfp:{bg:"#dcfce7",color:"#065f46",label:"New RFP",icon:"ti-file-plus"}, deadline:{bg:"#fee2e2",color:"#991b1b",label:"Deadline",icon:"ti-clock"}, funding:{bg:"#dbeafe",color:"#1e40af",label:"Funding",icon:"ti-coin"}, announcement:{bg:"#fef3c7",color:"#92400e",label:"Announcement",icon:"ti-speakerphone"}, cms_update:{bg:"#f3e8ff",color:"#6b21a8",label:"CMS Update",icon:"ti-building"} };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <div>
          <p style={{ margin:0, fontSize:15, fontWeight:700, color:"#111827" }}>Live news feed</p>
          <p style={{ margin:0, fontSize:13, color:"#6b7280" }}>AI-powered web scan — latest RHTP news across all states</p>
        </div>
        <button onClick={runScan} disabled={loading} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, padding:"9px 18px", background:"#2563eb", color:"#fff", border:"none", borderRadius:8, cursor:loading?"wait":"pointer", fontWeight:700 }}>
          {loading ? <><i className="ti ti-loader-2" style={{ fontSize:15 }} /> Scanning…</> : <><i className="ti ti-refresh" style={{ fontSize:15 }} /> Run live scan</>}
        </button>
      </div>
      {!results.length && !loading && !error && (
        <div style={{ padding:"2.5rem", textAlign:"center", background:"#f9fafb", borderRadius:12, border:"2px dashed #d1d5db" }}>
          <i className="ti ti-satellite" style={{ fontSize:36, color:"#9ca3af", display:"block", marginBottom:10 }} />
          <p style={{ margin:0, fontSize:15, fontWeight:700, color:"#374151" }}>Ready to scan</p>
          <p style={{ margin:"6px 0 0", fontSize:13, color:"#6b7280" }}>Click "Run live scan" to search the web for the latest RHTP news right now.</p>
        </div>
      )}
      {error && <div style={{ padding:"12px 16px", background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:8, fontSize:13, color:"#991b1b", fontWeight:600 }}>{error}</div>}
      {loading && [1,2,3,4].map(i => <div key={i} style={{ height:76, background:"#f9fafb", borderRadius:8, border:"1px solid #e5e7eb", marginBottom:8 }} />)}
      {results.length>0 && (
        <>
          <div style={{ marginBottom:12, padding:"8px 12px", background:"#f0fdf4", border:"1px solid #86efac", borderRadius:8 }}>
            <p style={{ margin:0, fontSize:12, color:"#166534", fontWeight:700 }}><i className="ti ti-check" style={{ fontSize:13, marginRight:5 }} />Scan completed: {lastRun}</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {results.map((item,i) => {
              const ts = typeMap[item.type]||typeMap.announcement;
              return (
                <div key={i} style={{ padding:"14px 16px", background:"#fff", borderRadius:8, border:"1.5px solid #e5e7eb", display:"flex", gap:12, alignItems:"flex-start", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:ts.bg, color:ts.color, whiteSpace:"nowrap", marginTop:3, flexShrink:0, fontWeight:700 }}><i className={`ti ${ts.icon}`} style={{ fontSize:11, marginRight:3 }} />{ts.label}</span>
                  <div style={{ flex:1, minWidth:0 }}>
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

const TABS = [
  { id:"states", label:"States directory", icon:"ti-map" },
  { id:"live", label:"Live feed", icon:"ti-radio" },
  { id:"deadlines", label:"Deadline tracker", icon:"ti-calendar-event" },
  { id:"company", label:"Andor & Psynergy", icon:"ti-building-hospital" },
  { id:"resources", label:"Key resources", icon:"ti-link" },
];

export default function App() {
  const [tab, setTab] = useState("states");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [initiativeFilter, setInitiativeFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = BASE_STATES.filter(s => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) || s.abbr.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter==="all" || s.status===statusFilter;
    const mi = initiativeFilter==="all" || s.initiatives.includes(initiativeFilter);
    return ms && mf && mi;
  });
  const filtActive = filtered.filter(s=>s.status==="active");
  const filtPending = filtered.filter(s=>s.status==="pending");

  return (
    <div style={{ fontFamily:"system-ui,-apple-system,sans-serif", background:"#f3f4f6", minHeight:"100vh", padding:"1.5rem 1rem 4rem" }}>
      <div style={{ maxWidth:920, margin:"0 auto" }}>

        <div style={{ background:"#1e3a8a", borderRadius:12, padding:"1.5rem", marginBottom:"1.25rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:"#fff" }}>RHT RFP Central Hub</h1>
              <p style={{ margin:"4px 0 0", fontSize:13, color:"#bfdbfe" }}>Rural Health Transformation Program · All 50 states · AI-powered live updates</p>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#16a34a", color:"#fff", fontWeight:700 }}>{BASE_STATES.filter(s=>s.status==="active").length} Active</span>
              <span style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#d97706", color:"#fff", fontWeight:700 }}>{BASE_STATES.filter(s=>s.status==="pending").length} Pending</span>
              <span style={{ fontSize:12, padding:"4px 10px", borderRadius:20, background:"#7c3aed", color:"#fff", fontWeight:700 }}>AI Live Search</span>
            </div>
          </div>
          <p style={{ margin:"12px 0 0", fontSize:13, color:"#dbeafe", lineHeight:1.6 }}>The $50 billion federal RHT Program (FY2026–2030) is administered by CMS. All 50 states received awards in December 2025. Click any state card to view details, portal links, and a state-specific application walkthrough.</p>
        </div>

        <div style={{ background:"#fff", borderRadius:10, border:"1.5px solid #e5e7eb", marginBottom:"1.25rem", overflowX:"auto", display:"flex" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{ flex:"0 0 auto", padding:"12px 16px", fontSize:13, fontWeight:tab===t.id?700:500, border:"none", borderBottom:tab===t.id?"3px solid #2563eb":"3px solid transparent", background:"none", cursor:"pointer", color:tab===t.id?"#2563eb":"#6b7280", display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap" }}>
              <i className={`ti ${t.icon}`} style={{ fontSize:14 }} />{t.label}
            </button>
          ))}
        </div>

        <div style={{ background:"#fff", borderRadius:10, border:"1.5px solid #e5e7eb", padding:"1.5rem" }}>

          {tab==="states" && (
            <>
              <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                <div style={{ position:"relative", flex:1, minWidth:180 }}>
                  <i className="ti ti-search" style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, color:"#9ca3af" }} />
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by state name or abbreviation…" style={{ width:"100%", boxSizing:"border-box", border:"1.5px solid #d1d5db", borderRadius:8, padding:"9px 12px 9px 34px", fontSize:13, color:"#111827", outline:"none" }} />
                </div>
                <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ minWidth:150, border:"1.5px solid #d1d5db", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#111827", background:"#fff" }}>
                  <option value="all">All statuses</option>
                  <option value="active">Active only</option>
                  <option value="pending">Pending only</option>
                </select>
                <select value={initiativeFilter} onChange={e=>setInitiativeFilter(e.target.value)} style={{ minWidth:200, border:"1.5px solid #d1d5db", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#111827", background:"#fff" }}>
                  <option value="all">All key initiatives</option>
                  {ALL_INITIATIVES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              {initiativeFilter!=="all" && (
                <div style={{ marginBottom:12, padding:"8px 12px", background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:8, display:"flex", alignItems:"center", gap:8 }}>
                  <i className="ti ti-filter" style={{ fontSize:13, color:"#2563eb" }} />
                  <p style={{ margin:0, fontSize:13, color:"#1e40af", fontWeight:600 }}>Showing states with "{initiativeFilter}" initiative — {filtered.length} state{filtered.length!==1?"s":""} found</p>
                  <button onClick={()=>setInitiativeFilter("all")} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", fontSize:12, color:"#2563eb", fontWeight:700 }}>Clear filter ×</button>
                </div>
              )}
              {filtActive.length>0 && (
                <div style={{ marginBottom:24 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 12px", background:"#f0fdf4", borderRadius:8, borderLeft:"4px solid #16a34a" }}>
                    <i className="ti ti-circle-check" style={{ fontSize:16, color:"#16a34a" }} /><p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>Active states — RFPs released <span style={{ fontWeight:500, color:"#6b7280" }}>({filtActive.length})</span></p>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:12 }}>
                    {filtActive.map(s=><StateCard key={s.abbr} s={s} onClick={setSelected} />)}
                  </div>
                </div>
              )}
              {filtPending.length>0 && (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10, padding:"8px 12px", background:"#fffbeb", borderRadius:8, borderLeft:"4px solid #d97706" }}>
                    <i className="ti ti-clock" style={{ fontSize:16, color:"#d97706" }} /><p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>Pending states — awaiting RFP release <span style={{ fontWeight:500, color:"#6b7280" }}>({filtPending.length})</span></p>
                  </div>
                  <div style={{ padding:"10px 14px", background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:8, marginBottom:10, fontSize:13, color:"#92400e" }}>
                    These states received CMS awards but have not yet released RFPs. Click a card and use "Check now" for AI-powered live updates.
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:12 }}>
                    {filtPending.map(s=><StateCard key={s.abbr} s={s} onClick={setSelected} />)}
                  </div>
                </div>
              )}
              {filtActive.length===0&&filtPending.length===0&&<p style={{ color:"#6b7280", fontSize:14, textAlign:"center", padding:"2rem" }}>No states match your filters.</p>}
            </>
          )}

          {tab==="live" && <LiveFeed />}
          {tab==="deadlines" && <DeadlineTracker />}
          {tab==="company" && <CompanyMatch />}

          {tab==="resources" && (
            <div>
              <p style={{ margin:"0 0 16px", fontSize:13, color:"#6b7280" }}>Master documents, trackers, and authoritative sources.</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  { label:"CMS RHT Program overview", desc:"Official CMS page — program goals, NOFO info, and contacts", url:"https://www.cms.gov/priorities/rural-health-transformation-rht-program/overview", icon:"ti-building-hospital" },
                  { label:"CMS NOFO (full PDF)", desc:"The complete Notice of Funding Opportunity — master federal document", url:CMS_NOFO_URL, icon:"ti-file-text" },
                  { label:"grants.gov official listing", desc:"Federal grants listing with application instructions and updates", url:GRANTS_GOV_URL, icon:"ti-external-link" },
                  { label:"NRHA state RFP tracker", desc:"Real-time interactive map of every state's RFP procurement stage (May 2026)", url:NRHA_TRACKER, icon:"ti-map" },
                  { label:"RHIhub state programs directory", desc:"Links to all 50 state RHTP program pages with application materials", url:RHIHUB_URL, icon:"ti-list" },
                  { label:"SHVS state implementation tracker", desc:"Which agencies lead RHTP in each state", url:SHVS_URL, icon:"ti-chart-bar" },
                  { label:"RHTP Tracker (daily updates)", desc:"Daily updates on RFPs, awards, and documents across all 50 states", url:"https://rhtp.amemobile.net/", icon:"ti-refresh" },
                  { label:"Andor Health (ThinkAndor®)", desc:"AI-powered virtual care platform — KLAS #1 rated 2024–2026", url:"https://andorhealth.com", icon:"ti-robot" },
                  { label:"Psynergy Health", desc:"Virtual clinical workforce and care coordination for rural health systems", url:"https://psynergy.health", icon:"ti-heart-plus" },
                  { label:"Email CMS directly", desc:"MAHARural@cms.hhs.gov — CMS RHT Program team", url:"mailto:MAHARural@cms.hhs.gov", icon:"ti-mail" },
                ].map(({label,desc,url,icon}) => (
                  <a key={label} href={url} target={url.startsWith("mailto")?undefined:"_blank"} rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", borderRadius:8, border:"1.5px solid #e5e7eb", color:"#111827", textDecoration:"none", background:"#fff" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"}
                    onMouseLeave={e=>e.currentTarget.style.background="#fff"}
                  >
                    <div style={{ width:36, height:36, borderRadius:8, background:"#eff6ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <i className={`ti ${icon}`} style={{ fontSize:18, color:"#2563eb" }} />
                    </div>
                    <div><p style={{ margin:0, fontSize:14, fontWeight:700, color:"#111827" }}>{label}</p><p style={{ margin:"2px 0 0", fontSize:12, color:"#6b7280" }}>{desc}</p></div>
                    <i className="ti ti-arrow-up-right" style={{ fontSize:15, color:"#9ca3af", marginLeft:"auto", marginTop:2, flexShrink:0 }} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <p style={{ marginTop:"1.5rem", fontSize:11, color:"#9ca3af", textAlign:"center" }}>Data sourced from CMS, state RHTP websites, NRHA, RHIhub, and SHVS. Always verify with the state agency before applying. AI live search powered by Claude · Last compiled June 2026.</p>
      </div>
      {selected && <Overlay s={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}
