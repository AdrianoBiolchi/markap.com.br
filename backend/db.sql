-- Database Schema for PrecificaAI / Markap

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    plan TEXT DEFAULT 'FREE',
    business_type TEXT,
    tax_regime TEXT,
    onboarding_goal TEXT,
    onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    monthly_rent DECIMAL(12, 2) DEFAULT 0,
    owner_salary DECIMAL(12, 2) DEFAULT 0,
    employees_cost DECIMAL(12, 2) DEFAULT 0,
    utilities_cost DECIMAL(12, 2) DEFAULT 0,
    accounting_cost DECIMAL(12, 2) DEFAULT 0,
    systems_cost DECIMAL(12, 2) DEFAULT 0,
    marketing_cost DECIMAL(12, 2) DEFAULT 0,
    other_fixed_costs DECIMAL(12, 2) DEFAULT 0,
    segment TEXT DEFAULT 'outro',
    expected_monthly_revenue DECIMAL(12, 2) DEFAULT 0,
    pricing_mode TEXT DEFAULT 'SIMPLE', -- SIMPLE or ADVANCED
    fixed_cost_percentage DECIMAL(12, 2) DEFAULT 0,
    monthly_profit_goal DECIMAL(12, 2) DEFAULT 0,
    monthly_revenue_goal DECIMAL(12, 2) DEFAULT 0,
    custom_market_margin DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    production_cost DECIMAL(12, 2) DEFAULT 0,
    labor_cost DECIMAL(12, 2) DEFAULT 0,
    packaging_cost DECIMAL(12, 2) DEFAULT 0,
    shipping_cost DECIMAL(12, 2) DEFAULT 0,
    expected_volume INTEGER DEFAULT 100,
    card_fee DECIMAL(5, 2) DEFAULT 0,
    commission DECIMAL(5, 2) DEFAULT 0,
    marketplace_fee DECIMAL(5, 2) DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    desired_margin DECIMAL(5, 2) DEFAULT 20,
    max_discount DECIMAL(5, 2) DEFAULT 10,
    competitor_price DECIMAL(12, 2),
    suggested_price DECIMAL(12, 2),
    current_price DECIMAL(12, 2),
    net_margin DECIMAL(5, 2),
    break_even INTEGER,
    health_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_resets (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
