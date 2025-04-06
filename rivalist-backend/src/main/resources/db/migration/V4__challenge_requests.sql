CREATE TABLE challenge_requests (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INT REFERENCES users(id) ON DELETE CASCADE,
    battle_id INT REFERENCES battles(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED')),
    event_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    UNIQUE (sender_id, recipient_id, status) WHERE status = 'PENDING'
);

-- Create indexes for efficient querying
CREATE INDEX idx_challenge_requests_sender_status ON challenge_requests(sender_id, status);
CREATE INDEX idx_challenge_requests_recipient_status ON challenge_requests(recipient_id, status);
CREATE INDEX idx_challenge_requests_expires_at ON challenge_requests(expires_at);

-- Create function to set expiry time to 60 seconds after creation
CREATE OR REPLACE FUNCTION set_challenge_expiry()
RETURNS TRIGGER AS $$
BEGIN
    NEW.expires_at = NEW.created_at + INTERVAL '60 seconds';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set the expiry time
CREATE TRIGGER trigger_set_challenge_expiry
    BEFORE INSERT ON challenge_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_challenge_expiry();

-- Add comment explaining table purpose
COMMENT ON TABLE challenge_requests IS 'Stores battle challenge requests between friends with automatic expiration after 60 seconds';

