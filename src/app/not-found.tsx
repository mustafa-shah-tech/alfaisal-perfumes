import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] text-[#1A1A1A] px-4 text-center">
      <div className="max-w-md space-y-6">
        <span className="font-serif text-7xl sm:text-8xl font-bold text-[#B08D57] block">
          404
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">
          Page Not Found
        </h1>
        <div className="w-12 h-0.5 bg-[#B08D57] mx-auto" />
        <p className="text-sm text-[#6B6459] leading-relaxed">
          The page or fragrance reference you requested could not be located. Explore our private-label services or return to the main homepage.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-[#B08D57] hover:bg-[#8F6F3E] transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/fragrances"
            className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] border border-[#E3DACB] hover:bg-white transition-colors"
          >
            Fragrance Library
          </Link>
        </div>
      </div>
    </div>
  );
}
