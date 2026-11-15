import { useState } from 'react'

interface ReferenceItem {
  id: string
  title: string
  category: 'commercial' | 'nextgen' | 'papers' | 'ntrs' | 'portals'
  developerOrSource: string
  url: string
  summary: string
  tag: string
}

const referencesData: ReferenceItem[] = [
  // Section 1: Commercial & Operational Systems
  {
    id: 'hexoskin',
    title: 'Hexoskin (Bio-Monitor Smart Garment)',
    category: 'commercial',
    developerOrSource: 'Carré Technologies & Canadian Space Agency (CSA)',
    url: 'https://asc-csa.gc.ca/eng/sciences/bio-monitor.asp',
    summary: 'Smart shirt and headband tracking continuous ECG, breathing volume, skin temperature, and pulse oximetry aboard the ISS.',
    tag: 'Active ISS Flight Hardware',
  },
  {
    id: 'embraceplus',
    title: 'Empatica EmbracePlus Medical Watch',
    category: 'commercial',
    developerOrSource: 'Empatica & NASA TRISH',
    url: 'https://www.techbriefs.com/component/content/article/51127',
    summary: 'Medical-grade smartwatch tracking continuous vital signs, electrodermal stress response, and sleep-wake patterns in space analogs.',
    tag: 'NASA TRISH Validated',
  },
  {
    id: 'ejenta',
    title: 'Ejenta Intelligent Agent Platform',
    category: 'commercial',
    developerOrSource: 'Ejenta Inc. (NASA Spin-off)',
    url: 'https://spinoff.nasa.gov/astronaut-remote-health-monitoring',
    summary: 'Autonomous agent architecture derived from NASA intelligent agent algorithms to monitor physiological telemetry.',
    tag: 'NASA Spinoff Commercial',
  },
  {
    id: 'commercial-wearables',
    title: 'Commercial Spaceflight Wearable Sensors',
    category: 'commercial',
    developerOrSource: 'Polaris Dawn, Axiom Space & Commercial Partners',
    url: 'https://trialx.com/space-health-research-wearable-devices/',
    summary: 'COTS wearables (Garmin Fenix, Oura Ring, BioButton patches, Butterfly iQ+ ultrasound) used on commercial orbital flights.',
    tag: 'Commercial Spaceflight',
  },
  {
    id: 'cardio',
    title: 'Cardi/o Contactless Radar Monitor',
    category: 'commercial',
    developerOrSource: 'Advanced TeleSensors Inc. (NASA JPL License)',
    url: 'https://spinoff.nasa.gov/Space-Based_Tech_for_Home_Health_Monitoring',
    summary: 'Wall-mounted radar sensor monitoring resting heart rate and respiration without requiring direct skin attachment.',
    tag: 'NASA JPL Licensed',
  },

  // Section 2: Proposed & Next-Generation Deep-Space Systems
  {
    id: 'trialx-go',
    title: 'TrialX GO — Offline Edge Health Server',
    category: 'nextgen',
    developerOrSource: 'TrialX Space Health Research',
    url: 'https://trialx.com/space-health-research-commercial-astronauts/',
    summary: 'Offline AI edge server for deep-space habitats. Processes biometric telemetry locally and syncs with Earth upon communication windows.',
    tag: 'Offline Deep-Space Edge',
  },
  {
    id: 'gateway-biomonitor',
    title: 'Lunar Gateway Bio-Monitor',
    category: 'nextgen',
    developerOrSource: 'Canadian Space Agency (CSA) & Carré Technologies',
    url: 'https://spaceq.ca/carre-technologies-to-develop-wearable-health-monitoring-technology-for-lunar-gateway-astronauts/',
    summary: 'Next-generation deep-space bio-monitor engineered to assess cislunar radiation and cardiovascular adaptation around the Moon.',
    tag: 'Artemis Lunar Gateway',
  },
  {
    id: 'reform',
    title: 'REFORM Smart Fabric Diagnostics',
    category: 'nextgen',
    developerOrSource: 'NASA Johnson Space Center & Ohio State University',
    url: 'https://techport.nasa.gov/projects/118362',
    summary: 'Smart clothing woven with reconfigurable into-body RF antennas to autonomously measure fluid shifts, muscle atrophy, and bone loss.',
    tag: 'NASA TechPort Blueprint',
  },

  // Section 3: Peer-Reviewed Research Papers & Repositories
  {
    id: 'deep-space-2025',
    title: 'Advancements in Health Monitoring for Deep Space (2025)',
    category: 'papers',
    developerOrSource: 'Life Sciences in Space Research',
    url: 'https://pubmed.ncbi.nlm.nih.gov/41136019/',
    summary: 'Peer-reviewed review of wearable biomedical sensors and proposed autonomous, AI-driven predictive clinical frameworks for Mars exploration.',
    tag: 'PubMed Indexed',
  },
  {
    id: 'astroskin-exertion',
    title: 'Evaluation of Astroskin Bio-Monitor During High Physical Exertion',
    category: 'papers',
    developerOrSource: 'ResearchGate & Hexoskin Scientific Directory',
    url: 'https://www.researchgate.net/publication/373721623',
    summary: 'Clinical validation of smart shirt cardiopulmonary telemetry under extreme physical strain and zero-g exercise countermeasures.',
    tag: 'Clinical Validation',
  },
  {
    id: 'embraceplus-validation',
    title: 'Prospective Clinical Validation of Empatica EmbracePlus',
    category: 'papers',
    developerOrSource: 'PubMed / FDA Medical Device Standard',
    url: 'https://pubmed.ncbi.nlm.nih.gov/38111608/',
    summary: 'Clinical trial evaluating continuous pulse oximetry and PPG accuracy under induced hypoxia conditions in compliance with ISO standards.',
    tag: 'FDA/ISO Medical Grade',
  },
  {
    id: 'multimodal-sensing',
    title: 'Advancing Autonomous Health Monitoring: A Multi-Modal Approach',
    category: 'papers',
    developerOrSource: 'ResearchGate',
    url: 'https://www.researchgate.net/publication/388847090',
    summary: 'Decentralized multi-modal architecture combining millimeter-wave radar and facial autonomic tracking for deep space autonomy.',
    tag: 'Autonomous Multi-Modal',
  },
  {
    id: 'trish-expand',
    title: 'EXPAND Database & Space Medicine Biorepository',
    category: 'papers',
    developerOrSource: 'Baylor College of Medicine / NASA TRISH',
    url: 'https://www.bcm.edu/academic-centers/space-medicine/expand/expand-database-biorepository-faq',
    summary: 'Centralized biomedical repository housing physiological, multi-omics, and wearable datasets from commercial astronaut crews.',
    tag: 'TRISH Biorepository',
  },

  // Section 4: NASA.gov Engineering Blueprints (NTRS)
  {
    id: 'exmc-cdss',
    title: 'ExMC Clinical Decision Support System Architecture Recommendation',
    category: 'ntrs',
    developerOrSource: 'NASA NTRS Citation: 20220017869',
    url: 'https://ntrs.nasa.gov/citations/20220017869',
    summary: 'Official NASA engineering blueprint for the Medical Data Architecture (MDA), outlining software layers for autonomous diagnosis.',
    tag: 'NASA NTRS 20220017869',
  },
  {
    id: 'amra-aid',
    title: 'Autonomous Medical Response Agent (AMRA) AID Dashboard',
    category: 'ntrs',
    developerOrSource: 'NASA NTRS Citation: 20200000666',
    url: 'https://ntrs.nasa.gov/citations/20200000666',
    summary: 'UI/UX design principles that fuse astronaut vital signs, environmental life support telemetry, and mission timelines into clear alerts.',
    tag: 'NASA NTRS 20200000666',
  },
  {
    id: 'eimo-reqs',
    title: 'Earth Independent Medical Operations (EIMO) Engineering Guidelines',
    category: 'ntrs',
    developerOrSource: 'NASA NTRS Citation: 20230016189',
    url: 'https://ntrs.nasa.gov/citations/20230016189',
    summary: 'Software engineering specifications for autonomous deep-space medical tools, passive anomaly detection, and local storage.',
    tag: 'NASA NTRS 20230016189',
  },
  {
    id: 'medics',
    title: 'MedICS: Medical Decision Support for Long-Duration Space Exploration',
    category: 'ntrs',
    developerOrSource: 'NASA NTRS Citation: 20200000615',
    url: 'https://ntrs.nasa.gov/citations/20200000615',
    summary: 'Machine learning methods for differential clinical diagnoses and survival probability models from longitudinal astronaut health data.',
    tag: 'NASA NTRS 20200000615',
  },
  {
    id: 'medical-701',
    title: 'Clinical Decision Support Overview & Update (Medical-701)',
    category: 'ntrs',
    developerOrSource: 'NASA NTRS Citation: 20205011448',
    url: 'https://ntrs.nasa.gov/citations/20205011448',
    summary: 'Addresses NASA Medical-701 research gap, demonstrating how software reduces cognitive workload across the clinical OODA loop.',
    tag: 'NASA NTRS 20205011448',
  },

  // Section 4.2: Spaceflight Hazards & Open Data Portals
  {
    id: 'hrp-5hazards',
    title: 'NASA 5 Hazards of Human Spaceflight Portal',
    category: 'portals',
    developerOrSource: 'NASA Human Research Program (HRP)',
    url: 'https://www.nasa.gov/hrp/hazards/',
    summary: 'Official NASA taxonomy classifying risks: Radiation, Isolation, Distance, Gravity fields, and Hostile environments.',
    tag: 'NASA.gov Portal',
  },
  {
    id: 'glenn-medtech',
    title: 'Exploration Medical Technologies at NASA Glenn',
    category: 'portals',
    developerOrSource: 'NASA Glenn Research Center',
    url: 'https://www.nasa.gov/glenn/glenn-expertise-space-exploration/human-health-performance/exploration-medical-technologies/',
    summary: 'Integration standards for real-time vital sign processing, multifunctional diagnostic sensors, and lab assays.',
    tag: 'NASA Glenn Research',
  },
  {
    id: 'hera-wearable',
    title: 'Wearable Biosensor Monitor Study (HERA 30-Day Analog)',
    category: 'portals',
    developerOrSource: 'NASA NTRS Citation: 20190000238',
    url: 'https://ntrs.nasa.gov/citations/20190000238',
    summary: 'Validates smart shirts tracking continuous ECG, respiration, blood pressure, and sleep in 30-day simulated space habitat isolation.',
    tag: 'NASA NTRS 20190000238',
  },
  {
    id: 'nlsp',
    title: 'NASA Life Sciences Portal (NLSP / LSDA Hardware Gateway)',
    category: 'portals',
    developerOrSource: 'NASA Open Science Data Repository',
    url: 'https://nlsp.nasa.gov/search/data/details/IDP-LSDA_HARDWARE-0000000000000318?dataType=HARDWARE',
    summary: 'Open data gateway to request archived physiological telemetry datasets from HRP spaceflight investigations.',
    tag: 'NASA NLSP Database',
  },
  {
    id: 'hrp-standard',
    title: 'Ongoing HRP Standard Measures Repository',
    category: 'portals',
    developerOrSource: 'NASA Human Research Program',
    url: 'https://www.nasa.gov/hrp/ongoing-hrp-research/',
    summary: 'Defines the core normative baseline set of physiological, immunological, and behavioral metrics tracked across all astronauts.',
    tag: 'NASA Baseline Standard',
  },
  {
    id: 'lsah',
    title: 'Lifetime Surveillance of Astronaut Health (LSAH)',
    category: 'portals',
    developerOrSource: 'NASA Directorate of Health and Human Performance',
    url: 'https://www.nasa.gov/directorates/esdmd/hhp/lifetime-surveillance-of-astronaut-health-lsah/',
    summary: 'Longitudinal epidemiology program tracking countermeasure effectiveness and early warning biomarkers across astronaut careers.',
    tag: 'NASA LSAH Program',
  },
]

export function ReferencesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = referencesData.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.developerOrSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <span className="page-kicker">NASA Technical Resources & Literature Index</span>
        <h1 className="page-title text-2xl sm:text-3xl">
          NASA Technical Blueprints & Operational Systems Reference
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Direct citations and external links to peer-reviewed spaceflight literature, official NASA NTRS engineering papers, and active flight hardware.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="hud-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {[
            { id: 'all', label: 'All References (24)' },
            { id: 'commercial', label: 'Commercial & Flight' },
            { id: 'nextgen', label: 'Next-Gen Systems' },
            { id: 'ntrs', label: 'NASA NTRS Blueprints' },
            { id: 'papers', label: 'Peer-Reviewed' },
            { id: 'portals', label: 'NASA Portals' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 transition border ${
                activeCategory === cat.id
                  ? 'border-blue-300 bg-blue-50 text-blue-700 shadow-glow'
                  : 'border-white/10 bg-slate-950/50 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search systems, papers, NTRS citations..."
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 font-mono text-xs text-white placeholder-gray-400 focus:border-blue-300 focus:outline-none sm:w-64"
        />
      </div>

      {/* References Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div key={item.id} className="hud-card hud-card-hover flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="hud-chip hud-chip-ok font-mono text-[9px]">{item.tag}</span>
                <span className="font-mono text-[10px] text-gray-400 uppercase">{item.category}</span>
              </div>

              <h3 className="font-display text-base font-bold text-white mt-3 leading-snug">
                {item.title}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-blue-600">{item.developerOrSource}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">{item.summary}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-blue-500 hover:text-blue-700 transition group"
              >
                <span>View Official Source</span>
                <svg className="h-3 w-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
