import { PolicyLayout } from "@/components/policies/policy-layout";

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="개인정보 처리방침" lastUpdated="2026년 5월 16일">
      <section>
        <p>
          소원 로컬트립(이하 "회사")은 이용자의 개인정보를 소중히 다루며, <strong>'개인정보 보호법'</strong> 및 관련 법령을 준수합니다.
        </p>
        <p>
          본 방침은 회사가 제공하는 로컬트립 서비스(이하 "서비스")를 이용하는 과정에서 수집되는 개인정보의 항목, 이용 목적, 보관 기간 및 권리 행사 방법 등에 대해 상세히 설명합니다.
        </p>
      </section>

      <br/>

      <section>
        <h2>1. 수집하는 개인정보 항목</h2>
        <p>회사는 서비스 제공 및 원활한 상담을 위해 다음과 같은 개인정보를 수집합니다.</p>
        
        <h3>가. 문의 및 상담 신청 시</h3>
        <ul>
          <li><strong>필수 항목:</strong> 이름, 연락처(휴대전화 번호)</li>
          <li><strong>선택 항목:</strong> 이메일 주소, 희망 여행 날짜, 인원수, 기타 요청사항</li>
        </ul>

        <h3>나. 서비스 이용 과정에서 생성되는 정보</h3>
        <ul>
          <li>IP 주소, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록, 기기 정보</li>
        </ul>
      </section>

      <br/>

      <section>
        <h2>2. 개인정보의 이용 목적</h2>
        <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
        <ul>
          <li><strong>상담 및 서비스 문의 대응:</strong> 이용자가 선택한 숙소, 체험, 프로그램 파트너와의 연결 및 상담 확인</li>
          <li><strong>서비스 제공 및 개선:</strong> 여행 취향(페르소나) 분석을 통한 맞춤형 콘텐츠 추천, 서비스 UI/UX 최적화</li>
          <li><strong>고객 관리:</strong> 서비스 이용에 따른 본인 확인, 고지사항 전달, 민원 처리</li>
        </ul>
      </section>

      <br/>

      <section>
        <h2>3. 개인정보의 제3자 제공</h2>
        <p>
          회사는 이용자의 개인정보를 제1조에서 명시한 범위 내에서만 사용하며, 이용자의 사전 동의 없이는 원칙적으로 외부(제3자)에 제공하지 않습니다.
        </p>
        <p>
          단, <strong>이용자가 직접 특정 파트너에게 문의를 남긴 경우</strong>, 상담 목적에 한하여 해당 파트너에게 개인정보가 전달됩니다.
        </p>
      </section>

      <br/>

      <section>
        <h2>4. 개인정보의 보유 및 이용 기간</h2>
        <p>
          회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계 법령에 따라 보존할 필요가 있는 경우 아래와 같이 일정 기간 보존합니다.
        </p>
        <ul>
          <li><strong>상담 문의 및 예약 관련 기록:</strong> 1년 (전자상거래법)</li>
          <li><strong>웹사이트 방문 기록:</strong> 3개월 (통신비밀보호법)</li>
        </ul>
      </section>

      <br/>

      <section>
        <h2>5. 개인정보 보호책임자 및 상담 창구</h2>
        <p>이용자의 개인정보를 보호하고 관련 불만을 처리하기 위하여 다음과 같이 담당 부서를 지정하고 있습니다.</p>
        <ul>
          <li><strong>성명:</strong> 운영 총괄 담당자</li>
          <li><strong>연락처:</strong> 010-2840-1649</li>
          <li><strong>이메일:</strong> happypd@gmail.com</li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
