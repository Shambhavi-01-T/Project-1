import math

def calculate_early_score(growth_rate: float, comp_volume: float, adopters: int) -> int:
    """
    Early Trend Detection Engine formula:
    Combines high growth speed, low competitor saturation, and early adopter counts.
    High growth + Low volume + Low adopters = High early score.
    """
    # Normalize growth rate (e.g., 100% to 500% mapped, clamp to 0-1)
    g_norm = min(max(growth_rate / 400.0, 0.0), 1.0)
    
    # Competitor volume penalty (more existing posts lowers early-stage signal)
    # A log penalty is ideal so it tapers off
    c_penalty = min(math.log(max(comp_volume, 1.0)) / math.log(100.0), 1.0)
    
    # Adopter density (moderate adopters is good, but too many means it's already viral)
    a_factor = 1.0
    if adopters > 20:
        a_factor = max(1.0 - ((adopters - 20) / 100.0), 0.2)
    elif adopters > 0:
        a_factor = 0.5 + (adopters / 40.0) # builds up to 1.0
        
    score = (g_norm * 0.6 + (1.0 - c_penalty) * 0.4) * a_factor * 100.0
    return int(min(max(score, 10), 99))

def calculate_momentum_score(growth_rate: float, sentiment_score: float, source_count: int) -> int:
    """
    Momentum measures current acceleration and engagement velocity.
    """
    g_norm = min(max(growth_rate / 300.0, 0.0), 1.0)
    # Sentiment is usually -1.0 to 1.0, map to 0.0 to 1.0
    s_norm = min(max((sentiment_score + 1.0) / 2.0, 0.0), 1.0)
    v_norm = min(max(source_count / 50.0, 0.0), 1.0)
    
    score = (g_norm * 0.4 + s_norm * 0.3 + v_norm * 0.3) * 100.0
    return int(min(max(score, 10), 99))

def calculate_virality_score(growth_rate: float, adopters: int) -> int:
    """
    Predicts probability of a trend accelerating into viral adoption.
    """
    g_norm = min(max(growth_rate / 250.0, 0.0), 1.0)
    a_norm = min(max(adopters / 30.0, 0.0), 1.0)
    
    score = (g_norm * 0.5 + a_norm * 0.5) * 100.0
    return int(min(max(score, 10), 99))

def calculate_saturation_score(published_posts: int, expected_capacity: int = 200) -> int:
    """
    Measure how crowded a trend is.
    0-30: low saturation (enter fast)
    30-60: moderate saturation
    60-100: crowded trend
    """
    score = (published_posts / max(expected_capacity, 1)) * 100.0
    return int(min(max(score, 0), 100))

def estimate_lifetime_window(growth_rate: float, status: str) -> int:
    """
    Predicts remaining useful window of a trend in days before decay.
    """
    base_days = 14
    if status == "early":
        base_days = 21
    elif status == "mature":
        base_days = 5
        
    # High initial growth velocity sometimes decays faster (shorter lifetime spike)
    decay_modifier = max(1.0 - (growth_rate / 600.0), -0.5)
    return int(max(base_days * (1.0 + decay_modifier), 3))
