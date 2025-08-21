-- New Labs Table
CREATE TABLE labs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  tool_url TEXT, -- URL to embedded tool
  creator_id UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lab Sessions Table
CREATE TABLE lab_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lab_id UUID REFERENCES labs(id),
  user_id UUID REFERENCES auth.users(id),
  session_data JSONB, -- Store session state
  created_at TIMESTAMP DEFAULT NOW()
);

-- New Labs Table
CREATE TABLE labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tool_url TEXT,  -- URL to embedded tool
    lab_type VARCHAR(100), -- 'flashcard', 'quiz', 'interview', etc.
    creator_id UUID REFERENCES auth.users(id),
    is_public BOOLEAN DEFAULT false,
    difficulty_level INTEGER DEFAULT 1,
    exam_category VARCHAR(100), -- 'UPSC', 'SSC', 'Banking'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Lab Sessions Table
CREATE TABLE lab_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_id UUID REFERENCES labs(id),
    user_id UUID REFERENCES auth.users(id),
    session_data JSONB, -- Store session state
    progress_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in minutes
    score INTEGER,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Lab Analytics Table
CREATE TABLE lab_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    lab_id UUID REFERENCES labs(id),
    event_type VARCHAR(100), -- 'start', 'complete', 'pause', 'resume'
    event_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Learning Progress
CREATE TABLE user_learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    subject VARCHAR(100),
    topic VARCHAR(200),
    mastery_level DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 1.00
    last_reviewed TIMESTAMP,
    next_review TIMESTAMP,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);