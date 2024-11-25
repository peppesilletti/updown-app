-- Up migration: Create the "bet" table
CREATE TABLE IF NOT EXISTS bets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    direction VARCHAR(4) NOT NULL, -- 'UP' or 'DOWN'
    btc_price DECIMAL NOT NULL,
    status VARCHAR(10) NOT NULL, -- 'pending', 'won', 'lost'
    last_checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
