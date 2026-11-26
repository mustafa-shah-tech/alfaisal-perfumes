// ============================================================
// Alfaisal Perfumes — Comprehensive Firestore Database Seeder
// ============================================================
// Run with: npx tsx scripts/seed.ts
// Populates all collections with rich, production-ready placeholder data.

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error('\n❌ ERROR: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing.');
  console.error('Please configure your Firebase credentials in .env.local before running the seed script.\n');
  process.exit(1);
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function runSeed() {
  console.log('🌱 Starting Alfaisal Perfumes Database Seed...');

  // 1. Settings
  console.log('→ Seeding settings/general...');
  await setDoc(doc(db, 'settings', 'general'), {
    businessName: 'Alfaisal Perfumes',
    logo: {
      type: 'text',
      text: 'ALFAISAL',
      imageUrl: '',
    },
    tagline: 'Your Name. Your Scent. Your Perfume Brand.',
    subHeadline: 'We build your perfume business, from the first fragrance to the finished bottle.',
    favicon: '',
    phone: '',
    whatsapp: '',
    whatsappMessage: 'Hello! I am interested in creating a custom perfume brand with Alfaisal Perfumes.',
    email: '',
    address: 'Malakand, Khyber Pakhtunkhwa (KPK), Pakistan',
    socialLinks: {
      instagram: '',
      facebook: '',
      tiktok: '',
    },
    footerText: '© Alfaisal Perfumes. All rights reserved.',
  });

  // 2. Theme Colors
  console.log('→ Seeding theme/colors...');
  await setDoc(doc(db, 'theme', 'colors'), {
    background: '#FAF7F2',
    surface: '#EFE8DC',
    primaryText: '#1A1A1A',
    secondaryText: '#6B6459',
    accent: '#B08D57',
    accentDark: '#8F6F3E',
    darkBg: '#14110F',
    borders: '#E3DACB',
  });

  // 3. Home Content
  console.log('→ Seeding homeContent/main...');
  await setDoc(doc(db, 'homeContent', 'main'), {
    heroTitle: 'Your Name. Your Scent. Your Perfume Brand.',
    heroSubtitle: 'We build your perfume business, from the first fragrance to the finished bottle.',
    heroImage: '',
    heroCtaText: 'Get a Free Quote',
    heroSecondaryCtaText: 'See How It Works',
    trustStrip: [
      { icon: '✦', text: 'Your Brand Name on Every Bottle' },
      { icon: '◈', text: 'Premium Concentration (EDP / EDT)' },
      { icon: '❖', text: 'Low Minimum Order Quantities' },
      { icon: '✧', text: 'Fast, Personal Turnkey Service' },
    ],
    whatWeDoTitle: 'Private-Label Spray Perfume Manufacturing',
    whatWeDoText:
      'Alfaisal Perfumes creates custom-branded spray perfumes (EDP / EDT) for other businesses. You bring your brand name, and we manufacture the perfumes under that brand: fragrance formulation, bottle selection, cap pairing, custom label finishing, and luxury presentation box production.',
    whyChooseTitle: 'Why Visionary Brands Partner With Alfaisal',
    whyChooseItems: [
      {
        title: 'Artisan Oil Formulations',
        description: 'Masterfully blended fragrance oils with long-lasting sillage and projection, rigorously tested for stability.',
        icon: '01',
      },
      {
        title: 'Turnkey Hardware & Packaging',
        description: 'From heavy-base glass flacons to foil-stamped labels and rigid gift boxes, every detail is handled seamlessly.',
        icon: '02',
      },
      {
        title: 'Low Startup MOQs',
        description: 'Test your target market without crippling upfront capital. We support flexible batch quantities for emerging brands.',
        icon: '03',
      },
      {
        title: 'Authentic Local Craft',
        description: 'Formulated and crafted in Malakand, KPK, Pakistan, ensuring direct communication, transparent pricing, and rapid delivery.',
        icon: '04',
      },
    ],
    ctaTitle: 'Ready to Launch Your Own Signature Perfume Brand?',
    ctaText:
      'Whether you run a boutique, fashion salon, or are launching a new consumer brand, we make custom fragrance manufacturing straightforward, prestigious, and profitable.',
    sectionVisibility: {
      trustStrip: true,
      whatWeDo: true,
      process: true,
      featuredFragrances: true,
      whyChoose: true,
      portfolio: true,
      testimonials: true,
      cta: true,
    },
  });

  // 4. Process Steps (5 Steps)
  console.log('→ Seeding processSteps...');
  const processSteps = [
    {
      title: 'Consultation',
      description: 'Tell us about your brand vision, target demographic, and preferred fragrance families.',
      icon: '1',
      sortOrder: 1,
    },
    {
      title: 'Choose Fragrances',
      description: 'Select your signature scent profiles from our library of French and Oriental formulations.',
      icon: '2',
      sortOrder: 2,
    },
    {
      title: 'Design Packaging',
      description: 'Customize your flacon, atomiser, metal caps, foil labels, and rigid luxury gift box.',
      icon: '3',
      sortOrder: 3,
    },
    {
      title: 'Sample Approval',
      description: 'Experience pre-production physical samples and refine notes until completely satisfied.',
      icon: '4',
      sortOrder: 4,
    },
    {
      title: 'Production & Delivery',
      description: 'We blend, bottle, label, crimp, box, and deliver your finished perfumes across Pakistan.',
      icon: '5',
      sortOrder: 5,
    },
  ];
  for (let i = 0; i < processSteps.length; i++) {
    await setDoc(doc(db, 'processSteps', `step-${i + 1}`), processSteps[i]);
  }

  // 5. Fragrance Library (12 Original Luxury Placeholders)
  console.log('→ Seeding fragrances (12 items)...');
  const fragrances = [
    {
      name: 'Midnight Amber Oud',
      description: 'A regal and hypnotic nocturnal blend of smoky Cambodian agarwood, roasted tonka bean, and molten golden amber.',
      family: 'Woody',
      gender: 'Unisex',
      notesTop: 'Bergamot, Pink Peppercorn, Saffron',
      notesHeart: 'Smoky Oud, Bulgarian Rose, Leather',
      notesBase: 'Golden Amber, Tonka Bean, Cedarwood',
      imageUrl: '',
      featured: true,
      visible: true,
      sortOrder: 1,
    },
    {
      name: 'Velvet Jasmine Mist',
      description: 'An ethereal and radiant bouquet of night-blooming white jasmine draped in crystalline neroli and soft cashmeran.',
      family: 'Floral',
      gender: 'Women',
      notesTop: 'Neroli, Mandarin Blossom, Green Leaves',
      notesHeart: 'Sambac Jasmine, Damask Rose, White Iris',
      notesBase: 'Cashmeran, White Musk, Bourbon Vanilla',
      imageUrl: '',
      featured: true,
      visible: true,
      sortOrder: 2,
    },
    {
      name: 'Cedar & Black Pepper',
      description: 'A sharply tailored masculine composition built around crisp Atlas cedarwood, cracked black peppercorn, and vetiver.',
      family: 'Woody',
      gender: 'Men',
      notesTop: 'Cracked Black Pepper, Calabrian Bergamot, Cardamom',
      notesHeart: 'Cedar Needle, Clary Sage, Smoked Birch',
      notesBase: 'Atlas Cedarwood, Haitian Vetiver, Patchouli',
      imageUrl: '',
      featured: true,
      visible: true,
      sortOrder: 3,
    },
    {
      name: 'Imperial Saffron Noir',
      description: 'Rich strands of Kashmiri saffron laced over dark plum liqueur, aged oak casks, and velvety tobacco leaves.',
      family: 'Oriental',
      gender: 'Unisex',
      notesTop: 'Dark Plum, Wild Saffron, Cinnamon Bark',
      notesHeart: 'Tobacco Flower, Cistus Labdanum, Dry Cacao',
      notesBase: 'Aged Oak, Indonesian Patchouli, Black Vanilla',
      imageUrl: '',
      featured: true,
      visible: true,
      sortOrder: 4,
    },
    {
      name: 'Citrus Breeze & Vetiver',
      description: 'An invigorating blast of sparkling Amalfi lemon and bitter grapefruit descending into a clean mineral dry-down.',
      family: 'Citrus',
      gender: 'Men',
      notesTop: 'Amalfi Lemon, Bitter Grapefruit, Crisp Mint',
      notesHeart: 'Juniper Berry, Ginger Root, Sea Salt',
      notesBase: 'Haitian Vetiver, Grey Cedar, Dry Amber',
      imageUrl: '',
      featured: false,
      visible: true,
      sortOrder: 5,
    },
    {
      name: 'Rose Damascena Royale',
      description: 'A contemporary tribute to legendary Damask roses, underscored by dew-kissed litchi and white woods.',
      family: 'Floral',
      gender: 'Women',
      notesTop: 'Lychee Fruit, Pink Pepper, Morning Dew',
      notesHeart: 'Damask Rose Petals, Peony, Geranium Leaf',
      notesBase: 'White Sandalwood, Clear Musk, Modern Amber',
      imageUrl: '',
      featured: true,
      visible: true,
      sortOrder: 6,
    },
    {
      name: 'White Musk & Cashmere',
      description: 'Pure tactile comfort in a bottle. Second-skin white musk intertwines with warm cashmere woods and sandalwood.',
      family: 'Musk',
      gender: 'Unisex',
      notesTop: 'Clean Cotton, Aldehydes, White Pear',
      notesHeart: 'Lily of the Valley, Cashmere Accord, Orris',
      notesBase: 'Skin Musk, Australian Sandalwood, Ambergris',
      imageUrl: '',
      featured: false,
      visible: true,
      sortOrder: 7,
    },
    {
      name: 'Smoked Vanilla Bourbon',
      description: 'Dark, intoxicating Madagascar vanilla pods steeped in aged bourbon, scorched sugar, and guaiac wood.',
      family: 'Gourmand',
      gender: 'Unisex',
      notesTop: 'Rum Accord, Bitter Almond, Caramelized Sugar',
      notesHeart: 'Vanilla Orchid, Guaiac Wood, Nutmeg',
      notesBase: 'Bourbon Vanilla Beans, Benzoin, Benzoin Resin',
      imageUrl: '',
      featured: true,
      visible: true,
      sortOrder: 8,
    },
    {
      name: 'Aegean Mineral Aqua',
      description: 'The sensation of sea salt crystals on sun-warmed skin mingled with coastal sage, rosemary, and driftwood.',
      family: 'Aquatic',
      gender: 'Unisex',
      notesTop: 'Sea Salt, Ozone Accord, Bergamot',
      notesHeart: 'Coastal Sage, Cyclamen, Rosemary',
      notesBase: 'Bleached Driftwood, Oakmoss, Ambergris',
      imageUrl: '',
      featured: false,
      visible: true,
      sortOrder: 9,
    },
    {
      name: 'Silver Sage & Cardamom',
      description: 'A crisp, magnetic aromatic blend designed for the modern gentleman, layered over rich cypress.',
      family: 'Fresh',
      gender: 'Men',
      notesTop: 'Green Cardamom, Mandarin, Violet Leaf',
      notesHeart: 'Clary Sage, Lavender Spike, Cypress',
      notesBase: 'Smoky Vetiver, Leather Accord, White Cedar',
      imageUrl: '',
      featured: false,
      visible: true,
      sortOrder: 10,
    },
    {
      name: 'Golden Sandalwood Blossom',
      description: 'Creamy Mysore sandalwood bathed in sunlit solar notes, orange blossom absolute, and honeyed heliotrope.',
      family: 'Oriental',
      gender: 'Women',
      notesTop: 'Solar Accord, Orange Blossom, Apricot Nectar',
      notesHeart: 'Heliotrope, Ylang-Ylang, White Gardenia',
      notesBase: 'Mysore Sandalwood, Golden Resin, Creamy Musk',
      imageUrl: '',
      featured: false,
      visible: true,
      sortOrder: 11,
    },
    {
      name: 'Sultanate Spice Reserve',
      description: 'A lavish oriental tapestry of royal cloves, black coriander, roasted cumin, and rich amber resins.',
      family: 'Spicy',
      gender: 'Men',
      notesTop: 'Coriander Seed, Blood Orange, Allspice',
      notesHeart: 'Clove Bud, Cumin Seed, Nutmeg, Rose',
      notesBase: 'Rich Frankincense, Benzoin, Dark Amber',
      imageUrl: '',
      featured: false,
      visible: true,
      sortOrder: 12,
    },
  ];

  for (let i = 0; i < fragrances.length; i++) {
    await setDoc(doc(db, 'fragrances', `fragrance-${i + 1}`), {
      ...fragrances[i],
      createdAt: new Date().toISOString(),
    });
  }

  // 6. Packaging Options
  console.log('→ Seeding packagingOptions (6 items)...');
  const packagingOptions = [
    {
      title: 'Architectural Heavy-Base Glass (50ml / 100ml)',
      description: 'Ultra-clear cosmetic flint glass with a weighted base that feels substantial and luxurious in hand.',
      imageUrl: '',
      sortOrder: 1,
      visible: true,
    },
    {
      title: 'Minimalist Cylindrical Spray Bottles',
      description: 'Timeless round bottles suited for contemporary unisex and niche indie perfume concepts.',
      imageUrl: '',
      sortOrder: 2,
      visible: true,
    },
    {
      title: 'Hot-Foil & Embossed Metallic Labels',
      description: 'Waterproof, oil-resistant textured paper stock embellished with gold or silver foil stamping.',
      imageUrl: '',
      sortOrder: 3,
      visible: true,
    },
    {
      title: 'Rigid Luxury Presentation Gift Boxes',
      description: 'Custom-die-cut dense cardboard presentation boxes with soft-touch velvet or EVA foam inserts.',
      imageUrl: '',
      sortOrder: 4,
      visible: true,
    },
    {
      title: 'Precision Fine-Mist Atomisers & Weighted Caps',
      description: 'Engineered Italian-style spray pumps matched with magnetic snap closures in brushed gold or chrome.',
      imageUrl: '',
      sortOrder: 5,
      visible: true,
    },
    {
      title: 'Pocket Travel Sprays & Discovery Vials',
      description: 'Branded pocket atomisers for travel editions and tester sample discovery sets.',
      imageUrl: '',
      sortOrder: 6,
      visible: true,
    },
  ];
  for (let i = 0; i < packagingOptions.length; i++) {
    await setDoc(doc(db, 'packagingOptions', `packaging-${i + 1}`), packagingOptions[i]);
  }

  // 7. Portfolio (Brands We've Built)
  console.log('→ Seeding portfolio (4 brands)...');
  const portfolioItems = [
    {
      brandName: 'Nocturne Atelier',
      description: 'A luxury haute-parfumerie line created for a premier lifestyle concept boutique in Lahore.',
      imageUrl: '',
      visible: true,
      sortOrder: 1,
    },
    {
      brandName: 'Maison Khyber',
      description: 'Heritage private-label fragrance line celebrating indigenous botanical notes of Northern Pakistan.',
      imageUrl: '',
      visible: true,
      sortOrder: 2,
    },
    {
      brandName: 'Aura Bloom Couture',
      description: 'A delicate bridal and evening perfume collection formulated for an upscale design house in Islamabad.',
      imageUrl: '',
      visible: true,
      sortOrder: 3,
    },
    {
      brandName: 'Vanguard Grooming Club',
      description: 'An invigorating masculine barbershop and fragrance line featuring fresh aquatic-citrus notes.',
      imageUrl: '',
      visible: true,
      sortOrder: 4,
    },
  ];
  for (let i = 0; i < portfolioItems.length; i++) {
    await setDoc(doc(db, 'portfolio', `portfolio-${i + 1}`), portfolioItems[i]);
  }

  // 8. Testimonials
  console.log('→ Seeding testimonials (4 items)...');
  const testimonials = [
    {
      name: 'Kamran Siddiqui',
      role: 'Founder',
      company: 'Siddiqui Apparel & Lifestyle',
      text: 'Alfaisal Perfumes made launching our signature brand effortless. The fragrance quality rivals imported designer scents.',
      imageUrl: '',
      visible: true,
      sortOrder: 1,
    },
    {
      name: 'Dr. Fatima Noor',
      role: 'Managing Director',
      company: 'Lumière Aesthetics & Spa',
      text: 'Finding a reliable private-label manufacturer in Pakistan with low MOQs and luxury bottle finishes was a game-changer.',
      imageUrl: '',
      visible: true,
      sortOrder: 2,
    },
    {
      name: 'Bilal Afridi',
      role: 'Creative Director',
      company: 'Northwind Boutique',
      text: 'From the initial scent consultation in KPK to the arrival of our embossed gift boxes, the process was transparent and world-class.',
      imageUrl: '',
      visible: true,
      sortOrder: 3,
    },
    {
      name: 'Zainab Qazi',
      role: 'Brand Manager',
      company: 'Velvet Horizon Bridal',
      text: 'Our clients adore the bespoke wedding favor perfumes Alfaisal created for our haute-couture bridal collection.',
      imageUrl: '',
      visible: true,
      sortOrder: 4,
    },
  ];
  for (let i = 0; i < testimonials.length; i++) {
    await setDoc(doc(db, 'testimonials', `testimonial-${i + 1}`), testimonials[i]);
  }

  // 9. Services
  console.log('→ Seeding services/main...');
  await setDoc(doc(db, 'services', 'main'), {
    title: 'Bespoke Private Label Perfume Manufacturing',
    intro:
      'We empower boutiques, fashion houses, beauty salons, corporate gift specialists, and ambitious entrepreneurs to launch their own luxury fragrance brands. From olfactory formulation to bespoke packaging, Alfaisal Perfumes handles every step with artisan craftsmanship and commercial reliability.',
    included: [
      'Private-label Eau de Parfum (EDP) & Eau de Toilette (EDT) formulations',
      'Custom bottle selection (50ml, 100ml, travel sizes, luxury cylinders & squares)',
      'High-end cap and atomiser choices (gold, matte black, silver, weighted magnetic)',
      'Custom label design, foil stamping, embossing, and waterproof finishes',
      'Rigid luxury presentation boxes, sleeve boxes, and boutique carton packaging',
      'Low minimum order quantities (MOQ) tailored for startups and test launches',
      'Fragrance sample approval kit before final bulk production batching',
      'End-to-end quality assurance and batch consistency checks',
      'Comprehensive logistics coordination directly from Malakand, KPK across Pakistan',
    ],
    sections: [
      {
        title: '1. Fragrance Selection & Olfactory Profile',
        description: 'Choose from our curated master collection of French and Oriental fragrance formulations.',
        imageUrl: '',
      },
      {
        title: '2. Bottle & Hardware Customization',
        description: 'Select from heavy-base crystal glass, frosted minimalism, tinted amber, or architectural squares.',
        imageUrl: '',
      },
      {
        title: '3. Label & Box Packaging Engineering',
        description: 'From metallic gold hot foil stamping to velvety soft-touch lamination, your packaging looks world-class.',
        imageUrl: '',
      },
      {
        title: '4. Batch Production & Fast Turnaround',
        description: 'We blend, macerate, filter, bottle, and seal your perfumes under rigorous quality control.',
        imageUrl: '',
      },
    ],
    ctaText: 'Launch Your Signature Fragrance Brand Today',
    ctaDescription: 'Request a private label consultation and sample kit in PKR.',
  });

  // 10. About
  console.log('→ Seeding about/main...');
  await setDoc(doc(db, 'about', 'main'), {
    title: 'Artisan Perfumery Meets Commercial Excellence',
    story: `Alfaisal Perfumes was founded with a singular conviction: exceptional private-label fragrance manufacturing should be accessible to visionary entrepreneurs, boutiques, salons, and established fashion houses without requiring astronomical minimum orders or foreign supply chain nightmares.\n\nRooted in Malakand, Khyber Pakhtunkhwa (KPK), our workshop blends the age-old heritage of Eastern olfactory traditions with contemporary European formulation standards. We partner with passionate brand owners across Pakistan and beyond, providing the formulation artistry, luxury bottle sourcing, custom box packaging, and precision batch production required to take a fragrance brand from concept to shelf.\n\nWhether you are launching your first signature scent or extending an established lifestyle brand, we treat your business reputation as sacred. Every spray that leaves our facility reflects meticulous oil balancing, thorough maceration, and flawless presentation.`,
    mission:
      'To be Pakistan’s most trusted and prestigious private-label perfume manufacturing partner, turning entrepreneurial fragrance visions into world-class consumer products.',
    values: [
      {
        title: 'Uncompromised Oil Quality',
        description: 'We formulate using premium grade fragrance oils ensuring high concentration EDP ratings and exceptional skin-safe longevity.',
      },
      {
        title: 'Artisan Craftsmanship',
        description: 'Every bottle, label, pump, and box is inspected by hand to guarantee flawless retail presentation.',
      },
      {
        title: 'Empowering Local Brands',
        description: 'We champion Pakistani entrepreneurs by lowering technical barriers to entry and providing honest advisory.',
      },
      {
        title: 'Confidentiality & Integrity',
        description: 'Your custom formulations and private brand recipes remain strictly proprietary trade secrets.',
      },
    ],
    locationText:
      'Proudly based in Malakand, Khyber Pakhtunkhwa (KPK), Pakistan. From the serene valleys of KPK, we blend and dispatch custom private-label fragrance consignments to clients throughout Islamabad, Lahore, Karachi, Peshawar, and across the nation.',
    images: [],
  });

  // 11. FAQ (10 items)
  console.log('→ Seeding faqs (10 items)...');
  const faqs = [
    {
      question: 'What is private-label perfume manufacturing?',
      answer: 'Private-label manufacturing means we formulate, bottle, label, and package luxury perfumes under your brand name. You provide your brand identity and vision, and Alfaisal Perfumes handles the formulation, hardware sourcing, and production.',
      sortOrder: 1,
      visible: true,
    },
    {
      question: 'What is your Minimum Order Quantity (MOQ)?',
      answer: 'We understand that emerging brands and boutiques need flexible order sizes. Our minimum order quantities are designed to be accessible for startup launches. Please contact us with your bottle style and packaging preferences for our current introductory MOQ specifications.',
      sortOrder: 2,
      visible: true,
    },
    {
      question: 'How long does the entire production process take?',
      answer: 'Standard turnarounds generally range from 2 to 4 weeks depending on bottle style selection, custom label printing, and proper maceration time to ensure maximum scent stability.',
      sortOrder: 3,
      visible: true,
    },
    {
      question: 'Can I test fragrance samples before placing a full batch order?',
      answer: 'Yes, sample approval is an essential milestone in our 5-step process. Once we discuss your brand profile, we prepare and dispatch a fragrance sample kit for your evaluation.',
      sortOrder: 4,
      visible: true,
    },
    {
      question: 'Do you provide label and box packaging design assistance?',
      answer: 'Yes. If you have an existing logo or brand colors, our production team assists with technical die-lines, label material selection (foil stamping, matte, gloss), and luxury presentation box layout.',
      sortOrder: 5,
      visible: true,
    },
    {
      question: 'How is the pricing calculated for custom perfume orders?',
      answer: 'Pricing in PKR is determined by three transparent factors: your chosen perfume oil concentration (EDP / EDT), the selected bottle and cap hardware, and your total batch quantity. Contact us for a detailed quote.',
      sortOrder: 6,
      visible: true,
    },
    {
      question: 'What concentration of perfume oil do you use?',
      answer: 'We specialize in Eau de Parfum (EDP) formulations with generous fragrance oil concentrations (typically 18% to 25%), guaranteeing superior projection and longevity.',
      sortOrder: 7,
      visible: true,
    },
    {
      question: 'Where is Alfaisal Perfumes located, and do you ship across Pakistan?',
      answer: 'We are headquartered in Malakand, Khyber Pakhtunkhwa (KPK), Pakistan. We safely package and dispatch finished consignments nationwide via insured express logistics.',
      sortOrder: 8,
      visible: true,
    },
    {
      question: 'Can I provide my own bottles or custom packaging?',
      answer: 'Yes. While we offer a full catalog of ready-to-brand bottles, pumps, and rigid gift boxes, clients with their own proprietary bottles are welcome to supply their hardware.',
      sortOrder: 9,
      visible: true,
    },
    {
      question: 'How do I start building my brand with Alfaisal Perfumes?',
      answer: 'Getting started is straightforward: submit a quote request on our Contact page or message us directly on WhatsApp with your brand concept.',
      sortOrder: 10,
      visible: true,
    },
  ];
  for (let i = 0; i < faqs.length; i++) {
    await setDoc(doc(db, 'faqs', `faq-${i + 1}`), faqs[i]);
  }

  // 12. Legal Pages
  console.log('→ Seeding legal/privacy and legal/terms...');
  await setDoc(doc(db, 'legal', 'privacy'), {
    title: 'Privacy Policy',
    content: `
      <h3>1. Information We Collect</h3>
      <p>Alfaisal Perfumes collects information when you request a custom quote or consultation through our website. This includes your name, business name, email, phone/WhatsApp, and fragrance notes.</p>
      <h3>2. How We Use Your Information</h3>
      <p>Your details are used strictly to communicate regarding your private-label manufacturing inquiry. We do not sell or trade your details.</p>
      <h3>3. Confidentiality</h3>
      <p>We hold our clients' brand names, label artworks, and proprietary fragrance specifications in the strictest confidence.</p>
    `,
  });

  await setDoc(doc(db, 'legal', 'terms'), {
    title: 'Terms & Conditions of Service',
    content: `
      <h3>1. Scope of Service</h3>
      <p>Alfaisal Perfumes operates as a custom private-label fragrance manufacturer. Our website is an informational and quote-request portal; it is not an e-commerce direct retail store.</p>
      <h3>2. Quotations and Orders</h3>
      <p>All quotes are denominated in PKR and remain valid for the period stated. Production begins following sample approval.</p>
      <h3>3. Governing Law</h3>
      <p>These terms are governed by the applicable laws of Khyber Pakhtunkhwa and Pakistan.</p>
    `,
  });

  // 13. SEO
  console.log('→ Seeding seo metadata...');
  const seoPages = [
    { slug: 'home', title: 'Alfaisal Perfumes — Custom Private Label Perfumes', metaDescription: 'Private-label spray perfumes (EDP / EDT) crafted for visionary businesses and boutiques in Pakistan.' },
    { slug: 'services', title: 'Private Label Services — Alfaisal Perfumes', metaDescription: 'End-to-end custom perfume branding: scent selection, flacon choice, foil-stamped labels, and rigid boxes.' },
    { slug: 'fragrances', title: 'Fragrance Formulation Library — Alfaisal Perfumes', metaDescription: 'Explore our master library of French and Oriental fragrance formulations ready for your brand.' },
    { slug: 'packaging', title: 'Packaging & Bottle Options — Alfaisal Perfumes', metaDescription: 'Heavy-base glass flacons, fine-mist spray pumps, weighted caps, and custom presentation boxes.' },
    { slug: 'portfolio', title: 'Brands We’ve Built — Alfaisal Perfumes', metaDescription: 'Case studies of custom private-label fragrance lines developed for boutiques across Pakistan.' },
    { slug: 'about', title: 'About Alfaisal Perfumes — Malakand, KPK, Pakistan', metaDescription: 'Artisan perfume craftsmanship rooted in Malakand, KPK, empowering Pakistani entrepreneurs.' },
    { slug: 'faq', title: 'Frequently Asked Questions — Alfaisal Perfumes', metaDescription: 'Answers regarding minimum order quantities (MOQ), production timelines, and sample kits.' },
    { slug: 'contact', title: 'Request a Quote — Alfaisal Perfumes', metaDescription: 'Send a quote request or consultation message for your custom perfume brand launch.' },
  ];
  for (const page of seoPages) {
    await setDoc(doc(db, 'seo', page.slug), {
      pageSlug: page.slug,
      title: page.title,
      metaDescription: page.metaDescription,
      ogImage: '',
    });
  }

  console.log('\n✅ SEEDING COMPLETE! All collections populated with professional private-label content.');
}

runSeed().catch((error) => {
  console.error('\n❌ Seeding failed:', error);
  process.exit(1);
});
