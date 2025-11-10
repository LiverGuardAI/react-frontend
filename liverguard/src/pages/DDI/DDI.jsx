// C:\react-frontend\liverguard\src\pages\DDI\DDI.jsx (대체 약물 기능 최종본)

import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // 검색 드롭다운

// --- 결과 표시 컴포넌트들 (이전과 동일) ---
const RenderResults = ({ apiResponse }) => {
  // (이전과 동일, 생략)
  const { ai_predictions, drugbank_checks, kfda_checks } = apiResponse;
  const noAiResults = !ai_predictions || ai_predictions.length === 0;
  const noDbResults = !drugbank_checks || drugbank_checks.length === 0;
  const noKfdaResults = !kfda_checks || kfda_checks.length === 0;
  if (noAiResults && noDbResults && noKfdaResults) {
    return (
      <div style={{ color: 'green', marginTop: '15px' }}>
        ✅ [통합 검사] 선택된 약물 조합에서 AI, DrugBank, KFDA 상호작용이 발견되지 않았습니다.
      </div>
    );
  }
  return (
    <div>
      {/* 1. DrugBank */}
      <SectionWrapper title="1. DrugBank DB 병용금기 (1차 검사)">
        {noDbResults ? (
          <SuccessMessage text="✅ [DrugBank] 선택된 약물 간 상호작용이 없습니다." />
        ) : (
          drugbank_checks.map((item, index) => (
            <ResultItem key={`db-${index}`} title={`금기 조합: '${item.drug_a}' + '${item.drug_b}'`} subtitle={`상호작용 (ID: ${item.ddi_id}): ${item.event}`} description={`기전: ${item.description}`} level="high"/>
          ))
        )}
      </SectionWrapper>
      {/* 2. KFDA */}
      <SectionWrapper title="2. KFDA 고시 병용금기 (2차 검사)">
        {noKfdaResults ? (
          <SuccessMessage text="✅ [KFDA] 선택된 약물 간 병용금기 사항이 없습니다." />
        ) : (
          kfda_checks.map((item, index) => (
            <ResultItem key={`kfda-${index}`} title={`금기 조합: '${item.drug_a}' + '${item.drug_b}'`} subtitle={`금기 사유: ${item.reason}`} description="" level="high"/>
          ))
        )}
      </SectionWrapper>
      {/* 3. AI 예측 */}
      <SectionWrapper title="3. AI 기반 잠재적 상호작용 (3차 검사)">
        {noAiResults ? (
          <SuccessMessage text="✅ [AI 예측] 선택된 약물 조합에서 특이 상호작용이 발견되지 않았습니다." />
        ) : (
          ai_predictions.map((pair, index) => (
            <AiResultPair key={`ai-${index}`} pair={pair} />
          ))
        )}
      </SectionWrapper>
    </div>
  );
};
const SectionWrapper = ({ title, children }) => (
  <div style={{ marginTop: '20px', borderTop: '2px solid #007bff', paddingTop: '10px' }}>
    <h3 style={{ color: '#007bff', margin: '10px 0' }}>{title}</h3>
    {children}
  </div>
);
const SuccessMessage = ({ text }) => (
  <div style={{ color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '10px', borderRadius: '5px' }}>
    {text}
  </div>
);
const ResultItem = ({ title, subtitle, description, level }) => {
  const color = level === 'high' ? '#D32F2F' : '#FBC02D';
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: '8px', padding: '12px', marginBottom: '12px', backgroundColor: '#FFF8F8' }}>
      <h5 style={{ color: color, margin: 0 }}>🚨 {title}</h5>
      <strong style={{ display: 'block', margin: '5px 0' }}>{subtitle}</strong>
      {description && <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#333' }}>{description}</p>}
    </div>
  );
};
const AiResultPair = ({ pair }) => (
  <div style={{ border: '1px solid #e0e0e0', padding: '16px', marginBottom: '16px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
    <h4 style={{ marginTop: '0', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
      💊 조합: {pair.pair_name.replace(/'/g, '')}
    </h4>
    {pair.high_risk && pair.high_risk.length > 0 && (
      <div>
        <h5 style={{ color: '#D32F2F', margin: '10px 0 5px 0' }}>🔴 고위험 (발생 확률 &gt; 50%)</h5>
        {pair.high_risk.map((risk, i) => (<AiRiskItem key={i} risk={risk} level="high" />))}
      </div>
    )}
    {pair.medium_risk && pair.medium_risk.length > 0 && (
      <div>
        <h5 style={{ color: '#FBC02D', margin: '10px 0 5px 0' }}>🟡 중위험 (20~50%)</h5>
        {pair.medium_risk.map((risk, i) => (<AiRiskItem key={i} risk={risk} level="medium" />))}
      </div>
    )}
    {pair.low_risk && pair.low_risk.length > 0 && (
      <details style={{ marginTop: '10px' }}>
        <summary style={{ color: '#388E3C', cursor: 'pointer', fontWeight: 'bold' }}>
          🟢 저위험 (&lt; 20%) 항목 {pair.low_risk.length}건 상세 보기...
        </summary>
        <div style={{ paddingTop: '10px' }}>
          {pair.low_risk.map((risk, i) => (<AiRiskItem key={i} risk={risk} level="low" />))}
        </div>
      </details>
    )}
  </div>
);
const AiRiskItem = ({ risk, level }) => {
  const colors = { high: '#D32F2F', medium: '#FBC02D', low: '#388E3C' };
  const color = colors[level] || '#333';
  return (
    <div style={{ marginBottom: '10px', paddingLeft: '10px', borderLeft: `3px solid ${color}` }}>
      <strong>{risk.event} ({risk.probability}%)</strong>
      <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#333' }}>
        기전: {risk.description}
      </p>
    </div>
  );
};
// --- (결과 표시 컴포넌트 끝) ---


// --- [신규] 5. 대체 약물 추천 컴포넌트 ---
const AlternativeDrugs = ({ originalDrugs, problematicDrugsMap, onReset }) => {
  // problematicDrugsMap = { "Fluoxetine": "플루옥세틴 (Fluoxetine)", ... }
  
  // 1. 교체할 약물 선택 (Dropdown 옵션)
  const problematicOptions = Object.keys(problematicDrugsMap).map(eng_name => ({
    value: eng_name,
    label: problematicDrugsMap[eng_name]
  }));

  const [targetDrug, setTargetDrug] = useState(null); // 교체 대상으로 선택된 약물 (객체)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alternatives, setAlternatives] = useState(null); // { safe_alternatives: [], risky_alternatives: [] }

  const handleFetchAlternatives = () => {
    if (!targetDrug) {
      setError("교체할 약물을 먼저 선택하세요.");
      return;
    }

    // 나머지 약물 목록 (영문명)
    const opponent_drugs = originalDrugs
      .map(opt => opt.value) // {value, label} -> "eng_name"
      .filter(eng_name => eng_name !== targetDrug.value); // 교체 대상 제외

    setIsLoading(true);
    setError(null);
    setAlternatives(null);

    // [신규 API 호출] /api/get_alternatives
    fetch('http://127.0.0.1:5000/api/get_alternatives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        drug_to_replace: targetDrug.value, // 교체할 약물 (영문명)
        opponent_drugs: opponent_drugs     // 나머지 약물 (영문명 리스트)
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) { throw new Error(data.error); }
        setAlternatives(data); // { safe_alternatives: [...], risky_alternatives: [...] }
        setIsLoading(false);
      })
      .catch(e => {
        console.error('대체 약물 검증 오류:', e);
        setError(e.message || '대체 약물 검증 중 서버 오류가 발생했습니다.');
        setIsLoading(false);
      });
  };

  return (
    <SectionWrapper title="5. 대체 약물 추천 (DDI 기반)">
      <div style={{ border: '1px solid #FBC02D', backgroundColor: '#FFFBEB', padding: '15px', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 10px 0' }}>🚨 **상호작용 위험 약물이 감지되었습니다.** 대체 약물 검증이 필요합니다.</p>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Select
            options={problematicOptions}
            onChange={setTargetDrug}
            value={targetDrug}
            placeholder="교체할 약물 선택..."
            styles={{ container: (base) => ({ ...base, flex: 1 }) }}
          />
          <button onClick={handleFetchAlternatives} disabled={isLoading} style={{ padding: '8px 15px', fontSize: '14px' }}>
            {isLoading ? '검증 중...' : '안전한 대체 약물 찾기'}
          </button>
          <button onClick={onReset} style={{ padding: '8px 15px', fontSize: '14px', backgroundColor: '#f44336' }}>
            초기화
          </button>
        </div>

        {/* --- 대체 약물 검증 결과 --- */}
        {error && <div style={{ color: 'red', marginTop: '10px' }}><pre>{error}</pre></div>}
        
        {alternatives && (
          <div style={{ marginTop: '15px' }}>
            {/* 1. 안전한 후보 */}
            <h5 style={{ color: '#2E7D32', margin: '10px 0 5px 0' }}>🟢 안전한 대체 후보</h5>
            {alternatives.safe_alternatives.length > 0 ? (
              <AlternativeTable items={alternatives.safe_alternatives} isSafe={true} />
            ) : (
              <p style={{ fontSize: '0.9em' }}>이 계열 내에서 안전한 대체 약물을 찾지 못했습니다.</p>
            )}

            {/* 2. 위험한 후보 (Expander) */}
            {alternatives.risky_alternatives.length > 0 && (
              <details style={{ marginTop: '10px' }}>
                <summary style={{ color: '#FBC02D', cursor: 'pointer', fontWeight: 'bold' }}>
                  🟡 위험이 감지된 후보 {alternatives.risky_alternatives.length}건 상세 보기...
                </summary>
                <div style={{ paddingTop: '10px' }}>
                  <AlternativeTable items={alternatives.risky_alternatives} isSafe={false} />
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

// --- [신규] 대체 약물 표시용 테이블 ---
const AlternativeTable = ({ items, isSafe }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
    <thead>
      <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f4f4f4' }}>
        <th style={{ padding: '8px', textAlign: 'left' }}>대체약물</th>
        {isSafe ? (
          <th style={{ padding: '8px', textAlign: 'left' }}>계열</th>
        ) : (
          <th style={{ padding: '8px', textAlign: 'left' }}>충돌 사유</th>
        )}
      </tr>
    </thead>
    <tbody>
      {items.map((item, index) => (
        <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
          <td style={{ padding: '8px' }}>{item.name}</td>
          <td style={{ padding: '8px' }}>{isSafe ? item.category : item.reason}</td>
        </tr>
      ))}
    </tbody>
  </table>
);


// --- 메인 DDI 컴포넌트 ---
const DDI = () => {
  const [selectedDrugs, setSelectedDrugs] = useState([]); // 선택된 약물 (객체 배열)
  const [drugOptions, setDrugOptions] = useState([]); // 전체 약물 목록

  const [apiResponse, setApiResponse] = useState(null); // 통합 검사 결과
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- 페이지 로드 시 약물 목록 1회 호출 ---
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/get_all_drugs')
      .then(response => response.json())
      .then(data => {
        const options = data.map(item => {
          let value;
          const label = item;
          if (item.includes('(') && item.endsWith(')')) {
            const parts = item.split(' (');
            value = parts[1].replace(')', '');
          } else {
            value = item;
          }
          return { value: value, label: label };
        });
        setDrugOptions(options);
      })
      .catch(e => {
        console.error("약물 목록 로딩 실패:", e);
        setError("서버에서 약물 목록을 가져오는데 실패했습니다.");
      });
  }, []);

  // --- 통합 검사 실행 ---
  const handlePredict = () => {
    const drugs = selectedDrugs.map(option => option.value);
    if (drugs.length < 2) {
      setError('최소 2개 이상의 약물을 선택하세요.');
      setApiResponse(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    fetch('http://127.0.0.1:5000/check_all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drugs: drugs }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) { throw new Error(data.error); }
        setApiResponse(data); // { ai_predictions, ..., problematic_drugs }
        setIsLoading(false);
      })
      .catch(e => {
        console.error('API 호출 오류:', e);
        setError('백엔드 서버(api.py) 연결에 실패했습니다.');
        setIsLoading(false);
      });
  };

  // --- [신규] 위험 약물 목록 추출 ---
  const problematicDrugsMap = apiResponse?.problematic_drugs;
  const showAlternativeSection = problematicDrugsMap && Object.keys(problematicDrugsMap).length > 0;

  // --- [신규] 초기화 핸들러 ---
  const handleResetAll = () => {
    setSelectedDrugs([]);
    setApiResponse(null);
    setError(null);
  };

  return (
    <div>
      <h1>약물 상호작용 (DDI) 예측</h1>
      <p>
        환자의 현재 처방 약물을 모두 선택하세요 (한글명/영문명 검색 가능):
      </p>

      <Select
        isMulti
        options={drugOptions}
        onChange={setSelectedDrugs}
        value={selectedDrugs}
        placeholder="약물 이름 검색..."
        isLoading={drugOptions.length === 0}
        styles={{
          control: (base) => ({ ...base, fontSize: '16px', padding: '2px' }),
        }}
      />

      <button
        onClick={handlePredict}
        disabled={isLoading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          marginTop: '10px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {isLoading ? '통합 검사 중...' : '통합 검사 실행'}
      </button>

      {/* --- 결과 표시 영역 --- */}
      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h3>오류:</h3>
          <pre>{error}</pre>
        </div>
      )}

      {apiResponse && (
        <div style={{ marginTop: '20px' }}>
          {/* 1, 2, 3차 검사 결과 */}
          <RenderResults apiResponse={apiResponse} />
        </div>
      )}

      {/* --- [신규] 5. 대체 약물 추천 섹션 --- */}
      {showAlternativeSection && (
        <AlternativeDrugs
          originalDrugs={selectedDrugs}
          problematicDrugsMap={problematicDrugsMap}
          onReset={handleResetAll} // 초기화 버튼
        />
      )}
    </div>
  );
};

export default DDI;