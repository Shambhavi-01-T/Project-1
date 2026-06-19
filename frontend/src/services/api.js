const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8002/api/v1";

const getHeaders = () => {
    const headers = {
        "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    // --- Auth Endpoints ---
    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Login failed");
        }
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_email", data.email);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_plan", data.plan_type);
        return data;
    },

    register: async (email, password, full_name, organization) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, full_name, organization }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Registration failed");
        }
        return await res.json();
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_email");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_plan");
    },

    getMe: async () => {
        const res = await fetch(`${API_BASE}/users/me`, {
            headers: getHeaders(),
        });
        if (!res.ok) {
            throw new Error("Failed to fetch user context");
        }
        return await res.json();
    },

    updateProfile: async (profileData) => {
        const res = await fetch(`${API_BASE}/users/profile`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(profileData),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to update profile");
        }
        return await res.json();
    },

    deductCredit: async () => {
        const res = await fetch(`${API_BASE}/users/deduct-credit`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to deduct credits");
        }
        return await res.json();
    },

    refillCredits: async () => {
        const res = await fetch(`${API_BASE}/users/refill`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to refill credits");
        }
        return await res.json();
    },

    upgradePlan: async () => {
        const res = await fetch(`${API_BASE}/users/upgrade`, {
            method: "POST",
            headers: getHeaders(),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to upgrade plan");
        }
        return await res.json();
    },

    // --- Trends Endpoints ---
    listTrends: async (platform = "", status = "", search = "", timeframe = "", country = "") => {
        let url = `${API_BASE}/trends/?`;
        if (platform) url += `platform=${platform}&`;
        if (status) url += `status=${status}&`;
        if (search) url += `search=${search}&`;
        if (timeframe) url += `timeframe=${timeframe}&`;
        if (country) url += `country=${country}&`;
        
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch trends list");
        return await res.json();
    },

    getTrend: async (id) => {
        const res = await fetch(`${API_BASE}/trends/${id}`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch trend details");
        return await res.json();
    },

    getTrendPrediction: async (id) => {
        const res = await fetch(`${API_BASE}/trends/${id}/prediction`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch trend forecasts");
        return await res.json();
    },

    // --- Recommendations & Repurposer Endpoints ---
    listRecommendations: async (trendId) => {
        const res = await fetch(`${API_BASE}/recommendations/${trendId}`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch content suggestions");
        return await res.json();
    },

    repurposeContent: async (trendName, sourcePlatform, targetPlatform, sourceText) => {
        const res = await fetch(`${API_BASE}/recommendations/repurpose`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                trend_name: trendName,
                source_platform: sourcePlatform,
                target_platform: targetPlatform,
                source_text: sourceText,
            }),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Repurposing engine failed");
        }
        return await res.json();
    },

    // --- Competitor Endpoints ---
    listCompetitors: async (trendId) => {
        const res = await fetch(`${API_BASE}/competitors/${trendId}`, { headers: getHeaders() });
        if (!res.ok) throw new Error("Failed to fetch competitor gap analysis");
        return await res.json();
    },
};
