// Mock campaign data for Play
// 3 example campaigns the bot can "generate"

window.PLAY_CAMPAIGNS = [
  {
    id: 'oat-milk-launch',
    trigger: /oat\s*milk|launch a product|launch product|new product|product launch/i,
    brief: "Launching a new oat milk for indie cafés",
    intro: "Ooh, an indie oat milk launch — chef's kiss 👨‍🍳. Here's a 3-platform drop designed to feel handcrafted, a little cheeky, and barista-approved.",
    posts: {
      instagram: {
        caption: "Meet OAT-OUI 🥛 — the velvety, slow-pressed oat milk made for the kind of latte you Instagram before you sip.",
        body: "Crafted in small batches. Stretches like a dream. Doesn't split when you're stressed.\n\nDropping at 12 indie cafés near you, Friday.",
        hashtags: ["#oatoui", "#oatmilkdrop", "#baristasonly", "#latteart", "#smallbatch"],
        time: "Fri · 8:42 AM",
        format: "Carousel · 4 frames",
        accent: "var(--tang)",
      },
      facebook: {
        caption: "We made an oat milk that finally respects the barista. Introducing OAT-OUI.",
        body: "After 47 test batches and one tearful cupping session, we're proud to launch OAT-OUI — the slow-pressed oat milk for cafés who care about the foam.\n\nFind it at participating indie spots this Friday. Tag your local café below — we'll send them a free crate.",
        hashtags: ["#OatOui", "#IndieCafé", "#NewLaunch"],
        time: "Fri · 9:15 AM",
        format: "Single image + link",
        accent: "var(--ocean)",
      },
      tiktok: {
        caption: "POV: your latte finally has a personality 🥛✨",
        body: "Hook (0–2s): close-up steam wand pour\nBeat 1: split-screen vs. supermarket oat milk\nBeat 2: barista nods, slow-mo foam art\nBeat 3: bottle reveal — OAT-OUI\nCTA: \"Friday. 12 cafés. Limited drop.\"",
        hashtags: ["#oatmilk", "#cafétok", "#baristatok", "#fyp"],
        time: "Fri · 7:30 PM",
        format: "Vertical · 18s",
        accent: "var(--bubble)",
      },
    },
  },
  {
    id: 'sale-vintage',
    trigger: /sale|discount|promo|grow my brand|brand grow/i,
    brief: "Weekend sale for a vintage clothing brand",
    intro: "A weekend sale, you say? Let's make it feel like a treasure hunt, not a clearance bin. Here's the three-platform plan:",
    posts: {
      instagram: {
        caption: "48 HOURS. 200 ONE-OF-ONES. NO RESTOCK. 🧷",
        body: "Our weekend dig is open: leather, denim, weirdly perfect knits. If you see it and love it, grab it — we genuinely cannot get another one.\n\nLink in bio. Sat 10am.",
        hashtags: ["#vintagedrop", "#oneofone", "#thrifted", "#secondhandstyle"],
        time: "Sat · 9:00 AM",
        format: "Reel · 9s + Carousel",
        accent: "var(--grape)",
      },
      facebook: {
        caption: "The weekend dig is back — Saturday 10am.",
        body: "Two days. Two hundred pieces. Zero restocks. Our hand-picked vintage drop returns this weekend, with everything from 70s suede to 90s denim worth crying over.\n\nReply 'DIG' to get the early-access link 30 minutes before doors open.",
        hashtags: ["#WeekendSale", "#VintageFinds"],
        time: "Sat · 9:30 AM",
        format: "Event post",
        accent: "var(--leaf)",
      },
      tiktok: {
        caption: "rate my picks before the weekend dig drops 👇",
        body: "Hook (0–2s): rummaging through a rack, fast cuts\nBeat 1: pulling 'the one' — outfit reveal\nBeat 2: price tag flick — \"all under $80\"\nBeat 3: rack empties, screen reads SAT 10AM\nCTA: \"set a reminder, it sells in minutes\"",
        hashtags: ["#vintagetok", "#thriftflip", "#ootd", "#fyp"],
        time: "Fri · 8:00 PM",
        format: "Vertical · 22s",
        accent: "var(--sun)",
      },
    },
  },
  {
    id: 'app-onboarding',
    trigger: /app|tech|saas|software|launch|grow/i,
    brief: "Growth campaign for a sleep app",
    intro: "Sleep apps are a crowded shelf — let's lead with feeling, not features. Three platforms, one dreamy mood:",
    posts: {
      instagram: {
        caption: "your brain at 11:47pm doesn't need another podcast. it needs a lullaby. 🌙",
        body: "Hush is the bedtime app that doesn't try to optimise you. Pick a story, pick a sound, fall asleep. That's it. That's the post.\n\nFree for 14 nights. iOS + Android.",
        hashtags: ["#sleepbetter", "#hushapp", "#bedtimeritual", "#sleepaesthetic"],
        time: "Sun · 9:45 PM",
        format: "Single post + Story",
        accent: "var(--ocean)",
      },
      facebook: {
        caption: "Sleep, but soft. Try Hush free for 14 nights.",
        body: "We built Hush for the people who've tried every meditation app and still lie awake at 1am. No streaks, no scores — just stories read in a gentle voice, and sounds that don't loop weirdly.\n\nFree for two weeks. Cancel any time, no guilt.",
        hashtags: ["#Hush", "#BetterSleep"],
        time: "Sun · 8:00 PM",
        format: "Carousel · 3 frames",
        accent: "var(--grape)",
      },
      tiktok: {
        caption: "the app that finally got me to put my phone down 😴",
        body: "Hook (0–2s): phone face-down, lamp clicks off\nBeat 1: ASMR-style narrator reading\nBeat 2: cosy room visuals, soft rain\nBeat 3: morning — \"slept 7h 42m\"\nCTA: \"Hush. Free for 14 nights.\"",
        hashtags: ["#sleeptok", "#nightroutine", "#hush", "#fyp"],
        time: "Sun · 10:15 PM",
        format: "Vertical · 15s",
        accent: "var(--bubble)",
      },
    },
  },
];

window.PLAY_SESSIONS = [
  { id: 's1', title: "Oat milk launch — indie cafés", color: 'var(--tang)', when: 'Today' },
  { id: 's2', title: "Weekend vintage sale", color: 'var(--grape)', when: 'Yesterday' },
  { id: 's3', title: "Sleep app — soft growth", color: 'var(--ocean)', when: '2d ago' },
  { id: 's4', title: "Hot sauce rebrand teaser", color: 'var(--leaf)', when: 'Last week' },
  { id: 's5', title: "Yoga studio open house", color: 'var(--bubble)', when: 'Last week' },
];

window.PLAY_SUGGESTIONS = [
  { label: "Launch a product", icon: "rocket", color: "var(--tang)" },
  { label: "Grow my brand", icon: "sprout", color: "var(--leaf)" },
  { label: "Run a sale", icon: "tag", color: "var(--bubble)" },
  { label: "Hype an event", icon: "spark", color: "var(--grape)" },
  { label: "Tease a drop", icon: "bolt", color: "var(--sun)" },
];

window.pickCampaign = function (text) {
  const list = window.PLAY_CAMPAIGNS;
  for (const c of list) {
    if (c.trigger.test(text || '')) return c;
  }
  // fallback: rotate
  const idx = (window.__playRotate = ((window.__playRotate ?? -1) + 1)) % list.length;
  return list[idx];
};
