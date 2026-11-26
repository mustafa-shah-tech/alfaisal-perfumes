export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2]">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-[#E3DACB] border-t-[#B08D57] animate-spin" />
        </div>
        <div className="flex flex-col items-center">
          <span className="font-serif text-xl tracking-[0.2em] font-bold text-[#1A1A1A]">
            ALFAISAL
          </span>
          <span className="text-[9px] tracking-[0.3em] text-[#B08D57] uppercase font-semibold">
            PERFUMES
          </span>
        </div>
      </div>
    </div>
  );
}
