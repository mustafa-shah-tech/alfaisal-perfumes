'use client';

import { useState, useEffect, useMemo } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import FragranceCard from '@/components/fragrances/FragranceCard';
import FragranceModal from '@/components/fragrances/FragranceModal';
import { Fragrance, FragranceGender, FragranceFamily } from '@/types';
import { getFragrances } from '@/lib/firestore';
import { useSettings } from '@/hooks/useSettings';
import { FRAGRANCE_FAMILIES, FRAGRANCE_GENDERS } from '@/lib/constants';
import { placeholderImage } from '@/lib/utils';

// Default 12 original luxury placeholder fragrances
const SEED_FRAGRANCES: Fragrance[] = [
  {
    id: 'frag-1',
    name: 'Midnight Amber Oud',
    description: 'A regal and hypnotic nocturnal blend of smoky Cambodian agarwood, roasted tonka bean, and molten golden amber. Perfect for prestigious boutique collections.',
    family: 'Woody',
    gender: 'Unisex',
    notesTop: 'Bergamot, Pink Peppercorn, Saffron',
    notesHeart: 'Smoky Oud, Bulgarian Rose, Leather',
    notesBase: 'Golden Amber, Tonka Bean, Cedarwood',
    imageUrl: placeholderImage(400, 530, 'Midnight Amber Oud', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-2',
    name: 'Velvet Jasmine Mist',
    description: 'An ethereal and radiant bouquet of night-blooming white jasmine draped in crystalline neroli, softened by sheer cashmeran and powdery iris.',
    family: 'Floral',
    gender: 'Women',
    notesTop: 'Neroli, Mandarin Blossom, Green Leaves',
    notesHeart: 'Sambac Jasmine, Damask Rose, White Iris',
    notesBase: 'Cashmeran, White Musk, Bourbon Vanilla',
    imageUrl: placeholderImage(400, 530, 'Velvet Jasmine Mist', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-3',
    name: 'Cedar & Black Pepper',
    description: 'A sharply tailored and masculine composition built around crisp Atlas cedarwood, cracked black peppercorn, and earthy vetiver roots.',
    family: 'Woody',
    gender: 'Men',
    notesTop: 'Cracked Black Pepper, Calabrian Bergamot, Cardamom',
    notesHeart: 'Cedar Needle, Clary Sage, Smoked Birch',
    notesBase: 'Atlas Cedarwood, Haitian Vetiver, Patchouli',
    imageUrl: placeholderImage(400, 530, 'Cedar & Black Pepper', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-4',
    name: 'Imperial Saffron Noir',
    description: 'Rich strands of Kashmiri saffron laced over dark plum liqueur, aged oak casks, and velvety tobacco leaves. Warm, opulent, and magnetic.',
    family: 'Oriental',
    gender: 'Unisex',
    notesTop: 'Dark Plum, Wild Saffron, Cinnamon Bark',
    notesHeart: 'Tobacco Flower, Cistus Labdanum, Dry Cacao',
    notesBase: 'Aged Oak, Indonesian Patchouli, Black Vanilla',
    imageUrl: placeholderImage(400, 530, 'Imperial Saffron Noir', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-5',
    name: 'Citrus Breeze & Vetiver',
    description: 'An invigorating blast of sparkling Amalfi lemon, bitter grapefruit, and iced mineral accord descending into a crisp, clean woody dry-down.',
    family: 'Citrus',
    gender: 'Men',
    notesTop: 'Amalfi Lemon, Bitter Grapefruit, Crisp Mint',
    notesHeart: 'Juniper Berry, Ginger Root, Sea Salt',
    notesBase: 'Haitian Vetiver, Grey Cedar, Dry Amber',
    imageUrl: placeholderImage(400, 530, 'Citrus Breeze & Vetiver', 'bottle'),
    featured: false,
    visible: true,
    sortOrder: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-6',
    name: 'Rose Damascena Royale',
    description: 'A contemporary tribute to legendary Taif and Damask roses, underscored by dew-kissed litchi, pink champagne, and soft white woods.',
    family: 'Floral',
    gender: 'Women',
    notesTop: 'Lychee Fruit, Pink Pepper, Morning Dew',
    notesHeart: 'Damask Rose Petals, Peony, Geranium Leaf',
    notesBase: 'White Sandalwood, Clear Musk, Modern Amber',
    imageUrl: placeholderImage(400, 530, 'Rose Damascena Royale', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 6,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-7',
    name: 'White Musk & Cashmere',
    description: 'Pure tactile comfort in a bottle. Second-skin white musk intertwines with warm cashmere woods, milky sandalwood, and clean linen accord.',
    family: 'Musk',
    gender: 'Unisex',
    notesTop: 'Clean Cotton, Aldehydes, White Pear',
    notesHeart: 'Lily of the Valley, Cashmere Accord, Orris',
    notesBase: 'Skin Musk, Australian Sandalwood, Ambergris',
    imageUrl: placeholderImage(400, 530, 'White Musk & Cashmere', 'bottle'),
    featured: false,
    visible: true,
    sortOrder: 7,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-8',
    name: 'Smoked Vanilla Bourbon',
    description: 'Dark, intoxicating Madagascar vanilla pods steeped in aged bourbon, scorched sugar crystals, and smoldering guaiac wood.',
    family: 'Gourmand',
    gender: 'Unisex',
    notesTop: 'Rum Accord, Bitter Almond, Caramelized Sugar',
    notesHeart: 'Vanilla Orchid, Guaiac Wood, Nutmeg',
    notesBase: 'Bourbon Vanilla Beans, Benzoin, Benzoin Resin',
    imageUrl: placeholderImage(400, 530, 'Smoked Vanilla Bourbon', 'bottle'),
    featured: true,
    visible: true,
    sortOrder: 8,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-9',
    name: 'Aegean Mineral Aqua',
    description: 'The sensation of Mediterranean sea salt crystals on sun-warmed skin, mingled with coastal sage, driftwood, and oceanic mineral accords.',
    family: 'Aquatic',
    gender: 'Unisex',
    notesTop: 'Sea Salt, Ozone Accord, Bergamot',
    notesHeart: 'Coastal Sage, Cyclamen, Rosemary',
    notesBase: 'Bleached Driftwood, Oakmoss, Ambergris',
    imageUrl: placeholderImage(400, 530, 'Aegean Mineral Aqua', 'bottle'),
    featured: false,
    visible: true,
    sortOrder: 9,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-10',
    name: 'Silver Sage & Cardamom',
    description: 'A crisp, magnetic aromatic blend designed for the modern gentleman. Clary sage and crushed cardamom pods layered over rich cypress.',
    family: 'Fresh',
    gender: 'Men',
    notesTop: 'Green Cardamom, Mandarin, Violet Leaf',
    notesHeart: 'Clary Sage, Lavender Spike, Cypress',
    notesBase: 'Smoky Vetiver, Leather Accord, White Cedar',
    imageUrl: placeholderImage(400, 530, 'Silver Sage & Cardamom', 'bottle'),
    featured: false,
    visible: true,
    sortOrder: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-11',
    name: 'Golden Sandalwood Blossom',
    description: 'Creamy Mysore sandalwood bathed in sunlit solar notes, orange blossom absolute, and honeyed heliotrope petals.',
    family: 'Oriental',
    gender: 'Women',
    notesTop: 'Solar Accord, Orange Blossom, Apricot Nectar',
    notesHeart: 'Heliotrope, Ylang-Ylang, White Gardenia',
    notesBase: 'Mysore Sandalwood, Golden Resin, Creamy Musk',
    imageUrl: placeholderImage(400, 530, 'Golden Sandalwood Blossom', 'bottle'),
    featured: false,
    visible: true,
    sortOrder: 11,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'frag-12',
    name: 'Sultanate Spice Reserve',
    description: 'A lavish oriental tapestry of royal cloves, black coriander, roasted cumin, and rich amber resins. Full-bodied, intense, and lasting.',
    family: 'Spicy',
    gender: 'Men',
    notesTop: 'Coriander Seed, Blood Orange, Allspice',
    notesHeart: 'Clove Bud, Cumin Seed, Nutmeg, Rose',
    notesBase: 'Rich Frankincense, Benzoin, Dark Amber',
    imageUrl: placeholderImage(400, 530, 'Sultanate Spice Reserve', 'bottle'),
    featured: false,
    visible: true,
    sortOrder: 12,
    createdAt: new Date().toISOString(),
  },
];

export default function FragrancesPage() {
  const { settings } = useSettings();
  const [fragrances, setFragrances] = useState<Fragrance[]>(SEED_FRAGRANCES);
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalFragrance, setActiveModalFragrance] = useState<Fragrance | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getFragrances(true);
        if (data && data.length > 0) {
          setFragrances(data);
        }
      } catch (err) {
        console.warn('Using seed fragrances:', err);
      }
    }
    loadData();
  }, []);

  // Filtered fragrances
  const filteredFragrances = useMemo(() => {
    return fragrances.filter((frag) => {
      // Gender filter
      if (selectedGender !== 'All' && frag.gender !== selectedGender) {
        return false;
      }
      // Family filter
      if (selectedFamily !== 'All' && frag.family !== selectedFamily) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = frag.name.toLowerCase().includes(query);
        const matchesDesc = frag.description.toLowerCase().includes(query);
        const matchesNotes =
          (frag.notesTop && frag.notesTop.toLowerCase().includes(query)) ||
          (frag.notesHeart && frag.notesHeart.toLowerCase().includes(query)) ||
          (frag.notesBase && frag.notesBase.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesNotes) {
          return false;
        }
      }
      return true;
    });
  }, [fragrances, selectedGender, selectedFamily, searchQuery]);

  return (
    <PublicLayout>
      <div className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Intro */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-accent)] uppercase">
            Private Label Olfactory Library
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary-text)] tracking-tight">
            Curated Fragrance Collection
          </h1>
          <div className="w-16 h-0.5 bg-[var(--color-accent)] mx-auto mt-6 mb-6" />
          <p className="text-base text-[var(--color-secondary-text)] leading-relaxed">
            Select from our master formulation archive to brand under your own name. Every scent is formulated with high perfume oil concentration (EDP / EDT) for projection, longevity, and timeless appeal.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[var(--color-surface)]/70 backdrop-blur-sm rounded-2xl border border-[var(--color-borders)] p-6 mb-12 space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Gender Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white/70 rounded-full border border-[var(--color-borders)] w-fit self-center sm:self-auto overflow-x-auto">
              {['All', ...FRAGRANCE_GENDERS].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setSelectedGender(gender)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 whitespace-nowrap ${
                    selectedGender === gender
                      ? 'bg-[var(--color-accent)] text-white shadow-sm'
                      : 'text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>

            {/* Fragrance Family Dropdown & Search Input */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Family Dropdown */}
              <div className="w-full sm:w-auto">
                <select
                  value={selectedFamily}
                  onChange={(e) => setSelectedFamily(e.target.value)}
                  className="w-full sm:w-48 px-3.5 py-2 text-xs font-medium bg-white rounded-lg border border-[var(--color-borders)] text-[var(--color-primary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  aria-label="Filter by fragrance family"
                >
                  <option value="All">All Fragrance Families</option>
                  {FRAGRANCE_FAMILIES.map((family) => (
                    <option key={family} value={family}>
                      {family}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search notes, names..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-lg border border-[var(--color-borders)] text-[var(--color-primary-text)] placeholder-[var(--color-secondary-text)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
                <svg
                  className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-secondary-text)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-xs text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick family chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--color-borders)]/60">
            <span className="text-[11px] font-semibold text-[var(--color-secondary-text)] mr-1">
              Popular Families:
            </span>
            {['Floral', 'Woody', 'Oriental', 'Fresh', 'Citrus', 'Musk'].map((fam) => (
              <button
                key={fam}
                onClick={() => setSelectedFamily(selectedFamily === fam ? 'All' : fam)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                  selectedFamily === fam
                    ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent-dark)] font-semibold border border-[var(--color-accent)]/40'
                    : 'bg-white/60 text-[var(--color-secondary-text)] hover:bg-white border border-[var(--color-borders)]'
                }`}
              >
                {fam}
              </button>
            ))}
            {(selectedFamily !== 'All' || selectedGender !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedGender('All');
                  setSelectedFamily('All');
                  setSearchQuery('');
                }}
                className="text-[11px] font-semibold text-[var(--color-accent-dark)] hover:underline ml-auto"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Fragrance Grid */}
        {filteredFragrances.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredFragrances.map((fragrance) => (
              <FragranceCard
                key={fragrance.id}
                fragrance={fragrance}
                onClick={(frag) => setActiveModalFragrance(frag)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/60 rounded-3xl border border-[var(--color-borders)]">
            <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-secondary-text)] mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-semibold text-[var(--color-primary-text)]">
              No fragrances match your filters
            </h3>
            <p className="mt-2 text-sm text-[var(--color-secondary-text)] max-w-md mx-auto">
              Try adjusting your gender, fragrance family, or keyword search to explore other formulations in our library.
            </p>
            <button
              onClick={() => {
                setSelectedGender('All');
                setSelectedFamily('All');
                setSearchQuery('');
              }}
              className="mt-6 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Modal */}
        <FragranceModal
          fragrance={activeModalFragrance}
          whatsappNumber={settings.whatsapp}
          onClose={() => setActiveModalFragrance(null)}
        />
      </div>
    </PublicLayout>
  );
}
