import { PolicyLayout } from "@/components/policies/policy-layout";

export default function CookiePolicyPage() {
  return (
    <PolicyLayout title="쿠키 정책" lastUpdated="2026년 5월 16일">
      <section>
        <p>
          소원 로컬트립은 이용자에게 최적화된 서비스를 제공하기 위해 '쿠키(Cookie)'를 사용합니다.
        </p>
        <p>
          본 정책은 쿠키의 정의, 사용 목적 및 이용자의 관리 방법에 대해 안내합니다.
        </p>
      </section>

      <br/>

      <section>
        <h2>1. 쿠키란 무엇인가요?</h2>
        <p>
          쿠키는 웹사이트 방문 시 이용자의 브라우저에 저장되는 아주 작은 텍스트 파일입니다.
        </p>
        <p>
          웹사이트는 이 파일을 통해 이용자의 설정 상태를 기억하거나, 재방문 시 맞춤형 환경을 제공할 수 있습니다.
        </p>
      </section>

      <br/>

      <section>
        <h2>2. 쿠키 사용 목적</h2>
        <p>회사는 다음과 같은 서비스 품질 향상을 위해 쿠키를 활용합니다.</p>
        <ul>
          <li><strong>필수적인 기능 유지:</strong> 언어 설정, 여행 취향(페르소나) 테마 상태를 유지하여 중복 설정을 방지합니다.</li>
          <li><strong>서비스 개선 및 분석:</strong> 방문자가 사이트를 이용하는 패턴을 분석하여 인터페이스를 개선하고 성능을 최적화합니다.</li>
          <li><strong>보안 강화:</strong> 이용자의 안전한 서비스 이용을 돕고 부정 이용을 방지합니다.</li>
        </ul>
      </section>

      <br/>

      <section>
        <h2>3. 쿠키의 보관 기간</h2>
        <ul>
          <li><strong>세션 쿠키:</strong> 브라우저를 종료하면 즉시 삭제되는 일시적인 쿠키입니다.</li>
          <li><strong>영구 쿠키:</strong> 이용자가 직접 삭제하거나 설정된 만료 시간이 지날 때까지 유지되어, 재방문 시 편의를 제공합니다.</li>
        </ul>
      </section>

      <br/>

      <section>
        <h2>4. 이용자의 쿠키 관리 및 거부 방법</h2>
        <p>
          이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 브라우저 옵션을 설정함으로써 모든 쿠키를 허용하거나, 저장될 때마다 확인을 거치거나, 모든 쿠키의 저장을 거부할 수 있습니다.
        </p>
        <p><strong>주요 브라우저별 설정 안내:</strong></p>
        <ul>
          <li><strong>Chrome:</strong> 설정 {">"} 개인정보 및 보안 {">"} 쿠키 및 기타 사이트 데이터</li>
          <li><strong>Safari:</strong> 환경설정 {">"} 개인정보 보호 {">"} 모든 쿠키 차단</li>
          <li><strong>Edge:</strong> 설정 {">"} 쿠키 및 사이트 권한 {">"} 쿠키 및 사이트 데이터 관리</li>
        </ul>
        <p className="mt-4 text-xs text-persona-muted/60">
          ※ 쿠키 저장을 거부할 경우, 언어 설정이나 테마 유지 등 일부 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.
        </p>
      </section>
    </PolicyLayout>
  );
}
