-- Add comment explaining table purpose
COMMENT ON TABLE challenge_requests IS 'Stores battle challenge requests between friends with automatic expiration after 60 seconds';

CREATE TABLE challenge_requests (
    id BIGSERIAL PRIMARY KEY,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    battle_id BIGINT REFERENCES battles(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED')),
    event_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    -- Ensure a user can't challenge themselves
    CONSTRAINT challenge_requests_no_self_challenge CHECK (sender_id != recipient_id),
    
    -- Ensure uniqueness of pending challenges between users
    CONSTRAINT challenge_requests_unique_pending UNIQUE (sender_id, recipient_id, status) 
        WHERE status = 'PENDING'
);

-- Index for finding challenges by sender and status
CREATE INDEX idx_challenge_requests_sender_status ON challenge_requests(sender_id, status);

-- Index for finding challenges by recipient and status
CREATE INDEX idx_challenge_requests_recipient_status ON challenge_requests(recipient_id, status);

-- Index for finding expired challenges (partial index for better performance)
CREATE INDEX idx_challenge_requests_expires_at ON challenge_requests(expires_at) 
    WHERE status = 'PENDING';

-- Function to automatically set expiration to 60 seconds after creation
CREATE OR REPLACE FUNCTION set_challenge_expiration()
RETURNS TRIGGER AS $$
BEGIN
    NEW.expires_at := NEW.created_at + INTERVAL '60 seconds';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set expiration time on insert
CREATE TRIGGER challenge_request_expiration
    BEFORE INSERT ON challenge_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_challenge_expiration();
