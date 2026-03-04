-- Database Schema for PrecificaAI

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    plan TEXT DEFAULT 'FREE',
    has_completed_onboarding BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    -- Direct Costs
    production_cost DECIMAL(12, 2) DEFAULT 0,
    labor_cost DECIMAL(12, 2) DEFAULT 0,
    packaging_cost DECIMAL(12, 2) DEFAULT 0,
    shipping_cost DECIMAL(12, 2) DEFAULT 0,
    -- Fixed Costs
    monthly_rent DECIMAL(12, 2) DEFAULT 0,
    owner_salary DECIMAL(12, 2) DEFAULT 0,
    employees_cost DECIMAL(12, 2) DEFAULT 0,
    utilities_cost DECIMAL(12, 2) DEFAULT 0,
    other_fixed_costs DECIMAL(12, 2) DEFAULT 0,
    expected_volume INTEGER DEFAULT 1,
    -- Variable Expenses (%)
    card_fee DECIMAL(5, 2) DEFAULT 0,
    commission DECIMAL(5, 2) DEFAULT 0,
    marketplace_fee DECIMAL(5, 2) DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 0,
    -- Targets
    desired_margin DECIMAL(5, 2) DEFAULT 20,
    -- Calculated (cached for performance)
    suggested_price DECIMAL(12, 2),
    net_margin DECIMAL(5, 2),
    health_score INTEGER,
    break_even INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
