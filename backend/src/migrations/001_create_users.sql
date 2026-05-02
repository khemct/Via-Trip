-- Create user roles enum
CREATE TYPE user_role AS ENUM ('traveler', 'place_owner', 'admin');

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'traveler',
  reset_token VARCHAR(255),
  reset_expires TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add index for faster email lookups
CREATE INDEX idx_users_email ON users(email);
