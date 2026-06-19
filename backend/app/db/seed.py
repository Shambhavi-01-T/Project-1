from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
from app.models.models import (
    TrendData, TrendScore, Keyword, ContentRecommendation,
    TrendForecast, CompetitorAnalysis, User
)
from app.core.security import get_password_hash

def seed_db(db: Session):
    # 1. Create default test user
    test_email = "creator@earlytrend.ai"
    user = db.query(User).filter(User.email == test_email).first()
    if not user:
        user = User(
            email=test_email,
            password_hash=get_password_hash("creator123"),
            full_name="Alex Creator",
            role="creator",
            plan_type="paid"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # 2. Check if trend data already exists
    if db.query(TrendData).count() > 0:
        return

    # Helper function to generate diverse niches and country tags
    trends_metadata = [
        # --- Web Dev (Global) ---
        {
            "platform": "youtube",
            "trend_name": "Next.js 15 Server Actions patterns",
            "canonical_topic": "Web Development",
            "trend_hash": "yt_nextjs_server_actions",
            "status": "early",
            "volume_growth": 250,
            "competitor_volume": 12,
            "adopters": 5,
            "sentiment": 0.85,
            "timeframe": "hour",
            "country": "Global",
            "keywords": [
                {"keyword": "server actions next.js 15", "type": "phrase", "volume": 12000},
                {"keyword": "nextjs 15 tutorial", "type": "phrase", "volume": 35000}
            ],
            "recommendations": [
                {
                    "platform": "youtube",
                    "title_suggestion": "The Right Way to use Next.js 15 Server Actions",
                    "hook": "99% of developers use Server Actions wrong in Next.js 15. Here is the structure...",
                    "post_format": "Tutorial video",
                    "suggested_length": "8-12 minutes"
                }
            ],
            "competitors": [
                {"name": "TechWithCode", "gap": "No discussion on nested actions error handling", "adoption_rate": 0.1}
            ]
        },
        # --- AI (US) ---
        {
            "platform": "youtube",
            "trend_name": "Self-Hosting LLMs with Local WebUI",
            "canonical_topic": "Artificial Intelligence",
            "trend_hash": "yt_self_hosting_llms",
            "status": "rising",
            "volume_growth": 180,
            "competitor_volume": 28,
            "adopters": 15,
            "sentiment": 0.9,
            "timeframe": "week",
            "country": "US",
            "keywords": [
                {"keyword": "ollama local webui", "type": "phrase", "volume": 45000},
                {"keyword": "self host llama 3", "type": "phrase", "volume": 28000}
            ],
            "recommendations": [
                {
                    "platform": "youtube",
                    "title_suggestion": "Stop Paying OpenAI: Self-Host LLMs Locally",
                    "hook": "Why pay $20/month when you can run a private, local LLM offline?",
                    "post_format": "Hands-on guide",
                    "suggested_length": "10-15 minutes"
                }
            ],
            "competitors": [
                {"name": "DevOpsGuru", "gap": "Missed GPU memory calculation checklist", "adoption_rate": 0.25}
            ]
        },
        # --- Design (UK) ---
        {
            "platform": "instagram",
            "trend_name": "Glassmorphism UI dynamic glass cards",
            "canonical_topic": "Design & UI/UX",
            "trend_hash": "ig_glassmorphism_ui",
            "status": "early",
            "volume_growth": 320,
            "competitor_volume": 4,
            "adopters": 3,
            "sentiment": 0.95,
            "timeframe": "hour",
            "country": "UK",
            "keywords": [
                {"keyword": "glassmorphic card css", "type": "phrase", "volume": 5000},
                {"keyword": "#uidesign", "type": "hashtag", "volume": 120000}
            ],
            "recommendations": [
                {
                    "platform": "instagram",
                    "title_suggestion": "Perfect CSS Glassmorphism in 3 lines",
                    "hook": "Tired of ugly glass effects? Bookmark this code layout blueprint! 👇🎨",
                    "post_format": "Carousel / Reel",
                    "suggested_length": "5 slides / 30 sec Reel"
                }
            ],
            "competitors": [
                {"name": "DesignBites", "gap": "Static images only, no CSS code snippets", "adoption_rate": 0.05}
            ]
        },
        # --- Finance (US) ---
        {
            "platform": "linkedin",
            "trend_name": "Automated index fund micro-saving apps",
            "canonical_topic": "Personal Finance",
            "trend_hash": "li_index_fund_microsaving",
            "status": "early",
            "volume_growth": 290,
            "competitor_volume": 6,
            "adopters": 4,
            "sentiment": 0.82,
            "timeframe": "week",
            "country": "US",
            "keywords": [
                {"keyword": "micro savings automated index", "type": "phrase", "volume": 8500},
                {"keyword": "spare change investing", "type": "phrase", "volume": 22000}
            ],
            "recommendations": [
                {
                    "platform": "linkedin",
                    "title_suggestion": "How Micro-Saving in Index Funds Beats Regular Savings Accounts",
                    "hook": "Saving $5 a day automatically could result in thousands over a decade. Here is why automated index micro-saving is trending...",
                    "post_format": "Text Post / Chart Graph",
                    "suggested_length": "250 words"
                }
            ],
            "competitors": [
                {"name": "FintechDigest", "gap": "Focused on app reviews rather than savings mathematical models", "adoption_rate": 0.08}
            ]
        },
        # --- Lifestyle & Fashion (UK) ---
        {
            "platform": "instagram",
            "trend_name": "Eco-conscious capsule wardrobe aesthetics",
            "canonical_topic": "Lifestyle & Fashion",
            "trend_hash": "ig_capsule_wardrobe_eco",
            "status": "early",
            "volume_growth": 340,
            "competitor_volume": 8,
            "adopters": 5,
            "sentiment": 0.91,
            "timeframe": "hour",
            "country": "UK",
            "keywords": [
                {"keyword": "eco capsule wardrobe ideas", "type": "phrase", "volume": 12000},
                {"keyword": "#capsulewardrobe", "type": "hashtag", "volume": 350000}
            ],
            "recommendations": [
                {
                    "platform": "instagram",
                    "title_suggestion": "Build a 10-Piece Eco Wardrobe for Summer 🌿",
                    "hook": "Save time, money, and the planet. Here are the 10 wardrobe essentials for infinite outfits 👇👗",
                    "post_format": "Outfit transition Reel",
                    "suggested_length": "15-30 seconds"
                }
            ],
            "competitors": [
                {"name": "StylePills", "gap": "Covered style matches but didn't highlight sustainable brand names", "adoption_rate": 0.12}
            ]
        },
        # --- Wellness & Fitness (India) ---
        {
            "platform": "instagram",
            "trend_name": "Mushroom-infused cognitive coffee blends",
            "canonical_topic": "Wellness & Health",
            "trend_hash": "ig_mushroom_coffee_cognitive",
            "status": "rising",
            "volume_growth": 190,
            "competitor_volume": 14,
            "adopters": 9,
            "sentiment": 0.88,
            "timeframe": "month",
            "country": "IN",
            "keywords": [
                {"keyword": "lions mane mushroom coffee benefits", "type": "phrase", "volume": 18000},
                {"keyword": "#wellnesscoffee", "type": "hashtag", "volume": 25000}
            ],
            "recommendations": [
                {
                    "platform": "instagram",
                    "title_suggestion": "Why I Swapped Coffee for Lion's Mane Mushrooms 🧠☕",
                    "hook": "Coffee jitters are real. Here is how adding mushroom adaptogens to your morning ritual eliminates crashes and boosts focus...",
                    "post_format": "Visual brewing carousel",
                    "suggested_length": "6 slides"
                }
            ],
            "competitors": [
                {"name": "HealthBloggerIN", "gap": "Only listed ingredients, missed explanation of neurogenesis parameters", "adoption_rate": 0.14}
            ]
        },
        # --- Social Media Marketing (India) ---
        {
            "platform": "youtube",
            "trend_name": "Short-form video hook formulas for agencies",
            "canonical_topic": "Social Media Marketing",
            "trend_hash": "yt_short_video_hooks_marketing",
            "status": "rising",
            "volume_growth": 220,
            "competitor_volume": 18,
            "adopters": 11,
            "sentiment": 0.86,
            "timeframe": "week",
            "country": "IN",
            "keywords": [
                {"keyword": "short form video hooks creator", "type": "phrase", "volume": 15000},
                {"keyword": "viral hooks copywriter template", "type": "phrase", "volume": 9000}
            ],
            "recommendations": [
                {
                    "platform": "youtube",
                    "title_suggestion": "The 5 Hooks That Generated 10 Million Views (Copy & Paste)",
                    "hook": "Stop losing viewers in the first 3 seconds. In this tutorial, I analyze the top 5 high-retention video hook formulas...",
                    "post_format": "Whiteboard breakdown tutorial",
                    "suggested_length": "6-10 minutes"
                }
            ],
            "competitors": [
                {"name": "GrowAgency", "gap": "Only gave basic tips, did not detail semantic structure formulas", "adoption_rate": 0.2}
            ]
        },
        # --- B2B & Career Gig (US) ---
        {
            "platform": "linkedin",
            "trend_name": "Fractional AI Officer (FAIO) rise",
            "canonical_topic": "B2B & Career",
            "trend_hash": "li_fractional_ai_officer",
            "status": "early",
            "volume_growth": 410,
            "competitor_volume": 2,
            "adopters": 2,
            "sentiment": 0.88,
            "timeframe": "week",
            "country": "US",
            "keywords": [
                {"keyword": "fractional artificial intelligence officer", "type": "phrase", "volume": 1500},
                {"keyword": "#fractionalwork", "type": "hashtag", "volume": 4200}
            ],
            "recommendations": [
                {
                    "platform": "linkedin",
                    "title_suggestion": "The Rise of the Fractional AI Officer",
                    "hook": "Startups need AI roadmaps, but they can't afford a full-time $300k CAIO. Enter the Fractional AI Officer...",
                    "post_format": "Text Post / PDF Document Guide",
                    "suggested_length": "300-400 words"
                }
            ],
            "competitors": [
                {"name": "ConsultingBiz", "gap": "Covered executive fractional roles but missed specific AI deliverables", "adoption_rate": 0.02}
            ]
        },
        # --- Tech Debt (Global) ---
        {
            "platform": "linkedin",
            "trend_name": "Clean-code architectural debt",
            "canonical_topic": "Software Engineering",
            "trend_hash": "li_clean_code_debt",
            "status": "rising",
            "volume_growth": 110,
            "competitor_volume": 42,
            "adopters": 35,
            "sentiment": 0.65,
            "timeframe": "quarter",
            "country": "Global",
            "keywords": [
                {"keyword": "technical debt calculation", "type": "phrase", "volume": 18000},
                {"keyword": "#softwarearchitecture", "type": "hashtag", "volume": 88000}
            ],
            "recommendations": [
                {
                    "platform": "linkedin",
                    "title_suggestion": "How 'Clean Code' can accidentally kill your startup",
                    "hook": "We spent 3 months writing the 'perfect' abstract architecture. Then our competitors shipped 10 features with spaghetti code...",
                    "post_format": "Text post",
                    "suggested_length": "250 words"
                }
            ],
            "competitors": [
                {"name": "AgileCoach", "gap": "Argues for strict clean-code only, ignores startup speed trade-offs", "adoption_rate": 0.45}
            ]
        }
    ]

    for item in trends_metadata:
        growth = item["volume_growth"]
        comp = item["competitor_volume"]
        adopters = item["adopters"]
        sent = item["sentiment"]

        early_score = int(min(max((growth * 1.5) - (comp * 1.8) - (adopters * 1.2), 30), 99))
        if item["status"] == "early":
            early_score = int(random.randint(80, 97))
            saturation_score = int(random.randint(5, 25))
        else:
            early_score = int(random.randint(65, 80))
            saturation_score = int(random.randint(26, 45))

        momentum_score = int(min(max((growth * 0.4) + (sent * 40), 40), 98))
        virality_score = int(min(max((growth * 0.3) + (adopters * 2.0), 30), 95))
        competition_score = int(min(max((comp * 3.5), 10), 90))
        lifetime_score = int(random.randint(60, 92))

        now = datetime.utcnow()
        tf = item.get("timeframe", "week")
        if tf == "hour":
            first_seen = now - timedelta(minutes=random.randint(10, 50))
        elif tf == "week":
            first_seen = now - timedelta(days=random.randint(1, 6))
        elif tf == "month":
            first_seen = now - timedelta(days=random.randint(8, 28))
        else: # quarter
            first_seen = now - timedelta(days=random.randint(32, 85))

        # Create trend data
        trend = TrendData(
            platform=item["platform"],
            trend_name=item["trend_name"],
            canonical_topic=item["canonical_topic"],
            trend_hash=item["trend_hash"],
            first_seen_at=first_seen,
            latest_seen_at=now,
            # Assigning country tags inside raw_metrics JSON for database compatibility
            raw_metrics={
                "volume_growth": f"+{growth}%",
                "competitor_volume_index": comp,
                "early_adopters_count": adopters,
                "average_sentiment": sent,
                "country": item["country"]
            },
            status=item["status"],
            source_count=random.randint(5, 25)
        )
        db.add(trend)
        db.commit()
        db.refresh(trend)

        # Create scores
        score_entry = TrendScore(
            trend_id=trend.id,
            early_score=early_score,
            virality_score=virality_score,
            lifetime_score=lifetime_score,
            saturation_score=saturation_score,
            momentum_score=momentum_score,
            competition_score=competition_score
        )
        db.add(score_entry)

        # Create keywords
        for kw in item["keywords"]:
            k_entry = Keyword(
                trend_id=trend.id,
                keyword=kw["keyword"],
                keyword_type=kw["type"],
                score=random.randint(60, 95),
                volume=kw["volume"]
            )
            db.add(k_entry)

        # Create recommendations
        for rec in item["recommendations"]:
            r_entry = ContentRecommendation(
                trend_id=trend.id,
                platform=rec["platform"],
                title_suggestion=rec["title_suggestion"],
                hook=rec["hook"],
                post_format=rec["post_format"],
                suggested_length=rec["suggested_length"]
            )
            db.add(r_entry)

        # Create forecast
        forecast_entry = TrendForecast(
            trend_id=trend.id,
            forecast_date=now + timedelta(days=7),
            expected_velocity=random.uniform(1.5, 4.0),
            expected_reach=random.randint(10000, 250000),
            lifetime_window_days=random.randint(8, 20),
            probability_of_viral=random.uniform(0.3, 0.95)
        )
        db.add(forecast_entry)

        # Create competitor analysis
        for comp_item in item["competitors"]:
            comp_entry = CompetitorAnalysis(
                trend_id=trend.id,
                competitor_name=comp_item["name"],
                platform=item["platform"],
                content_gap={"gap_description": comp_item["gap"]},
                adoption_rate=comp_item["adoption_rate"],
                benchmark_score=random.randint(50, 90)
            )
            db.add(comp_entry)

    db.commit()
