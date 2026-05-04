export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 sm:p-24 bg-background text-foreground">

      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          LocalTrip AX / 소원로컬트립 MVP
        </h1>
        <p className="text-muted-foreground text-xl">
          문의·연결 중심 플랫폼 - 초기 시스템 구축 중
        </p>
        <div className="mt-8 p-6 border rounded-lg bg-card shadow-sm">
          <p className="text-sm">
            T-001: 프로젝트 초기 세팅이 완료되었습니다.
          </p>
        </div>
      </div>
    </main>
  );
}
