import { Metadata } from "next";
import { getPrisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { AIPlaceholderCard } from "@/components/admin/ai/ai-placeholder-card";
import { FileText, Megaphone, Compass, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "AX 콘텐츠 도우미 | LocalTrip AX",
};

export const dynamic = "force-dynamic";

export default async function AIAssistantPage() {
  await requireAdminSession();

  let stats = {
    stays: 0,
    experiences: 0,
    programs: 0,
    courses: 0,
  };

  try {
    const prisma = getPrisma();
    await prisma.$connect();

    const sowonRegion = await prisma.region.findUnique({
      where: { slug: "sowon" },
      select: { id: true },
    });

    if (sowonRegion) {
      const [stays, experiences, programs, courses] = await Promise.all([
        prisma.accommodation.count({ where: { regionId: sowonRegion.id, status: "published" } }),
        prisma.experience.count({ where: { regionId: sowonRegion.id, status: "published" } }),
        prisma.localIncomeProgram.count({ where: { regionId: sowonRegion.id, status: "published" } }),
        prisma.course.count({ where: { regionId: sowonRegion.id, status: "published" } }),
      ]);
      stats = { stays, experiences, programs, courses };
    }
  } catch (err) {
    console.error("AX Assistant stats loading failed:", err);
  }

  const totalPublished = stats.stays + stats.experiences + stats.programs + stats.courses;

  return (
    <AdminShell title="AX 콘텐츠 도우미">
      <div className="flex flex-col gap-8 py-6 max-w-7xl mx-auto">
        
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl border border-primary/10 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-1/2 -right-10 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" /> AI-driven Local Business Optimization
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            소원권역 AX 콘텐츠 도우미
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
            현재 MVP 단계에서는 실제 AI 연동 대신 **콘텐츠 기획 템플릿과 확장 설계 지점**을 제공합니다.  
            향후 소형 언어 모델(SLM)을 연동하여 입점 소상공인의 홍보 경쟁력을 도약시키는 혁신 도구로 기능합니다.
          </p>

          {/* Current Published Stats summary block */}
          <div className="mt-6 flex flex-wrap gap-4 border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-100 text-xs text-gray-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              활성 숙소: <strong className="text-gray-900 font-semibold">{stats.stays}개</strong>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-100 text-xs text-gray-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              활성 체험: <strong className="text-gray-900 font-semibold">{stats.experiences}개</strong>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-100 text-xs text-gray-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              활성 주민소득상품: <strong className="text-gray-900 font-semibold">{stats.programs}개</strong>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-gray-100 text-xs text-gray-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              활성 추천 코스: <strong className="text-gray-900 font-semibold">{stats.courses}개</strong>
            </div>
            <div className="bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 text-xs text-primary font-bold">
              총 {totalPublished}개의 등록 콘텐츠 기반 AI 확장 로드맵 대기 중
            </div>
          </div>
        </div>

        {/* Core Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          <AIPlaceholderCard 
            title="상품 소개 문안 초안 생성"
            targets="숙소, 체험, 주민소득상품"
            exampleTitle="제목 개선 및 요약문 상세구조화"
            icon={<FileText className="w-6 h-6" />}
            exampleContent={
              <div className="space-y-1">
                <p><strong>[BEFORE]</strong> 소원면 서핑 체험 (평범한 제목)</p>
                <p className="text-green-600 font-semibold"><strong>[AFTER AI]</strong> 소원 해변의 푸른 파도를 오롯이 안는 하루: 초보 서퍼 패키지</p>
                <p className="text-xs text-gray-500 mt-1">✓ 타겟 연령층 분석 맞춤형 소구 문구와 이색적인 서사형 상세 요약 자동 구성을 지원합니다.</p>
              </div>
            }
          />

          <AIPlaceholderCard 
            title="홍보 채널 전용 카피 초안"
            targets="카카오톡 채널, 블로그, 인스타그램, 네이버 플레이스"
            exampleTitle="인스타그램 맞춤 해시태그 및 피드용 설명문"
            icon={<Megaphone className="w-6 h-6" />}
            exampleContent={
              <div className="space-y-1">
                <p>🏄‍♂️ 파도 소리와 함께 시작되는 소원권역의 낭만 라이프! 지금 프로필 링크를 클릭해 특별 체험 혜택을 선점하세요. #소원로컬트립 #서핑명소 #감성로컬체험</p>
                <p className="text-xs text-gray-500 mt-1">✓ 채널 성격에 맞는 톤앤매너(감성형, 정보형, 프로모션형) 카피라이팅을 1초 만에 구성합니다.</p>
              </div>
            }
          />

          <AIPlaceholderCard 
            title="지역 연계 추천 코스 자동 기획"
            targets="숙소 + 체험 + 주민소득상품 교차 조합"
            exampleTitle="1박 2일 생태 관광 코스 제안"
            icon={<Compass className="w-6 h-6" />}
            exampleContent={
              <div className="space-y-1">
                <p><strong>• 1일차:</strong> 푸른 소원 서핑 (체험) ➔ 바다 전망 감성 스테이 (숙소)</p>
                <p><strong>• 2일차:</strong> 주민 직접 운영 전통 고택 찻집 투어 (주민소득상품)</p>
                <p className="text-xs text-gray-500 mt-1">✓ 권역 내 입점 업소들의 지리적 정보와 카테고리를 자동 매칭하여 촘촘한 코스 초안을 제안합니다.</p>
              </div>
            }
          />

          <AIPlaceholderCard 
            title="어드민 스마트 운영 진단"
            targets="클릭 이벤트, 상담 문의, 입점 신청 데이터 분석"
            exampleTitle="인기 및 이탈 구간 모니터링 분석"
            icon={<TrendingUp className="w-6 h-6" />}
            exampleContent={
              <div className="space-y-1">
                <p>📢 [분석 보고] 이번 달 **전화 문의 대비 카카오 상담 선호도**가 35% 증가했습니다. 숙소 페이지 하단에 카카오톡 상담 바로가기 배너를 추가하여 전환율을 개선하십시오.</p>
                <p className="text-xs text-gray-500 mt-1">✓ 무작위의 데이터 지표를 자연어 형태의 명확한 개선 인사이트로 탈바꿈시켜 관리자에게 리포트합니다.</p>
              </div>
            }
          />

        </div>

        {/* Information Bottom Board */}
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center text-xs md:text-sm text-gray-500 font-medium">
          현재 MVP에서는 실제 AI 연동을 통해 데이터베이스에 저장하는 변형(Mutation) 기능은 작동하지 않습니다.  
          관리자가 직접 결과값을 검토·수정·배포하는 투명한 인간 개입 제어구조(HITL) 체계를 6순위 이후 단계에 덧붙여 나갈 예정입니다.
        </div>

      </div>
    </AdminShell>
  );
}
