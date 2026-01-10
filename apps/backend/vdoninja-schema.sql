-- VDO.Ninja Rooms Table
-- Add this to your existing schema or run separately

CREATE TABLE IF NOT EXISTS vdoninja_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  workflow VARCHAR(50) NOT NULL,
  links JSONB NOT NULL,
  instructions TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_vdoninja_rooms_user_id ON vdoninja_rooms(user_id);
CREATE INDEX idx_vdoninja_rooms_is_active ON vdoninja_rooms(is_active);

-- RLS Policies
ALTER TABLE vdoninja_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own VDO.Ninja rooms" ON vdoninja_rooms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own VDO.Ninja rooms" ON vdoninja_rooms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own VDO.Ninja rooms" ON vdoninja_rooms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own VDO.Ninja rooms" ON vdoninja_rooms
  FOR DELETE USING (auth.uid() = user_id);

-- Auto-update trigger for updated_at
CREATE TRIGGER update_vdoninja_rooms_updated_at BEFORE UPDATE ON vdoninja_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE vdoninja_rooms IS 'VDO.Ninja remote guest rooms and configurations';
