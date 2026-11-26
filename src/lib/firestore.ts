// ============================================================
// Firestore Data Fetching Helpers (With Seamless Demo Persistence)
// ============================================================
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import type {
  SiteSettings,
  ThemeColors,
  HomeContent,
  Fragrance,
  PackagingOption,
  PortfolioItem,
  Testimonial,
  ProcessStep,
  ServicesContent,
  AboutContent,
  FAQ,
  Inquiry,
  PageSEO,
  LegalPage,
} from '@/types';

// ---- Generic Helpers ----

export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
  if (!isFirebaseConfigured) {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`alfaisal_demo_${collectionName}_${docId}`);
        if (stored) return JSON.parse(stored) as T;
      } catch {
        // Fall back to null
      }
    }
    return null;
  }

  try {
    if (!db || !db.app) return null;
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
  } catch (err) {
    console.warn(`Firestore getDocument notice (${collectionName}/${docId}):`, err);
  }
  return null;
}

export async function getCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  if (!isFirebaseConfigured) {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`alfaisal_demo_col_${collectionName}`);
        if (stored) return JSON.parse(stored) as T[];
      } catch {
        // Fall back to empty
      }
    }
    return [];
  }

  try {
    if (!db || !db.app) return [];
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
  } catch (err) {
    console.warn(`Firestore getCollection notice (${collectionName}):`, err);
    return [];
  }
}

export async function setDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  if (!isFirebaseConfigured) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`alfaisal_demo_${collectionName}_${docId}`, JSON.stringify(data));
    }
    return;
  }

  if (!db || !db.app) throw new Error('Database is not initialized.');
  await setDoc(doc(db, collectionName, docId), data, { merge: true });
}

export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  if (!isFirebaseConfigured) {
    const fakeId = `demo_${Date.now()}`;
    if (typeof window !== 'undefined') {
      try {
        const current = JSON.parse(localStorage.getItem(`alfaisal_demo_col_${collectionName}`) || '[]');
        current.unshift({ id: fakeId, ...data, createdAt: new Date().toISOString() });
        localStorage.setItem(`alfaisal_demo_col_${collectionName}`, JSON.stringify(current));
      } catch {
        // Demo fallback
      }
    }
    return fakeId;
  }

  if (!db || !db.app) throw new Error('Database is not initialized.');
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: DocumentData
): Promise<void> {
  if (!isFirebaseConfigured) {
    if (typeof window !== 'undefined') {
      try {
        const current = JSON.parse(localStorage.getItem(`alfaisal_demo_col_${collectionName}`) || '[]');
        const updated = current.map((item: { id: string }) =>
          item.id === docId ? { ...item, ...data } : item
        );
        localStorage.setItem(`alfaisal_demo_col_${collectionName}`, JSON.stringify(updated));
      } catch {
        // Demo fallback
      }
    }
    return;
  }

  if (!db || !db.app) throw new Error('Database is not initialized.');
  await updateDoc(doc(db, collectionName, docId), data);
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  if (!isFirebaseConfigured) {
    if (typeof window !== 'undefined') {
      try {
        const current = JSON.parse(localStorage.getItem(`alfaisal_demo_col_${collectionName}`) || '[]');
        const filtered = current.filter((item: { id: string }) => item.id !== docId);
        localStorage.setItem(`alfaisal_demo_col_${collectionName}`, JSON.stringify(filtered));
      } catch {
        // Demo fallback
      }
    }
    return;
  }

  if (!db || !db.app) throw new Error('Database is not initialized.');
  await deleteDoc(doc(db, collectionName, docId));
}

// ---- Specific Fetchers ----

export async function getSettings(): Promise<SiteSettings | null> {
  return getDocument<SiteSettings>('settings', 'general');
}

export async function getTheme(): Promise<ThemeColors | null> {
  return getDocument<ThemeColors>('theme', 'colors');
}

export async function getHomeContent(): Promise<HomeContent | null> {
  return getDocument<HomeContent>('homeContent', 'main');
}

export async function getFragrances(publicOnly = true): Promise<Fragrance[]> {
  const constraints: QueryConstraint[] = [];
  if (publicOnly) {
    constraints.push(where('visible', '==', true));
  }
  constraints.push(orderBy('sortOrder', 'asc'));
  return getCollection<Fragrance>('fragrances', constraints);
}

export async function getFeaturedFragrances(): Promise<Fragrance[]> {
  return getCollection<Fragrance>('fragrances', [
    where('visible', '==', true),
    where('featured', '==', true),
    orderBy('sortOrder', 'asc'),
  ]);
}

export async function getFragranceById(id: string): Promise<Fragrance | null> {
  return getDocument<Fragrance>('fragrances', id);
}

export async function getPackagingOptions(publicOnly = true): Promise<PackagingOption[]> {
  const constraints: QueryConstraint[] = [];
  if (publicOnly) {
    constraints.push(where('visible', '==', true));
  }
  constraints.push(orderBy('sortOrder', 'asc'));
  return getCollection<PackagingOption>('packagingOptions', constraints);
}

export async function getPortfolio(publicOnly = true): Promise<PortfolioItem[]> {
  const constraints: QueryConstraint[] = [];
  if (publicOnly) {
    constraints.push(where('visible', '==', true));
  }
  constraints.push(orderBy('sortOrder', 'asc'));
  return getCollection<PortfolioItem>('portfolio', constraints);
}

export async function getTestimonials(publicOnly = true): Promise<Testimonial[]> {
  const constraints: QueryConstraint[] = [];
  if (publicOnly) {
    constraints.push(where('visible', '==', true));
  }
  constraints.push(orderBy('sortOrder', 'asc'));
  return getCollection<Testimonial>('testimonials', constraints);
}

export async function getProcessSteps(): Promise<ProcessStep[]> {
  return getCollection<ProcessStep>('processSteps', [orderBy('sortOrder', 'asc')]);
}

export async function getServices(): Promise<ServicesContent | null> {
  return getDocument<ServicesContent>('services', 'main');
}

export async function getAbout(): Promise<AboutContent | null> {
  return getDocument<AboutContent>('about', 'main');
}

export async function getFAQs(publicOnly = true): Promise<FAQ[]> {
  const constraints: QueryConstraint[] = [];
  if (publicOnly) {
    constraints.push(where('visible', '==', true));
  }
  constraints.push(orderBy('sortOrder', 'asc'));
  return getCollection<FAQ>('faqs', constraints);
}

export async function getInquiries(): Promise<Inquiry[]> {
  return getCollection<Inquiry>('inquiries', [orderBy('createdAt', 'desc')]);
}

export async function getPageSEO(slug: string): Promise<PageSEO | null> {
  return getDocument<PageSEO>('seo', slug);
}

export async function getLegal(page: 'privacy' | 'terms'): Promise<LegalPage | null> {
  return getDocument<LegalPage>('legal', page);
}

// ---- Inquiry Submission (public) ----

export async function submitInquiry(
  data: Omit<Inquiry, 'id' | 'status' | 'notes' | 'read' | 'createdAt'>
): Promise<string> {
  return addDocument('inquiries', {
    ...data,
    status: 'New',
    notes: '',
    read: false,
  });
}
