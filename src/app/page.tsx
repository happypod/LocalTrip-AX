export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 sm:p-24 bg-background text-foreground">

      <div className="z-10 max-w-5xl w-full items-center justify-center text-sm flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          LocalTrip AX / 소원로컬트립 MVP
        </h1>
        <p className="text-muted-foreground text-xl">
          문의·연결 중심 플랫폼 - 초기 시스템 구축 중
        </p>
        <div className="mt-8 p-6 border rounded-lg bg-card shadow-sm w-full max-w-md">
          <p className="text-sm font-medium mb-4">
            T-002: 디자인 토큰 정리가 완료되었습니다.
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider font-bold">
            <div className="p-2 rounded bg-category-stay/10 text-category-stay border border-category-stay/20 flex items-center justify-center">숙소 (Stay)</div>
            <div className="p-2 rounded bg-category-experience/10 text-category-experience border border-category-experience/20 flex items-center justify-center">체험 (Experience)</div>
            <div className="p-2 rounded bg-category-program/10 text-category-program border border-category-program/20 flex items-center justify-center">주민소득상품 (Program)</div>
            <div className="p-2 rounded bg-category-course/10 text-category-course border border-category-course/20 flex items-center justify-center">코스 (Course)</div>
          </div>
        </div>
      </div>
    </main>
  );
}
