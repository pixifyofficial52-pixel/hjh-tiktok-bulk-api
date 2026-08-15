const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ===== BRANDING =====
const BRANDING = {
  developed_by: "HJ-HACKER",
  whatsapp_channel: "https://whatsapp.com/channel/0029VbAaNJ6C1FuB0mIAx93M",
  main_site: "https://hamza-jutt-7d6.pages.dev/",
  note: "🔥 Follow HJ-HACKER for more tools, apps & tech updates!",
  version: "1.0.0"
};

// ============================================================
// ===== TIKTOK BULK API =====
// ============================================================

/**
 * Get all videos from a TikTok user
 * 
 * @param {string} target - TikTok username (e.g., @username)
 * @param {string} cursor - Pagination cursor (optional)
 * @returns {Object} - List of videos with download links
 */
app.get('/api/tiktok-bulk', async (req, res) => {
  const { target, cursor } = req.query;

  // Check if target is provided
  if (!target) {
    return res.status(400).json({
      success: false,
      error: 'Target username is required',
      usage: {
        by_username: '/api/tiktok-bulk?target=@username',
        with_cursor: '/api/tiktok-bulk?target=@username&cursor=NEXT_CURSOR'
      },
      credits: BRANDING,
      example: '/api/tiktok-bulk?target=@ameerhamzajutt999'
    });
  }

  try {
    const cleanTarget = target.toString().trim();
    console.log('📱 TikTok Bulk Search:', cleanTarget);

    // ===== BUILD API URL =====
    let apiUrl = `https://tik-tok-bulk.fakcloud.tech/api?target=${encodeURIComponent(cleanTarget)}`;
    if (cursor) {
      apiUrl += `&cursor=${encodeURIComponent(cursor)}`;
    }
    console.log('🔄 Calling TikTok Bulk API:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 seconds (bulk download takes time)
    });

    const data = response.data;
    console.log('✅ TikTok Bulk Response received');

    // ===== CHECK IF DATA FOUND =====
    if (!data || !data.videos || data.videos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No videos found for this user',
        credits: BRANDING,
        target: cleanTarget
      });
    }

    // ===== FORMAT RESPONSE =====
    const videos = data.videos.map((video, index) => ({
      id: index + 1,
      thumbnail: video.thumbnail || null,
      views: video.views || '0',
      download_link: video.downloadLink || null
    }));

    res.json({
      credits: BRANDING,
      status: true,
      results: {
        status: true,
        source: "TikTok Bulk API",
        data: {
          target: cleanTarget,
          total_videos: videos.length,
          next_cursor: data.nextCursor || null,
          videos: videos
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ TikTok Bulk Error:', error.message);
    
    let errorMessage = 'Failed to fetch TikTok videos. Please try again later.';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. The server is taking too long to respond.';
    } else if (error.response?.status === 404) {
      errorMessage = 'User not found. Please check the username.';
    } else if (error.response?.status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      credits: BRANDING,
      debug: {
        target: cleanTarget,
        error_details: error.message
      }
    });
  }
});

// ============================================================
// ===== HOME PAGE =====
// ============================================================
app.get('/', (req, res) => {
  res.json({
    name: "HJ-HACKER TikTok Bulk API",
    version: "1.0.0",
    status: "🟢 Online",
    developer: "HJ-HACKER",
    website: "https://hamza-jutt-7d6.pages.dev/",
    whatsapp: "https://whatsapp.com/channel/0029VbAaNJ6C1FuB0mIAx93M",
    endpoints: {
      tiktok_bulk: "/api/tiktok-bulk?target=@USERNAME"
    },
    examples: {
      basic: "/api/tiktok-bulk?target=@ameerhamzajutt999",
      with_cursor: "/api/tiktok-bulk?target=@ameerhamzajutt999&cursor=NEXT_CURSOR"
    }
  });
});

// ============================================================
// ===== 404 HANDLER =====
// ============================================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found. Available endpoint: /api/tiktok-bulk',
    credits: BRANDING,
    available_endpoints: {
      tiktok_bulk: "/api/tiktok-bulk?target=@USERNAME"
    },
    examples: {
      example: "/api/tiktok-bulk?target=@ameerhamzajutt999"
    }
  });
});

// ============================================================
// ===== START SERVER =====
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 HJ-HACKER TikTok Bulk API running on port ${PORT}`);
  console.log(`🌐 Website: https://hamza-jutt-7d6.pages.dev/`);
  console.log(`📱 WhatsApp Channel: ${BRANDING.whatsapp_channel}`);
  console.log(`\n📌 Endpoint:`);
  console.log(`  → TikTok Bulk:  /api/tiktok-bulk?target=@username`);
});
