import { PolicyLayout } from "@/components/policies/policy-layout";

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="환불 정책" lastUpdated="2026년 5월 16일">
      <section>
        <p>
          소원 로컬트립은 이용자와 파트너 간의 공정한 거래를 위해 본 환불 정책을 운영합니다.
        </p>
        <p>
          <strong>단, 개별 상품 페이지에 별도의 환불 규정이 명시된 경우 해당 규정이 본 정책보다 우선하여 적용됩니다.</strong>
        </p>
      </section>

      <br/>

      <section>
        <h2>1. 숙소 및 체험 공통 취소 규정</h2>
        <p>예약 확정 후 이용자의 변심으로 인한 취소 시, 이용일로부터 남은 기간에 따라 다음과 같은 환불 비율이 적용됩니다.</p>
        
        <div className="my-6 overflow-hidden rounded-xl border border-persona-primary/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-persona-surface/50 font-bold text-persona-text">
              <tr>
                <th className="px-4 py-3">취소 시점 (이용일 기준)</th>
                <th className="px-4 py-3">환불 금액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-persona-primary/5 text-persona-muted">
              <tr>
                <td className="px-4 py-3 font-medium text-persona-text">7일 전까지</td>
                <td className="px-4 py-3">전액 환불</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-persona-text">5일 전까지</td>
                <td className="px-4 py-3">총 요금의 90% 환불</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-persona-text">3일 전까지</td>
                <td className="px-4 py-3">총 요금의 70% 환불</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-persona-text">1일 전까지</td>
                <td className="px-4 py-3">총 요금의 50% 환불</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-persona-text">당일 및 노쇼(No-show)</td>
                <td className="px-4 py-3 text-red-500 font-bold">환불 불가</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <br/>

      <section>
        <h2>2. 주민소득 프로그램(미식/체험) 특약</h2>
        <p>
          마을 주민들이 공동으로 식재료를 준비하거나 인력을 배치하는 <strong>'주민소득 모델'</strong> 프로그램의 경우, 준비 단계에서의 손실 방지를 위해 <strong>이용 3일 전부터는 취소 및 환불이 엄격히 제한</strong>될 수 있습니다. 
        </p>
        <p className="text-xs text-persona-muted/60">※ 예약 확정 전 파트너와의 상담을 통해 해당 프로그램의 특약 사항을 반드시 확인하시기 바랍니다.</p>
      </section>

      <br/>

      <section>
        <h2>3. 기상 악화 및 불가항력적 사유</h2>
        <p>
          강풍, 풍랑 경보 등 기상 악화로 인해 선박 운항이 중단되거나 실외 체험 진행이 불가능한 경우, 파트너와의 확인 절차를 거쳐 <strong>전액 환불 또는 일정 변경</strong>이 가능합니다.
        </p>
      </section>

      <br/>

      <section>
        <h2>4. 환불 절차 안내</h2>
        <ul>
          <li><strong>외부 예약 플랫폼 이용 시:</strong> 네이버 예약 등 해당 플랫폼의 환불 시스템을 통해 신청 및 처리됩니다.</li>
          <li><strong>직접 입금 및 예약 시:</strong> 파트너에게 취소 의사를 전달한 후, 파트너의 확인을 거쳐 영업일 기준 3~5일 이내에 지정한 계좌로 환불됩니다.</li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
