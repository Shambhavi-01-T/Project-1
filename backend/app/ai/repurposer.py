def repurpose_content(
    trend_name: str,
    source_platform: str,
    target_platform: str,
    source_text: str
) -> dict:
    """
    Simulated AI content repurposer engine.
    Applies strategic copywriting frameworks to rewrite input copy for different target platforms.
    """
    clean_text = source_text.strip()
    if not clean_text:
        clean_text = f"An emerging topic about {trend_name} is gaining momentum."

    # Split into lines/ideas for parsing
    lines = [l.strip() for l in clean_text.split("\n") if l.strip()]
    core_point = lines[0] if lines else f"Understanding the growth of {trend_name}."
    
    title_suggestion = ""
    hook = ""
    body_copy = ""
    format_notes = ""

    if target_platform == "linkedin":
        title_suggestion = f"Why {trend_name} is about to disrupt your workflow"
        hook = f"The biggest trend in {trend_name} is happening right now, but most people are completely ignoring it. 🧵👇"
        
        body_copy = (
            f"Here is what is happening with {trend_name}:\n\n"
            f"1️⃣ Growth speed: We are seeing massive early interest on other platforms.\n"
            f"2️⃣ Content Density: Competition remains extremely low for this niche.\n"
            f"3️⃣ Strategic advantage: Publishing authority content now allows you to claim early-stage search rankings.\n\n"
            f"Here is my step-by-step framework to capitalize on this:\n\n"
            f"• Action 1: Map your personal niche to the trend.\n"
            f"• Action 2: Focus on actionable case studies over generic summaries.\n"
            f"• Action 3: Keep templates lightweight and highly shareable.\n\n"
            f"Are you testing this trend yet? Let me know in the comments. 👇\n\n"
            f"#CreatorEconomy #PersonalBrand #{trend_name.replace(' ', '')}"
        )
        format_notes = "Use a PDF carousel attachment with these 3 key lessons to double click-through rates. Clean line breaks are critical."

    elif target_platform == "instagram":
        title_suggestion = f"3 Steps to master {trend_name} 🎨"
        hook = f"Bookmark this CSS/design trick for {trend_name} before everyone else starts using it! 💾👇"
        
        body_copy = (
            f"Struggling with {trend_name}? Here is the exact code & layout blueprint:\n\n"
            f"🔥 STEP 1: Establish high contrast layout borders.\n"
            f"✨ STEP 2: Apply smooth backdrop blur filters.\n"
            f"🚀 STEP 3: Deploy micro-hover transitions.\n\n"
            f"Double tap if this UI blueprint helps! ❤️\n\n"
            f"#{trend_name.replace(' ', '')} #uidesign #webdeveloper #coder #freelancedesigner"
        )
        format_notes = "Visual formatting: slide 1 should have a dark neon preview. Slides 2-4 show step-by-step code. Final slide is CTA."

    elif target_platform == "youtube":
        title_suggestion = f"The {trend_name} tutorial you've been waiting for (Complete Guide)"
        hook = "Intro Script: What if you could rank #1 for search queries overnight? In this video, we're building a full project around..."
        
        body_copy = (
            "VIDEO OUTLINE:\n\n"
            "0:00 - The Emerging Trend (Problem)\n"
            f"1:30 - What is {trend_name} & Why it's growing\n"
            "3:45 - Step-by-Step Code Demo / Visual Setup\n"
            "7:15 - Avoiding Saturation & Saturation Meter overview\n"
            "9:30 - Final summary & resource downloads\n\n"
            "DESCRIPTION BLOCK:\n"
            f"Learn how to implement {trend_name} from scratch. We analyze the growth curves, "
            "provide standard boilerplates, and build out a production-ready repository. "
            "Subscribe for more early-stage social media trend insights!"
        )
        format_notes = "Video checklist: Use zoom-ins for code highlights. Keep pacing fast with B-roll overlays to maintain high average watch time."

    else:
        title_suggestion = f"Emerging: {trend_name}"
        hook = f"Early signals detected for {trend_name}."
        body_copy = clean_text
        format_notes = "Default template applied. Customize text for specific channel layout requirements."

    return {
        "source_platform": source_platform,
        "target_platform": target_platform,
        "title_suggestion": title_suggestion,
        "hook": hook,
        "body_copy": body_copy,
        "format_notes": format_notes
    }
