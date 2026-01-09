-- SwanyThree Ultimate - Sample Data Seeds
-- Run this after running schema.sql to populate database with test data

-- Note: Password for all test users is 'password123' (bcrypt hash with 12 rounds)
-- Hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5cphKJVNx.bYy

-- Insert test users
INSERT INTO users (id, email, username, password_hash, role, subscription_tier, is_active, email_verified, bio) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@swanythree.com', 'demo_user', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5cphKJVNx.bYy', 'user', 'pro', true, true, 'Demo user for testing'),
  ('00000000-0000-0000-0000-000000000002', 'streamer@swanythree.com', 'pro_streamer', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5cphKJVNx.bYy', 'user', 'enterprise', true, true, 'Professional streamer'),
  ('00000000-0000-0000-0000-000000000003', 'admin@swanythree.com', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5cphKJVNx.bYy', 'admin', 'enterprise', true, true, 'System administrator');

-- Insert sample OAuth connections
INSERT INTO oauth_connections (user_id, provider, provider_user_id, access_token, refresh_token, is_active, scopes) VALUES
  ('00000000-0000-0000-0000-000000000001', 'twitch', 'twitch_user_123', 'mock_access_token_twitch', 'mock_refresh_token', true, ARRAY['channel:manage:broadcast', 'user:read:email']),
  ('00000000-0000-0000-0000-000000000001', 'youtube', 'youtube_user_456', 'mock_access_token_youtube', 'mock_refresh_token', true, ARRAY['https://www.googleapis.com/auth/youtube.force-ssl']),
  ('00000000-0000-0000-0000-000000000002', 'twitch', 'twitch_user_789', 'mock_access_token_twitch_2', 'mock_refresh_token', true, ARRAY['channel:manage:broadcast']),
  ('00000000-0000-0000-0000-000000000002', 'youtube', 'youtube_user_101', 'mock_access_token_youtube_2', 'mock_refresh_token', true, ARRAY['https://www.googleapis.com/auth/youtube.force-ssl']),
  ('00000000-0000-0000-0000-000000000002', 'facebook', 'facebook_user_202', 'mock_access_token_facebook', 'mock_refresh_token', true, ARRAY['publish_video', 'pages_read_engagement']);

-- Insert sample streams
INSERT INTO streams (user_id, title, description, status, platforms, tags, category, is_public) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Getting Started with SwanyThree', 'Tutorial stream showing how to use SwanyThree Ultimate', 'ended', ARRAY['twitch', 'youtube'], ARRAY['tutorial', 'beginner'], 'Education', true),
  ('00000000-0000-0000-0000-000000000001', 'Weekly Tech Review', 'Reviewing the latest tech gadgets and software', 'scheduled', ARRAY['youtube'], ARRAY['tech', 'review'], 'Technology', true),
  ('00000000-0000-0000-0000-000000000002', 'Pro Gaming Session', 'Professional gaming stream with tips and tricks', 'live', ARRAY['twitch', 'youtube', 'facebook'], ARRAY['gaming', 'esports', 'live'], 'Gaming', true),
  ('00000000-0000-0000-0000-000000000002', 'Podcast: Future of Streaming', 'Discussion about the future of live streaming', 'ended', ARRAY['youtube', 'facebook'], ARRAY['podcast', 'discussion'], 'Talk Show', true);

-- Insert sample stream metrics
INSERT INTO stream_metrics (stream_id, platform, viewers_current, viewers_peak, viewers_total, likes, shares, comments, watch_time_minutes, revenue_amount) VALUES
  ((SELECT id FROM streams WHERE title = 'Getting Started with SwanyThree'), 'twitch', 0, 156, 823, 45, 12, 89, 1847, 12.50),
  ((SELECT id FROM streams WHERE title = 'Getting Started with SwanyThree'), 'youtube', 0, 234, 1205, 112, 34, 156, 2934, 23.75),
  ((SELECT id FROM streams WHERE title = 'Pro Gaming Session'), 'twitch', 342, 512, 1567, 234, 67, 456, 4523, 87.30),
  ((SELECT id FROM streams WHERE title = 'Pro Gaming Session'), 'youtube', 198, 289, 987, 156, 45, 234, 2987, 45.60),
  ((SELECT id FROM streams WHERE title = 'Pro Gaming Session'), 'facebook', 87, 134, 456, 67, 23, 98, 1234, 15.20);

-- Insert sample AI content
INSERT INTO ai_content (user_id, type, prompt, generated_content, tokens_used, metadata) VALUES
  ('00000000-0000-0000-0000-000000000001', 'podcast', 'Generate a podcast about AI in gaming', '[SPEAKER 1]: Welcome to today''s episode about AI in gaming...\n\n[SPEAKER 2]: Thanks for having me! AI is revolutionizing game development...', 2847, '{"topic": "AI in gaming", "duration": "10", "tone": "professional", "speakers": "2"}'),
  ('00000000-0000-0000-0000-000000000002', 'idea', 'Content ideas for gaming channel', 'Here are 10 viral content ideas for your gaming channel:\n1. 24-Hour Challenge: Speedrun Marathon\n2. Hidden Easter Eggs in Popular Games\n...', 1234, '{"niche": "Gaming", "platform": "youtube", "count": 10}');

-- Insert sample chat rooms
INSERT INTO chat_rooms (id, name, type, created_by) VALUES
  ('00000000-0000-0000-0000-000000000101', 'General Discussion', 'public', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000102', 'Gaming Chat', 'public', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000103', 'Tech Talk', 'group', '00000000-0000-0000-0000-000000000001');

-- Insert sample chat participants
INSERT INTO chat_participants (room_id, user_id, role) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'member'),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000002', 'member'),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000003', 'admin'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', 'admin'),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', 'admin');

-- Insert sample chat messages
INSERT INTO chat_messages (room_id, user_id, content, type) VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Welcome to SwanyThree Ultimate!', 'text'),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000002', 'Thanks! Excited to be here.', 'text'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', 'Who wants to join my stream?', 'text');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
  ('00000000-0000-0000-0000-000000000001', 'system', 'Welcome to SwanyThree!', 'Thank you for joining SwanyThree Ultimate. Get started by connecting your first platform.', false),
  ('00000000-0000-0000-0000-000000000001', 'stream_start', 'Stream Started', 'Your stream "Getting Started with SwanyThree" is now live!', true),
  ('00000000-0000-0000-0000-000000000002', 'new_follower', 'New Follower', 'You have 10 new followers this week!', false);

-- Insert sample subscriptions
INSERT INTO subscriptions (user_id, plan, status, current_period_start, current_period_end) VALUES
  ('00000000-0000-0000-0000-000000000001', 'pro', 'active', NOW(), NOW() + INTERVAL '30 days'),
  ('00000000-0000-0000-0000-000000000002', 'enterprise', 'active', NOW(), NOW() + INTERVAL '30 days');

-- Insert sample content items
INSERT INTO content (user_id, title, description, type, file_url, tags) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Intro Video', 'Channel introduction video', 'video', 'https://example.com/intro.mp4', ARRAY['intro', 'video']),
  ('00000000-0000-0000-0000-000000000002', 'Podcast Episode 1', 'First episode of my podcast', 'audio', 'https://example.com/podcast-1.mp3', ARRAY['podcast', 'audio']),
  ('00000000-0000-0000-0000-000000000001', 'Thumbnail Template', 'Stream thumbnail template', 'image', 'https://example.com/thumbnail.png', ARRAY['template', 'graphics']);

-- Output summary
SELECT
  'Test data inserted successfully!' as message,
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM streams) as streams_count,
  (SELECT COUNT(*) FROM chat_rooms) as chat_rooms_count,
  (SELECT COUNT(*) FROM notifications) as notifications_count;

-- Print login credentials
SELECT
  '=== TEST USER CREDENTIALS ===' as info
UNION ALL
SELECT 'Email: demo@swanythree.com | Password: password123 | Tier: Pro'
UNION ALL
SELECT 'Email: streamer@swanythree.com | Password: password123 | Tier: Enterprise'
UNION ALL
SELECT 'Email: admin@swanythree.com | Password: password123 | Role: Admin';
