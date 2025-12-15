import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full">
      <div className="bg-[#ED6A0F]">
        <div className="h-20 flex items-center px-5 sm:px-10 lg:px-16">
          <div className="relative h-28 w-28">
            <Image
              src="/hipermaxi.png"
              alt="Hipermaxi"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      <div className="h-1 bg-[#0349AB]" />
    </header>
  );
}
