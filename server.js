import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compression from 'compression';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase admin client with service role key
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "https:", "data:"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "style-src": ["'self'", "'unsafe-inline'", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// JSON parsing middleware
app.use(express.json());

// API Routes for admin operations
app.post('/api/admin/update-user', async (req, res) => {
  try {
    const { userId, newPassword, user_metadata } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const updateData = {};
    
    if (newPassword && newPassword.trim()) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      updateData.password = newPassword;
    }

    if (user_metadata) {
      updateData.user_metadata = user_metadata;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, updateData);

    if (error) {
      console.error('Supabase admin error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/disable-user', async (req, res) => {
  try {
    const { userId, reason } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        account_disabled: true,
        disabled_reason: reason || 'Account disabled by admin',
        disabled_at: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Supabase admin error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, message: 'User disabled successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});