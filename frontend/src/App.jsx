import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from './services/api';

// --- ICONS (SVG helpers) ---
const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const ExploreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
);
const RepurposeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const SignOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

// --- HELPERS ---
const getCountryFlag = (code) => {
  if (!code) return "🌐 Global";
  const c = code.toUpperCase();
  if (c === "US") return "🇺🇸 USA";
  if (c === "IN") return "🇮🇳 India";
  if (c === "UK") return "🇬🇧 UK";
  return "🌐 Global";
};

const getTopicColor = (topic) => {
  if (!topic) return "var(--primary)";
  const t = topic.toLowerCase();
  if (t.includes("finance")) return "var(--success)";
  if (t.includes("design") || t.includes("ui")) return "var(--accent-cyan)";
  if (t.includes("marketing")) return "var(--accent-pink)";
  if (t.includes("wellness") || t.includes("health")) return "#eab308"; // yellow
  return "var(--primary)";
};

// --- CIRCULAR CREDITS GAUGE ---
function CreditsGauge({ credits, onUpgradeClick }) {
  const maxCredits = 15;
  const radius = 20;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(credits, maxCredits) / maxCredits) * circumference;

  const isLow = credits <= 3;
  const ringColor = isLow ? "var(--danger)" : "var(--primary)";

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-glass)',
      borderRadius: '14px',
      padding: '0.85rem 1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.85rem',
      marginTop: 'auto',
      marginBottom: '1rem'
    }}>
      <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg height="40" width="40" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle
            stroke="rgba(255, 255, 255, 0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="20"
            cy="20"
          />
          <circle
            stroke={ringColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }}
            r={normalizedRadius}
            cx="20"
            cy="20"
          />
        </svg>
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isLow ? 'var(--danger)' : 'white' }}>
          {credits}
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Daily Credits</div>
        <button 
          onClick={onUpgradeClick} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--primary)', 
            fontSize: '0.65rem', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            padding: 0,
            textAlign: 'left'
          }}
        >
          Upgrade / Refill
        </button>
      </div>
    </div>
  );
}

// --- FALLBACK MOCK DATA ---
const FALLBACK_TRENDS = [
  {
    id: "trend_f1",
    platform: "youtube",
    trend_name: "Next.js 15 Server Actions patterns",
    canonical_topic: "Web Development",
    status: "early",
    first_seen_at: new Date().toISOString(),
    latest_seen_at: new Date().toISOString(),
    raw_metrics: { volume_growth: "+250%", competitor_volume_index: 12, average_sentiment: 0.85, country: "Global" },
    scores: { early_score: 94, virality_score: 85, momentum_score: 92, saturation_score: 15, competition_score: 20, lifetime_score: 85 },
    keywords: [
      { id: "k1", keyword: "server actions next.js 15", keyword_type: "phrase", score: 90, volume: 12000 }
    ]
  },
  {
    id: "trend_f2",
    platform: "linkedin",
    trend_name: "Fractional AI Officer (FAIO) rise",
    canonical_topic: "B2B & Career",
    status: "early",
    first_seen_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
    latest_seen_at: new Date().toISOString(),
    raw_metrics: { volume_growth: "+410%", competitor_volume_index: 2, average_sentiment: 0.88, country: "US" },
    scores: { early_score: 97, virality_score: 88, momentum_score: 95, saturation_score: 8, competition_score: 10, lifetime_score: 92 }
  },
  {
    id: "trend_f3",
    platform: "instagram",
    trend_name: "Mushroom-infused cognitive coffee blends",
    canonical_topic: "Wellness & Health",
    status: "rising",
    first_seen_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    latest_seen_at: new Date().toISOString(),
    raw_metrics: { volume_growth: "+320%", competitor_volume_index: 4, average_sentiment: 0.95, country: "IN" },
    scores: { early_score: 91, virality_score: 78, momentum_score: 89, saturation_score: 22, competition_score: 12, lifetime_score: 80 }
  }
];

// --- DASHBOARD VIEW ---
function DashboardView({ trends, credits, onUpgradeClick }) {
  const [watchlist, setWatchlist] = useState([]);

  const earlyCount = trends.filter(t => t.status === 'early').length;
  const risingCount = trends.filter(t => t.status === 'rising').length;
  const avgOpportunity = trends.length 
    ? Math.round(trends.reduce((acc, t) => acc + (t.scores?.early_score || 0), 0) / trends.length)
    : 0;

  const toggleWatchlist = (name) => {
    if (watchlist.includes(name)) {
      setWatchlist(watchlist.filter(item => item !== name));
    } else {
      setWatchlist([...watchlist, name]);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem', color: 'white' }}>Creator Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here is your daily trend activity breakdown.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="pulse-indicator"></div>
          <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>Sync active</span>
        </div>
      </div>

      {/* Metric Tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Avg Opportunity</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', margin: '0.5rem 0' }}>{avgOpportunity}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>High conversion potential</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Early Trends</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.5rem 0' }}>{earlyCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Low search density index</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Rising Breakouts</span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-pink)', margin: '0.5rem 0' }}>{risingCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>Entering peak engagement</div>
        </div>
      </div>

      {/* Grid panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {/* Top trends card list */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'white' }}>Early Opportunity Signals</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {trends.slice(0, 3).map((trend) => (
              <div key={trend.id} style={{
                padding: '1.1rem',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${trend.platform}`}>{trend.platform}</span>
                    <span className="badge badge-early" style={{ fontSize: '0.6rem' }}>Opp: {trend.scores?.early_score}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {getCountryFlag(trend.raw_metrics?.country)}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>{trend.trend_name}</h4>
                  <span className="badge" style={{ 
                    fontSize: '0.65rem', 
                    background: 'rgba(255,255,255,0.03)',
                    color: getTopicColor(trend.canonical_topic),
                    borderColor: 'rgba(255,255,255,0.08)'
                  }}>{trend.canonical_topic}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => toggleWatchlist(trend.trend_name)} className="btn btn-secondary" style={{ padding: '0.6rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={watchlist.includes(trend.trend_name) ? "var(--primary)" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </button>
                  <Link to={`/explorer?trend=${trend.id}`} className="btn btn-primary" style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}>
                    Inspect
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'white' }}>Saved Watchlist</h3>
          {watchlist.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '3rem' }}>
              No trends saved yet. Click the star icon next to early opportunities to build your list.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {watchlist.map((item, idx) => (
                <div key={idx} style={{
                  padding: '0.85rem 1.1rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item}</span>
                  <button onClick={() => toggleWatchlist(item)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- TREND EXPLORER VIEW ---
function TrendExplorerView({ trends, credits, onCreditDeduct, onOpenUpgrade, onTrendsReload }) {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedCountry, setSelectedCountry] = useState(""); // country filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTrend, setActiveTrend] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [recs, setRecs] = useState([]);
  const location = useLocation();

  const inspectTrend = async (trend) => {
    if (credits <= 0) {
      onOpenUpgrade();
      return;
    }

    setActiveTrend(trend);
    onCreditDeduct();

    try {
      const predData = await api.getTrendPrediction(trend.id);
      setPredictions(predData);
    } catch {
      setPredictions({
        trend_id: trend.id,
        early_score: trend.scores?.early_score || 85,
        virality_score: trend.scores?.virality_score || 70,
        lifetime_score: trend.scores?.lifetime_score || 80,
        saturation_score: trend.scores?.saturation_score || 20,
        momentum_score: trend.scores?.momentum_score || 75,
        expected_velocity: 3.2,
        expected_reach: 25000,
        lifetime_window_days: 14,
        probability_of_viral: 0.75
      });
    }

    try {
      const compData = await api.listCompetitors(trend.id);
      setCompetitors(compData);
    } catch {
      setCompetitors([
        { id: "c1", competitor_name: "IndustryLeader", platform: trend.platform, content_gap: { gap_description: "Missing detailed target analysis parameters" }, adoption_rate: 0.15, benchmark_score: 75 }
      ]);
    }

    try {
      const recData = await api.listRecommendations(trend.id);
      setRecs(recData);
    } catch {
      setRecs([
        {
          id: "r1",
          platform: trend.platform,
          title_suggestion: `Blueprint for ${trend.trend_name}`,
          hook: "Here's the early blueprint hook...",
          post_format: "Tutorial Guide",
          suggested_length: "Quick read"
        }
      ]);
    }
  };

  // Fetch trends from backend when time, platform, or country filter updates
  useEffect(() => {
    const fetchFiltered = async () => {
      let list = [];
      try {
        list = await api.listTrends(selectedPlatform, selectedStatus, searchQuery, selectedTimeframe, selectedCountry);
        onTrendsReload(list);
      } catch {
        list = FALLBACK_TRENDS;
        onTrendsReload(list);
      }

      // Auto-inspect trend if present in query parameter
      const query = new URLSearchParams(location.search);
      const trendId = query.get('trend');
      if (trendId && list && list.length) {
        const found = list.find(t => t.id === trendId);
        if (found) {
          // Bypassing credit deduction on direct load for standard navigation flow
          setActiveTrend(found);
          try {
            const predData = await api.getTrendPrediction(found.id);
            setPredictions(predData);
          } catch {
            setPredictions({
              trend_id: found.id,
              early_score: found.scores?.early_score || 85,
              virality_score: found.scores?.virality_score || 70,
              lifetime_score: found.scores?.lifetime_score || 80,
              saturation_score: found.scores?.saturation_score || 20,
              momentum_score: found.scores?.momentum_score || 75,
              expected_velocity: 3.2,
              expected_reach: 25000,
              lifetime_window_days: 14,
              probability_of_viral: 0.75
            });
          }
          try {
            const compData = await api.listCompetitors(found.id);
            setCompetitors(compData);
          } catch {
            setCompetitors([
              { id: "c1", competitor_name: "IndustryLeader", platform: found.platform, content_gap: { gap_description: "Missing detailed target analysis parameters" }, adoption_rate: 0.15, benchmark_score: 75 }
            ]);
          }
          try {
            const recData = await api.listRecommendations(found.id);
            setRecs(recData);
          } catch {
            setRecs([
              {
                id: "r1",
                platform: found.platform,
                title_suggestion: `Blueprint for ${found.trend_name}`,
                hook: "Here's the early blueprint hook...",
                post_format: "Tutorial Guide",
                suggested_length: "Quick read"
              }
            ]);
          }
        }
      }
    };
    fetchFiltered();
  }, [selectedTimeframe, selectedPlatform, selectedStatus, selectedCountry, location.search]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const list = await api.listTrends(selectedPlatform, selectedStatus, searchQuery, selectedTimeframe, selectedCountry);
      onTrendsReload(list);
    } catch {
      onTrendsReload(FALLBACK_TRENDS);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'white' }}>Trend Explorer</h1>

      {/* Filter panel */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1.5, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search trend keywords or niches (e.g. coffee, wardrobe, savings)..."
              className="form-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ width: '160px' }}>
            <select className="form-input" value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)}>
              <option value="">All Platforms</option>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
          <div style={{ width: '160px' }}>
            <select className="form-input" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="early">Early Stage</option>
              <option value="rising">Rising Breakout</option>
              <option value="mature">Mature Saturated</option>
            </select>
          </div>
          {/* Country filter dropdown */}
          <div style={{ width: '160px' }}>
            <select className="form-input" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
              <option value="">All Regions</option>
              <option value="US">🇺🇸 United States</option>
              <option value="IN">🇮🇳 India</option>
              <option value="UK">🇬🇧 United Kingdom</option>
              <option value="Global">🌐 Global</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.5rem' }}>Search</button>
        </form>

        {/* Timeframe Chips/Tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', marginRight: '0.5rem', fontWeight: 600 }}>Discovery Timeframe:</span>
          {['hour', 'week', 'month', 'quarter'].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setSelectedTimeframe(tf)}
              className={`timeframe-tab ${selectedTimeframe === tf ? 'timeframe-tab-active' : ''}`}
            >
              {tf === 'hour' ? 'Past Hour (Microtrends)' : `Past ${tf.charAt(0).toUpperCase() + tf.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* Split grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeTrend ? '1fr 1.1fr' : '1fr',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        {/* Table list */}
        <div className="glass-panel" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255, 255, 255, 0.01)' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trend Name</th>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Platform</th>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Region</th>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Niche</th>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Opp Score</th>
                <th style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend) => (
                <tr key={trend.id} style={{
                  borderBottom: '1px solid var(--border-glass)',
                  cursor: 'pointer',
                  background: activeTrend?.id === trend.id ? 'rgba(192, 132, 252, 0.06)' : 'none',
                  transition: 'var(--transition)'
                }} onClick={() => inspectTrend(trend)} className="explorer-row">
                  <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'white' }}>{trend.trend_name}</td>
                  <td style={{ padding: '1.25rem 1rem' }}><span className={`badge badge-${trend.platform}`}>{trend.platform}</span></td>
                  <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', fontWeight: 600 }}>{getCountryFlag(trend.raw_metrics?.country)}</td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span className="badge" style={{ 
                      fontSize: '0.65rem', 
                      background: 'rgba(255,255,255,0.02)',
                      color: getTopicColor(trend.canonical_topic),
                      borderColor: 'rgba(255,255,255,0.06)'
                    }}>{trend.canonical_topic}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', color: 'var(--primary)', fontWeight: 800, fontSize: '1rem' }}>{trend.scores?.early_score || 80}</td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        inspectTrend(trend);
                      }} 
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px' }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed drawer panel */}
        {activeTrend && (
          <div className="glass-panel glow-card" style={{ border: '1px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span className={`badge badge-${activeTrend.platform}`} style={{ marginRight: '0.5rem' }}>{activeTrend.platform}</span>
                <span className={`badge badge-${activeTrend.status}`}>{activeTrend.status}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 600 }}>
                  {getCountryFlag(activeTrend.raw_metrics?.country)}
                </span>
              </div>
              <button onClick={() => { setActiveTrend(null); setPredictions(null); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>×</button>
            </div>

            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: 'white' }}>{activeTrend.trend_name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>Category: <strong>{activeTrend.canonical_topic}</strong></p>

            {predictions ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.015)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>VIRALITY LIFT PROBABILITY</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '0.35rem 0' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-pink)' }}>{predictions.virality_score}%</span>
                    </div>
                    <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${predictions.virality_score}%`, background: 'var(--accent-pink)' }}></div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.015)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>COMPETITOR SATURATION</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '0.35rem 0' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--warning)' }}>{predictions.saturation_score}%</span>
                    </div>
                    <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${predictions.saturation_score}%`, background: 'var(--warning)' }}></div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.015)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EXPECTED TARGET REACH</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', margin: '0.35rem 0' }}>
                      ~{predictions.expected_reach.toLocaleString()}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estimated view impressions</span>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.015)', padding: '1.1rem', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>LIFETIME SPAN</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.35rem 0' }}>
                      ~{predictions.lifetime_window_days} Days
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Remaining opportunity window</span>
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', color: 'white' }}>AI Content Hook Suggestions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {recs.map((r, i) => (
                      <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>Title: {r.title_suggestion}</strong>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.5rem', lineHeight: 1.4 }}>"{r.hook}"</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Format: {r.post_format}</span>
                          <span>Length: {r.suggested_length}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', color: 'white' }}>Competitor Analysis & Content Gaps</h3>
                  {competitors.map((c, i) => (
                    <div key={i} style={{ padding: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <strong style={{ color: 'white' }}>{c.competitor_name}</strong>
                        <span style={{ color: 'var(--accent-cyan)' }}>Adoption: {c.adoption_rate * 100}%</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--accent-pink)', fontWeight: 600 }}>Detected Gap:</span> {c.content_gap?.gap_description || 'Low density coverage.'}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <Link to={`/repurpose?trend=${activeTrend.trend_name}`} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                    Convert & Repurpose Now
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Loading AI trend predictions...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .explorer-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
}

// --- CONTENT REPURPOSER VIEW ---
function ContentRepurposerView({ credits, onCreditDeduct, onOpenUpgrade }) {
  const query = new URLSearchParams(useLocation().search);
  const trendParam = query.get('trend') || '';

  const [trendName, setTrendName] = useState(trendParam);
  const [sourcePlatform, setSourcePlatform] = useState("youtube");
  const [targetPlatform, setTargetPlatform] = useState("linkedin");
  const [sourceText, setSourceText] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRepurpose = async (e) => {
    e.preventDefault();

    if (credits <= 0) {
      onOpenUpgrade();
      return;
    }

    setLoading(true);
    setError("");
    setOutput(null);

    try {
      const data = await api.repurposeContent(trendName, sourcePlatform, targetPlatform, sourceText);
      setOutput(data);
      onCreditDeduct();
    } catch (err) {
      setError(err.message || "Failed to trigger AI repurposer logic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Content Repurposer</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Translate raw format concepts into high-converting drafts automatically.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Form Input Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <form onSubmit={handleRepurpose} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Trend/Topic Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Eco-conscious capsule wardrobe"
                value={trendName}
                onChange={(e) => setTrendName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Source Platform</label>
                <select className="form-input" value={sourcePlatform} onChange={(e) => setSourcePlatform(e.target.value)}>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Target Platform</label>
                <select className="form-input" value={targetPlatform} onChange={(e) => setTargetPlatform(e.target.value)}>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Source Draft or Main Ideas</label>
              <textarea
                className="form-input"
                rows="6"
                placeholder="Write your core topic takeaways here, or paste raw script notes..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }} disabled={loading}>
              {loading ? "AI Copywriter Processing..." : "Convert Content Format"}
            </button>
            {error && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</div>}
          </form>
        </div>

        {/* AI Output Card */}
        <div className="glass-panel glow-card" style={{ padding: '2rem', minHeight: '430px', display: 'flex', flexDirection: 'column', border: output ? '1px solid var(--primary)' : '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>Generated Output Draft</h3>
          
          {output ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>RECOMMENDED TITLE / HOOK</strong>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-glass)', fontSize: '0.95rem', fontWeight: 700, color: 'white', lineHeight: 1.4 }}>
                  {output.title_suggestion}
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>BODY COPY DRAFT</strong>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '1.1rem',
                  borderRadius: '10px',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}>
                  {output.body_copy}
                </div>
              </div>

              <div>
                <strong style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>FORMAT & LAYOUT BLUEPRINT</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', lineHeight: 1.4 }}>{output.format_notes}</p>
              </div>

              <button onClick={() => {
                navigator.clipboard.writeText(`${output.title_suggestion}\n\n${output.body_copy}`);
                alert("Copied post draft and headline templates to clipboard!");
              }} className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem' }}>Copy All to Clipboard</button>
            </div>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '240px', lineHeight: 1.5 }}>
              <InfoIcon style={{ width: '32px', height: '32px', color: 'var(--primary)', marginBottom: '0.5rem' }}/>
              <p>Configure your source parameters and click convert to run AI translation templates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- CREATOR PROFILE & SETTINGS VIEW ---
function CreatorProfileView({ user, onProfileUpdate }) {
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [org, setOrg] = useState(user?.organization || "");
  const [nicheInput, setNicheInput] = useState("");
  const [nicheTags, setNicheTags] = useState(user?.niche_tags && user.niche_tags.length ? user.niche_tags : ["AI", "Wellness", "Personal Finance", "Lifestyle"]);
  const [platformFocus, setPlatformFocus] = useState(user?.platform_focus && user.platform_focus.length ? user.platform_focus : ["youtube", "linkedin"]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const updated = await api.updateProfile({
        full_name: fullName,
        organization: org,
        niche_tags: nicheTags,
        platform_focus: platformFocus
      });
      onProfileUpdate(updated);
      setSuccessMsg("Creator profile updated successfully!");
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile settings.");
    }
  };

  const addNiche = (e) => {
    e.preventDefault();
    const tag = nicheInput.trim();
    if (tag && !nicheTags.includes(tag)) {
      setNicheTags([...nicheTags, tag]);
      setNicheInput("");
    }
  };

  const removeNiche = (tag) => {
    setNicheTags(nicheTags.filter(t => t !== tag));
  };

  const togglePlatform = (plat) => {
    if (platformFocus.includes(plat)) {
      setPlatformFocus(platformFocus.filter(p => p !== plat));
    } else {
      setPlatformFocus([...platformFocus, plat]);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'white' }}>Creator Settings</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Personalize vertical signals to match your target audience criteria.</p>

      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Creator Name</label>
            <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Organization / Brand</label>
            <input type="text" className="form-input" value={org} onChange={(e) => setOrg(e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 600 }}>Target Channels</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['youtube', 'instagram', 'linkedin'].map((plat) => (
                <button
                  type="button"
                  key={plat}
                  onClick={() => togglePlatform(plat)}
                  className={`btn ${platformFocus.includes(plat) ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ textTransform: 'capitalize', padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                >
                  {plat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Niche Segments</label>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Finance, Wellness, Fashion"
                value={nicheInput}
                onChange={(e) => setNicheInput(e.target.value)}
              />
              <button onClick={addNiche} className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>Add</button>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {nicheTags.map((tag, i) => (
                <span key={i} className="badge badge-early" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600 }}>
                  {tag}
                  <button type="button" onClick={() => removeNiche(tag)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}>×</button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.9rem' }}>
            Save Settings
          </button>
          
          {successMsg && <div style={{ color: 'var(--success)', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>{successMsg}</div>}
          {errorMsg && <div style={{ color: 'var(--danger)', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>{errorMsg}</div>}
        </form>
      </div>
    </div>
  );
}

// --- SIDEBAR NAVIGATION ---
function Sidebar({ user, credits, onLogout, onUpgradeClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <HomeIcon /> },
    { name: "Trend Explorer", path: "/explorer", icon: <ExploreIcon /> },
    { name: "Content Repurposer", path: "/repurpose", icon: <RepurposeIcon /> },
    { name: "Creator Settings", path: "/profile", icon: <ProfileIcon /> }
  ];

  return (
    <div style={{
      width: '260px',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-glass)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem',
      zIndex: 100,
      boxShadow: '4px 0 25px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          boxShadow: '0 0 15px rgba(192, 132, 252, 0.4)'
        }}>E</div>
        <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800 }}>EarlyTrend AI</span>
      </div>

      {/* Profile Header */}
      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(192, 132, 252, 0.15)',
            border: '1px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'var(--primary)'
          }}>
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.full_name || 'Creator'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {user.organization || 'Independent'}
            </div>
          </div>
        </div>
      )}

      {/* Nav List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && (location.pathname === '/' || location.pathname === ''));
          return (
            <Link
              key={item.name}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                background: isActive ? 'rgba(192, 132, 252, 0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(192, 132, 252, 0.15)' : '1px solid transparent',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'var(--transition)'
              }}
              className="hover-scale"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Credits Gauge */}
      <CreditsGauge credits={credits} onUpgradeClick={onUpgradeClick} />

      {/* Log Out */}
      <button
        onClick={onLogout}
        className="btn btn-secondary"
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          borderRadius: '10px'
        }}
      >
        <SignOutIcon />
        <span>Sign Out</span>
      </button>
    </div>
  );
}

// --- LANDING VIEW ---
function LandingView({ onAuthTrigger }) {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 5%',
        background: 'rgba(9, 8, 24, 0.6)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-glass)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 0 15px rgba(192, 132, 252, 0.4)'
          }}>E</div>
          <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 800 }}>EarlyTrend AI</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => onAuthTrigger('login')} className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>Sign In</button>
          <button onClick={() => onAuthTrigger('register')} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '4rem',
        padding: '6rem 8% 4rem 8%',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Decorative glows */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(192, 132, 252, 0.15)',
          filter: 'blur(100px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '350px',
          height: '350px',
          background: 'rgba(99, 102, 241, 0.15)',
          filter: 'blur(120px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(192, 132, 252, 0.1)',
            border: '1px solid rgba(192, 132, 252, 0.25)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1.5rem'
          }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', animation: 'pulse 1.5s infinite' }} />
            Next-Gen Trend Discovery
          </div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
            Spot Social Trends <span className="gradient-text">Before They Go Viral</span>
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '550px' }}>
            EarlyTrend AI parses cross-platform data across YouTube, Instagram, and LinkedIn. Identify high-velocity signals, calculate virality probability, and generate repurposed draft variations instantly.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button onClick={() => onAuthTrigger('register')} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              Start Tracking Free
            </button>
            <button onClick={() => onAuthTrigger('login')} className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              Sign In with Account
            </button>
          </div>

          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>10k+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Daily Signals Tracked</div>
            </div>
            <div style={{ borderRight: '1px solid var(--border-glass)' }} />
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>94%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Discovery Accuracy</div>
            </div>
            <div style={{ borderRight: '1px solid var(--border-glass)' }} />
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>15s</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI Translation Speed</div>
            </div>
          </div>
        </div>

        {/* Visual Graphic Representation */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass-panel glow-card" style={{
            width: '100%',
            maxWidth: '480px',
            padding: '2rem',
            background: 'rgba(13, 11, 32, 0.7)',
            border: '1px solid var(--border-glass-active)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
          }}>
            {/* Visual Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>Realtime Stream</div>
            </div>

            {/* Simulated Trend items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span className="badge badge-youtube" style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', marginBottom: '0.25rem' }}>YouTube</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>Capsule Wardrobes for Men</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.95rem' }}>+420%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Velocity</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(192, 132, 252, 0.04)',
                border: '1px solid var(--border-glass-active)',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span className="badge badge-linkedin" style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', marginBottom: '0.25rem' }}>LinkedIn</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>Fractional AI executive roles</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.95rem' }}>97 Score</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Opportunity</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-glass)',
                padding: '0.85rem 1.1rem',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span className="badge badge-instagram" style={{ fontSize: '0.6rem', padding: '0.2rem 0.5rem', marginBottom: '0.25rem' }}>Instagram</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>Mushroom Coffee blends</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--success)', fontWeight: 800, fontSize: '0.95rem' }}>+310%</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Velocity</div>
                </div>
              </div>
            </div>

            {/* Small diagram overlay */}
            <div style={{
              marginTop: '1.5rem',
              height: '100px',
              position: 'relative',
              background: 'rgba(255,255,255,0.01)',
              borderRadius: '14px',
              border: '1px solid var(--border-glass)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0 1rem'
            }}>
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M 0 80 Q 80 70 120 40 T 300 20 T 400 10" fill="none" stroke="url(#gradient)" strokeWidth="3" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--secondary)" />
                    <stop offset="100%" stopColor="var(--primary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.5rem', zIndex: 1 }}>
                <span>Hour</span>
                <span>Week</span>
                <span>Month</span>
                <span>Quarter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section style={{
        padding: '5rem 8%',
        background: 'rgba(9, 8, 24, 0.4)',
        borderTop: '1px solid var(--border-glass)'
      }}>
        <h2 style={{ fontSize: '2.25rem', textAlign: 'center', marginBottom: '3.5rem', color: 'white' }}>Why Creators Choose EarlyTrend AI</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.75rem' }}>Velocity Scoring</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Our proprietary scoring formulas isolate search acceleration speed and engagement density to score trends from 0 to 100.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌐</div>
            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.75rem' }}>Regional Isolation</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Filter trends across United States, India, United Kingdom, or Global markets to align content strategies with regional demographics.
            </p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✍️</div>
            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.75rem' }}>AI Repurposer</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Convert a viral script or text draft from one platform style (e.g. YouTube Tutorial) into another (e.g. B2B LinkedIn post) dynamically.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section style={{
        padding: '5rem 8% 8rem 8%',
        maxWidth: '1100px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '2.5rem', color: 'white', marginBottom: '0.75rem' }}>Fair, Creator-Friendly Pricing</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3.5rem' }}>Start discovering microtrends for free. Upgrade as your brand scales.</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch'
        }}>
          {/* Free Plan */}
          <div className="glass-panel" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem' }}>Hobby Creator</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'white', margin: '1rem 0' }}>$0</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Ideal for testing niches & basic keyword tracking</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>✓ 15 daily search/inspect credits</li>
              <li>✓ Cross-platform search feeds</li>
              <li>✓ Standard content translation tools</li>
              <li style={{ color: 'var(--text-muted)' }}>✗ Unlimited querying pipeline</li>
              <li style={{ color: 'var(--text-muted)' }}>✗ Custom webhook trend alerts</li>
            </ul>
            <button onClick={() => onAuthTrigger('register')} className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto', padding: '0.8rem' }}>Get Started Free</button>
          </div>

          {/* Pro Plan */}
          <div className="glass-panel" style={{ padding: '2.5rem 2rem', border: '1px solid var(--primary)', position: 'relative', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(192, 132, 252, 0.15)' }}>
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>Recommended</div>
            
            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem' }}>Creator Pro</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', margin: '1rem 0' }}>$29<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>Perfect for active creators and digital influencers</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li>✓ Unlimited daily search/inspect runs</li>
              <li>✓ Full historic timeframe graphs</li>
              <li>✓ 1-click multi-format repurposing</li>
              <li>✓ Priority backend pipeline synchronization</li>
              <li>✓ Exclusive creator support channel</li>
            </ul>
            <button onClick={() => onAuthTrigger('register')} className="btn btn-primary" style={{ width: '100%', marginTop: 'auto', padding: '0.8rem' }}>Go Pro Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 5%',
        background: 'rgba(6, 5, 15, 0.95)',
        borderTop: '1px solid var(--border-glass)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div>© 2026 EarlyTrend AI. All rights reserved. Built for creators.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>API Access</span>
        </div>
      </footer>
    </div>
  );
}

// --- MAIN CONTROLLER ---
export default function App() {
  const [user, setUser] = useState(null);
  const [trends, setTrends] = useState([]);
  const [credits, setCredits] = useState(15);
  
  const [authMode, setAuthMode] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [org, setOrg] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  const handleCreditDeduct = async () => {
    try {
      const updatedUser = await api.deductCredit();
      setCredits(updatedUser.credits);
      setUser(updatedUser);
      showToast("Deducted 1 credit for AI usage.");
    } catch (err) {
      showToast(err.message || "Failed to deduct credits");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    const fetchContext = async () => {
      try {
        const trendData = await api.listTrends();
        setTrends(trendData);
      } catch {
        setTrends(FALLBACK_TRENDS);
      }

      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
          setCredits(userData.credits);
        } catch {
          api.logout();
        }
      }
    };
    fetchContext();
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (authMode === 'register') {
        await api.register(email, password, fullName, org);
        const data = await api.login(email, password);
        const userData = await api.getMe();
        setUser(userData);
        setAuthMode(null);
        setCredits(userData.credits);
        navigate('/dashboard');
      } else {
        await api.login(email, password);
        const userData = await api.getMe();
        setUser(userData);
        setAuthMode(null);
        setCredits(userData.credits);
        navigate('/dashboard');
      }
      const trendData = await api.listTrends();
      setTrends(trendData);
    } catch (err) {
      setAuthError(err.message || "Authentication failed.");
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="app-container">
      {user && (
        <Sidebar 
          user={user} 
          credits={credits} 
          onLogout={handleLogout} 
          onUpgradeClick={() => setUpgradeOpen(true)} 
        />
      )}

      <div className={user ? "main-content" : ""} style={!user ? { width: '100%' } : {}}>
        <Routes>
          <Route path="/" element={
            user ? <DashboardView trends={trends} credits={credits} onUpgradeClick={() => setUpgradeOpen(true)} /> : <LandingView onAuthTrigger={setAuthMode} />
          } />
          <Route path="/dashboard" element={
            user ? <DashboardView trends={trends} credits={credits} onUpgradeClick={() => setUpgradeOpen(true)} /> : <LandingView onAuthTrigger={setAuthMode} />
          } />
          <Route path="/explorer" element={
            user ? (
              <TrendExplorerView 
                trends={trends} 
                credits={credits} 
                onCreditDeduct={handleCreditDeduct} 
                onOpenUpgrade={() => setUpgradeOpen(true)} 
                onTrendsReload={setTrends}
              />
            ) : <LandingView onAuthTrigger={setAuthMode} />
          } />
          <Route path="/repurpose" element={
            user ? (
              <ContentRepurposerView 
                credits={credits} 
                onCreditDeduct={handleCreditDeduct} 
                onOpenUpgrade={() => setUpgradeOpen(true)} 
              />
            ) : <LandingView onAuthTrigger={setAuthMode} />
          } />
          <Route path="/profile" element={
            user ? <CreatorProfileView user={user} onProfileUpdate={setUser} /> : <LandingView onAuthTrigger={setAuthMode} />
          } />
        </Routes>
      </div>

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'rgba(17, 15, 36, 0.95)',
          border: '1px solid var(--border-glass-active)',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          boxShadow: '0 8px 30px rgba(192,132,252,0.25)',
          color: 'var(--text-main)',
          fontSize: '0.85rem',
          fontWeight: 600,
          zIndex: 9999,
          animation: 'slideUp 0.3s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {authMode && (
        <div style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0, left: 0,
          background: 'rgba(4, 3, 10, 0.88)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div className="glass-panel glow-card" style={{
            width: '100%',
            maxWidth: '420px',
            padding: '2.5rem',
            border: '1px solid var(--primary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>{authMode === 'register' ? 'Create Account' : 'Sign In'}</h2>
              <button onClick={() => setAuthMode(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold' }}>×</button>
            </div>

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {authMode === 'register' && (
                <>
                  <div>
                    <input type="text" placeholder="Full Name" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div>
                    <input type="text" placeholder="Organization / Brand" className="form-input" value={org} onChange={(e) => setOrg(e.target.value)} />
                  </div>
                </>
              )}
              
              <div>
                <input type="email" placeholder="Email Address" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              
              <div>
                <input type="password" placeholder="Password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                {authMode === 'register' ? 'Register Account' : 'Login'}
              </button>

              {authError && <div style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>{authError}</div>}

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {authMode === 'register' ? (
                  <span>Already have an account? <button type="button" onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Sign In</button></span>
                ) : (
                  <span>Don't have an account yet? <button type="button" onClick={() => setAuthMode('register')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Create one</button></span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {upgradeOpen && (
        <div style={{
          position: 'fixed',
          top: 0, right: 0, bottom: 0, left: 0,
          background: 'rgba(4, 3, 10, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          backdropFilter: 'blur(12px)'
        }}>
          <div className="glass-panel glow-card" style={{
            width: '100%',
            maxWidth: '500px',
            padding: '2.5rem',
            border: '1px solid var(--primary)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: 'white' }}>Unlock Unlimited Daily Credits</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
              You have used your free daily allowance. Upgrade to Creator Pro or Agency plan for infinite queries, priority alerts, and bulk exports.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
                <strong style={{ color: 'var(--primary)', display: 'block', fontSize: '0.9rem' }}>Refill standard</strong>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>$5.00</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>+50 search credits</p>
                <button onClick={async () => {
                  try {
                    const updatedUser = await api.refillCredits();
                    setCredits(updatedUser.credits);
                    setUser(updatedUser);
                    setUpgradeOpen(false);
                    showToast("Added 50 credits successfully!");
                  } catch (err) {
                    showToast("Failed to refill: " + err.message);
                  }
                }} className="btn btn-secondary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem', fontSize: '0.75rem' }}>Buy Refill</button>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(192,132,252,0.05)', border: '1px solid var(--border-glass-active)', borderRadius: '10px' }}>
                <strong style={{ color: 'var(--primary)', display: 'block', fontSize: '0.9rem' }}>Creator Pro</strong>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>$29/mo</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Unlimited query pipeline</p>
                <button onClick={async () => {
                  try {
                    const updatedUser = await api.upgradePlan();
                    setCredits(updatedUser.credits);
                    setUser(updatedUser);
                    setUpgradeOpen(false);
                    showToast("Upgraded to Pro successfully!");
                  } catch (err) {
                    showToast("Failed to upgrade: " + err.message);
                  }
                }} className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem', fontSize: '0.75rem' }}>Go Pro</button>
              </div>
            </div>

            <button onClick={() => setUpgradeOpen(false)} className="btn btn-secondary" style={{ width: '100%', padding: '0.85rem' }}>
              Close Window
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
