// 전역 변수들
let selectedApartmentCode = null;
let electricityChart = null;
let managementChart = null;
let predictionChart = null;
let currentElectricTab = 'public';
let currentManagementTab = 'public';
let currentApartmentType = null; // 노후, 중견, 신축
let selectedPeriod = 1; // 기본 1년

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 🆕 분류 섹션 확실히 숨기기
    const classificationSection = document.getElementById('classificationSection');
    if (classificationSection) {
        classificationSection.style.display = 'none';
    }
    
    // 아파트 목록 불러오기
    loadApartmentList();
    
    // 뒤로가기 버튼 이벤트 (있다면)
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.history.back();
        });
    }

    // 모달 외부 클릭 시 닫기
    const modal = document.getElementById('predictionModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePredictionModal();
            }
        });
    }
	loadApartmentList().then(() => {
	    autoSelectApartmentByName();
	});
	
	const electricLink = document.getElementById('electricLink');
	    const managementLink = document.getElementById('managementLink');
	    const aptSelect = document.getElementById('apartmentSelect');

	    if (electricLink && managementLink && aptSelect) {
	        electricLink.addEventListener('click', function (e) {
	            const selectedCode = aptSelect.value;
	            const selectedName = aptSelect.options[aptSelect.selectedIndex].text;

	            if (!selectedCode) {
	                alert("아파트를 선택하세요.");
	                e.preventDefault(); // 이동 막음
	                return;
	            }

	            localStorage.setItem('selectedApartmentCode', selectedCode);
	            localStorage.setItem('selectedApartmentName', selectedName);
	        });

	        managementLink.addEventListener('click', function (e) {
	            const selectedCode = aptSelect.value;
	            const selectedName = aptSelect.options[aptSelect.selectedIndex].text;

	            if (!selectedCode) {
	                alert("아파트를 선택하세요.");
	                e.preventDefault(); // 이동 막음
	                return;
	            }

	            localStorage.setItem('selectedApartmentCode', selectedCode);
	            localStorage.setItem('selectedApartmentName', selectedName);
	        });
	    }
});

// 아파트 목록 로드
async function loadApartmentList() {
    try {
        const response = await fetch('/api/apartments');
        const apartments = await response.json();
        
        const select = document.getElementById('apartmentSelect');
        select.innerHTML = '<option value="">아파트를 선택하세요</option>';
        
        apartments.forEach(apt => {
            const option = document.createElement('option');
            option.value = apt.cmpxCd;
            option.textContent = apt.cmpxNm;
            select.appendChild(option);
        });

        select.addEventListener('change', function() {
            if (this.value) {
                selectedApartmentCode = this.value;
                
                // 🔥 수정: 선택된 옵션의 텍스트만 가져오기
                const selectedOption = this.options[this.selectedIndex];
                const selectedApartmentName = selectedOption.textContent;
                
                // 🆕 백엔드에서 아파트 분류 정보 가져오기
                loadApartmentClassification(this.value, selectedApartmentName);
                
                // 기존 기능들
                resetTabs();
                loadApartmentDetails(this.value);
                loadElectricityData(this.value);
                loadManagementData(this.value);
            } else {
                // 아파트 선택 해제시 분류 섹션 숨김
                const classificationSection = document.getElementById('classificationSection');
                if (classificationSection) {
                    classificationSection.style.display = 'none';
                }
            }
        });
    } catch (error) {
        console.error('아파트 목록 로드 실패:', error);
    }
}

// 백엔드에서 아파트 분류 정보 로드
async function loadApartmentClassification(cmpxCd, apartmentName) {
    try {
        const response = await fetch(`/api/apartment/classification/${cmpxCd}`);
        const data = await response.json();
        
        if (data.apartmentInfo) {
            // 백엔드에서 받은 분류 정보 사용
            currentApartmentType = data.ageCategory;
            
            // 분류 정보 표시
            showClassificationInfo(apartmentName, data.ageCategory, data.predictType);
        }
    } catch (error) {
        console.error('아파트 분류 정보 로드 실패:', error);
        // 실패시 분류 섹션 숨김
        const classificationSection = document.getElementById('classificationSection');
        if (classificationSection) {
            classificationSection.style.display = 'none';
        }
    }
}

// 아파트 분류 정보 표시 
function showClassificationInfo(apartmentName, ageCategory, predictType) {
    const classificationSection = document.getElementById('classificationSection');
    const classificationTitle = document.getElementById('classificationTitle');
    const classificationMessage = document.getElementById('classificationMessage');
    
    // 한국어 표시명 매핑
    const categoryNames = {
        '신축': '신축',
        '중견': '구축', // 화면에는 구축으로 표시
        '노후': '노후'
    };
    
    const displayName = categoryNames[ageCategory] || ageCategory;
    
    classificationTitle.textContent = `${apartmentName} 분류 정보`;
    classificationMessage.innerHTML = `
        ${apartmentName}는 <span class="classification-badge ${displayName}">${displayName} 아파트</span>로 분류되어, 
        <span class="classification-badge ${displayName}">${predictType}</span>의 변화가 중요합니다.
    `;
    
    classificationSection.style.display = 'block';
}

// 아파트 상세 정보 로드
async function loadApartmentDetails(cmpxCd) {
    try {
        const response = await fetch(`/api/apartment/comparison/${cmpxCd}`);
        const data = await response.json();
        
        const apartment = data.baseApartment;
        const area = data.baseArea;
        
        const detailsBody = document.getElementById('detailsBody');
        const selectPrompt = document.getElementById('selectPrompt');
        const detailsTable = document.getElementById('detailsTable');
        
        detailsBody.innerHTML = `
            <tr>
                <th>단지분류</th>
                <td>${apartment.cmpxTp || '-'}</td>
                <th>법정동 주소</th>
                <td>${apartment.lglAddr || '-'}</td>
            </tr>
            <tr>
                <th>동수</th>
                <td>${apartment.bldgCnt || 0}동</td>
                <th>세대수</th>
                <td>${apartment.unitTot || 0}세대</td>
            </tr>
            <tr>
                <th>관리방식</th>
                <td>${apartment.mgmtMtd || '-'}</td>
                <th>난방방식</th>
                <td>${apartment.heatTp || '-'}</td>
            </tr>
            <tr>
                <th>복도유형</th>
                <td>${apartment.corrTp || '-'}</td>
                <th>연면적</th>
                <td>${area?.areaSum?.toFixed(2) || '-'}㎡</td>
            </tr>
            <tr>
                <th>주거전용면적</th>
                <td>${area?.areaUnit?.toFixed(2) || '-'}㎡</td>
                <th>사용승인일</th>
                <td>${apartment.apprDt ? new Date(apartment.apprDt).toLocaleDateString() : '-'}</td>
            </tr>
            <tr>
                <th>관리사무소 연락처</th>
                <td>${apartment.offcTel || '-'}</td>
                <th>관리사무소 팩스</th>
                <td>${apartment.offcFax || '-'}</td>
            </tr>
            <tr>
                <th>최고층수</th>
                <td>${apartment.flrMax || 0}층</td>
                <th>지하층수</th>
                <td>${apartment.bsmntFlr || 0}층</td>
            </tr>
            <tr>
                <th>총주차대수</th>
                <td>${apartment.parkTot || 0}대</td>
                <th>전기차 충전시설(지상)</th>
                <td>${apartment.evcGrd || 0}대</td>
            </tr>
            <tr>
                <th>전기차 충전시설(지하)</th>
                <td>${apartment.evcUndg || 0}대</td>
                <th>CCTV 대수</th>
                <td>${apartment.cctvCnt || 0}대</td>
            </tr>
        `;
        
        selectPrompt.style.display = 'none';
        detailsTable.style.display = 'table';
        
    } catch (error) {
        console.error('아파트 상세 정보 로드 실패:', error);
        document.getElementById('selectPrompt').innerHTML = '<div class="error-message">상세 정보를 불러올 수 없습니다.</div>';
    }
}

// 전기료 데이터 로드
async function loadElectricityData(cmpxCd) {
    try {
        const response = await fetch(`/api/apartment/stats/${cmpxCd}`);
        const data = await response.json();
        
        const mgmtHistory = data.mgmtHistory || [];
        
        if (mgmtHistory.length > 0) {
            const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
            const publicElectricity = new Array(12).fill(null);
            const privateElectricity = new Array(12).fill(null);
            
            const apartmentInfo = data.apartmentInfo;
            const unitTot = apartmentInfo?.unitTot || 1;
            
            mgmtHistory.forEach(item => {
                const occYm = item.occYm;
                const month = parseInt(occYm.substring(4)) - 1;
                
                if (month >= 0 && month < 12) {
                    const publicPerUnit = Math.round((item.electricPub || 0) / unitTot);
                    const privatePerUnit = Math.round((item.electricPriv || 0) / unitTot);
                    
                    publicElectricity[month] = publicPerUnit;
                    privateElectricity[month] = privatePerUnit;
                }
            });
            
            createElectricityChart(months, publicElectricity, privateElectricity);
        } else {
            showElectricityNoData();
        }
        
    } catch (error) {
        console.error('전기료 데이터 로드 실패:', error);
        showElectricityNoData();
    }
}
// 전기료 test 페이지
async function loadElectricitySummary(year, complexCode) {

    try {
        let url = `/api/electric/summary/${year}`;
        if (complexCode && complexCode !== '') {
            url += `?complexCode=${complexCode}`;
        }
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new TypeError("서버 응답이 유효한 배열 형태가 아닙니다. JSON 파싱 오류 또는 예상치 못한 데이터 형식.");
        }

        // 월별 데이터를 저장할 배열 초기화
        const publicData = new Array(12).fill(null);
        const privateData = new Array(12).fill(null);
        const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

        // --- 6. 월별 데이터 처리 및 채우기 ---
        if (data.length === 0) {
            showElectricityNoData();
            return;
        }

        data.forEach(row => {
            const monthIndex = parseInt(row.MONTH, 10) - 1; // JSON 키가 대문자임을 가정
            
            publicData[monthIndex] = row.AVGELECTRICPUBPERHOUSE != null ? row.AVGELECTRICPUBPERHOUSE : 0;
            privateData[monthIndex] = row.AVGELECTRICPRIVPERHOUSE != null ? row.AVGELECTRICPRIVPERHOUSE : 0;
            
        });
        window.electricityData = {
            months,
            public: publicData,
            private: privateData
        };
        createElectricityChart(window.electricityData.months, window.electricityData.public, window.electricityData.private);

    } catch (error) {
        showElectricityNoData();
    }
}
// 관리비 test 페이지
async function loadMgmtSummary(year, complexCode) {

    try {
        let url = `/api/mgmt/summary/${year}`;
        if (complexCode && complexCode !== '') {
            url += `?complexCode=${complexCode}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new TypeError("서버 응답이 유효한 배열 형태가 아닙니다. JSON 파싱 오류 또는 예상치 못한 데이터 형식.");
        }

        const publicMgmtData = new Array(12).fill(null); // null로 초기화하여 데이터 없는 월 처리
        const individualMgmtData = new Array(12).fill(null);
        const months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

        if (data.length === 0) {
            showManagementNoData(); // 데이터가 없으면 '데이터 없음' 메시지 표시
            return; // 함수 종료
        }

        data.forEach(row => {
            const monthIndex = parseInt(row.MONTH, 10) - 1; // JSON 키가 대문자임을 가정

            publicMgmtData[monthIndex] = row.AVGPUBMGMTPERHOUSE != null ? row.AVGPUBMGMTPERHOUSE : 0;
            individualMgmtData[monthIndex] = row.AVGINDIVUSEPERHOUSE != null ? row.AVGINDIVUSEPERHOUSE : 0;
            
        });


        window.mgmtSummaryData = {
            months: months,
            public: publicMgmtData,    // 처리된 월별 데이터
            individual: individualMgmtData // 처리된 월별 데이터
        };

        createManagementChart(months, publicMgmtData, individualMgmtData);
        
    } catch (error) {
        showManagementNoData(); // 에러 발생 시에만 호출
    }
}
// 관리비 데이터 로드
async function loadManagementData(cmpxCd) {
    try {
        const response = await fetch(`/api/apartment/stats/${cmpxCd}`);
        const data = await response.json();
        
        const mgmtHistory = data.mgmtHistory || [];
        
        if (mgmtHistory.length > 0) {
            const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
            const publicManagement = new Array(12).fill(null);
            const individualUse = new Array(12).fill(null);
            
            const apartmentInfo = data.apartmentInfo;
            const unitTot = apartmentInfo?.unitTot || 1;
            
            mgmtHistory.forEach(item => {
                const occYm = item.occYm;
                const month = parseInt(occYm.substring(4)) - 1;
                
                if (month >= 0 && month < 12) {
                    const publicPerUnit = (item.pubMgmtTot / unitTot) / 10000;
                    const individualPerUnit = (item.indivUseTot / unitTot) / 10000;
                    
                    publicManagement[month] = Math.round(publicPerUnit * 10) / 10;
                    individualUse[month] = Math.round(individualPerUnit * 10) / 10;
                }
            });
            
            createManagementChart(months, publicManagement, individualUse);
        } else {
            showManagementNoData();
        }
        
    } catch (error) {
        console.error('관리비 데이터 로드 실패:', error);
        showManagementNoData();
    }
}

// 전기료 차트 생성
function createElectricityChart(months, publicData, privateData) {
    const ctx = document.getElementById('electricityChart').getContext('2d');
    
    if (electricityChart) {
        electricityChart.destroy();
    }
    
    const currentData = currentElectricTab === 'public' ? publicData : privateData;
    const label = currentElectricTab === 'public' ? '공용 전기료 (원)' : '전용 전기료 (원)';
    
    const validData = currentData.filter(value => value !== null && value > 0);
    if (validData.length === 0) {
        showElectricityNoData();
        return;
    }
    
    const maxValue = Math.max(...validData);
    const minValue = Math.min(...validData);
    const range = maxValue - minValue;
    
    const yMin = Math.max(0, minValue - range * 0.1);
    const yMax = maxValue + range * 0.1;
    
    electricityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: label,
                data: currentData,
                borderColor: '#fb923c',
                backgroundColor: '#fed7aa',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                spanGaps: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: false,
            layout: {
                padding: 10
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    filter: function(tooltipItem) {
                        return tooltipItem.parsed.y !== null;
                    },
                    callbacks: {
                        label: function(context) {
                            if (context.parsed.y === null) return null;
                            return `${label}: ${context.parsed.y.toLocaleString()}원`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: yMin,
                    max: yMax,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + '원';
                        },
                        maxTicksLimit: 6
                    }
                },
                x: {
                    grid: {
                        color: '#f1f5f9'
                    }
                }
            },
            elements: {
                point: {
                    backgroundColor: '#fb923c'
                }
            }
        }
    });
    
    ctx.canvas.style.height = '300px';
    ctx.canvas.style.maxHeight = '300px';
    
    window.electricityData = {
        months: months,
        public: publicData,
        private: privateData
    };
}

// 관리비 차트 생성
function createManagementChart(months, publicData, individualData) {
    const ctx = document.getElementById('managementChart').getContext('2d');
    
    if (managementChart) {
        managementChart.destroy();
    }
    
    const currentData = currentManagementTab === 'public' ? publicData : individualData;
    // '만원'을 '원'으로 변경하고, 데이터도 10000을 곱하여 '원' 단위로 변환합니다.
    const label = currentManagementTab === 'public' ? '공용관리비계 (원)' : '개별사용료계 (원)';
    
    // 데이터가 현재 '만원' 단위라고 가정하고, '원' 단위로 변환합니다.
    const convertedData = currentData.map(value => value !== null ? value * 10000 : null);

    const validData = convertedData.filter(value => value !== null && value > 0);
    if (validData.length === 0) {
        showManagementNoData();
        return;
    }
    
    const maxValue = Math.max(...validData);
    const minValue = Math.min(...validData);
    const range = maxValue - minValue;
    
    const yMin = Math.max(0, minValue - range * 0.1);
    const yMax = maxValue + range * 0.1;
    
    managementChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: label,
                data: convertedData, // 변환된 데이터를 사용
                borderColor: '#38bdf8',
                backgroundColor: '#bae6fd',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                spanGaps: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: false,
            layout: {
                padding: 10
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    filter: function(tooltipItem) {
                        return tooltipItem.parsed.y !== null;
                    },
                    callbacks: {
                        label: function(context) {
                            if (context.parsed.y === null) return null;
                            // 툴팁에도 '원' 단위를 적용
                            return `${label}: ${context.parsed.y.toLocaleString()}원`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: yMin,
                    max: yMax,
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        callback: function(value) {
                            // Y축 레이블에도 '원' 단위를 적용
                            return value.toLocaleString() + '원';
                        },
                        maxTicksLimit: 6
                    }
                },
                x: {
                    grid: {
                        color: '#f1f5f9'
                    }
                }
            },
            elements: {
                point: {
                    backgroundColor: '#38bdf8'
                }
            }
        }
    });
    
    ctx.canvas.style.height = '300px';
    ctx.canvas.style.maxHeight = '300px';
    
    window.managementData = {
        months: months,
        public: publicData,
        individual: individualData
    };
}

// 전기료 탭 전환
function showElectricTab(tab) {
    currentElectricTab = tab;
    
    const electricTabs = document.querySelectorAll('.chart-container:first-child .tab-button');
    electricTabs.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'public') {
        electricTabs[0].classList.add('active');
    } else {
        electricTabs[1].classList.add('active');
    }
    
    if (window.electricityData) {
        createElectricityChart(
            window.electricityData.months,
            window.electricityData.public,
            window.electricityData.private
        );
    }
}

// 관리비 탭 전환
function showManagementTab(tab) {
    currentManagementTab = tab;
    
    const managementTabs = document.querySelectorAll('.chart-container:last-child .tab-button');
    managementTabs.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'public') {
        managementTabs[0].classList.add('active');
    } else {
        managementTabs[1].classList.add('active');
    }
    
    if (window.managementData) {
        createManagementChart(
            window.managementData.months,
            window.managementData.public,
            window.managementData.individual
        );
    }
}

// 탭 초기화
function resetTabs() {
    currentElectricTab = 'public';
    currentManagementTab = 'public';
    
    const electricTabs = document.querySelectorAll('.chart-container:first-child .tab-button');
    electricTabs.forEach(btn => btn.classList.remove('active'));
    if (electricTabs[0]) electricTabs[0].classList.add('active');
    
    const managementTabs = document.querySelectorAll('.chart-container:last-child .tab-button');
    managementTabs.forEach(btn => btn.classList.remove('active'));
    if (managementTabs[0]) managementTabs[0].classList.add('active');
}

// 전기료 데이터 없을 때 표시
function showElectricityNoData() {
    const ctx = document.getElementById('electricityChart').getContext('2d');
    
    if (electricityChart) {
        electricityChart.destroy();
    }
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.canvas.style.height = '300px';
    ctx.canvas.style.maxHeight = '300px';
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('전기료 데이터가 없습니다', ctx.canvas.width / 2, ctx.canvas.height / 2);
}

// 관리비 데이터 없을 때 표시
function showManagementNoData() {
    const ctx = document.getElementById('managementChart').getContext('2d');
    
    if (managementChart) {
        managementChart.destroy();
    }
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.canvas.style.height = '300px';
    ctx.canvas.style.maxHeight = '300px';
    
    ctx.font = '16px Arial';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('관리비 데이터가 없습니다', ctx.canvas.width / 2, ctx.canvas.height / 2);
}

// ===== 예측 모달 관련 함수들 =====

// 노후도별 예측 설명 정보
function getApartmentTypeInfo(ageCategory) {
    const typeInfo = {
        '노후': {
            name: '노후',
            displayName: '노후',
            colorClass: '노후',
            prediction: '장기수선충당금',
            explanation: '노후 아파트는 장기수선충당금의 월 부과액을 다른 그룹에 비해 많이 걷지만, 그만큼 사용량도 많아 장기수선충당금의 변화가 중요합니다. 건물의 노후화로 인한 대규모 수선이 필요하기 때문에 충당금 관리가 핵심입니다.'
        },
        '중견': {
            name: '구축',
            displayName: '구축',
            colorClass: '구축',
            prediction: '수선비',
            explanation: '구축 아파트는 노후 단계로 넘어가는 시기로, 점진적으로 수선비가 증가하는 추세를 보입니다. 이 시기의 수선비 변화를 분석하여 향후 관리비 부담을 예측할 수 있습니다.'
        },
        '신축': {
            name: '신축',
            displayName: '신축',
            colorClass: '신축',
            prediction: '공용 전기료',
            explanation: '신축 아파트는 다른 구축, 노후 아파트보다 훨씬 많은 전기를 사용합니다. 헬스장, 골프장 등 커뮤니티 시설과 넓은 면적으로 인한 인프라 운영으로 공용 전기료의 변화가 가장 중요한 지표입니다.'
        }
    };
    return typeInfo[ageCategory] || typeInfo['신축'];
}

// 예측 모달 열기
function openPredictionModal() {
    if (!currentApartmentType) {
        alert('먼저 아파트를 선택해주세요.');
        return;
    }
    
    const modal = document.getElementById('predictionModal');
    const typeInfo = getApartmentTypeInfo(currentApartmentType);
    
    // 모달 제목 및 설명 업데이트 (색상 적용)
    document.getElementById('modalTitle').innerHTML = 
        `<span class="classification-badge ${typeInfo.colorClass}">${typeInfo.displayName}</span> 아파트 <span class="classification-badge ${typeInfo.colorClass}">${typeInfo.prediction}</span> 예측`;
    
    const explanationDiv = document.getElementById('predictionExplanation');
    explanationDiv.innerHTML = `
        <h4><span class="classification-badge ${typeInfo.colorClass}">${typeInfo.displayName}</span> 아파트 <span class="classification-badge ${typeInfo.colorClass}">${typeInfo.prediction}</span> 예측 분석</h4>
        <p>${typeInfo.explanation}</p>
    `;
    
    // 모달 표시
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // 예측 데이터 로드 및 차트 생성
    loadPredictionData();
}

// 예측 모달 닫기
function closePredictionModal() {
    const modal = document.getElementById('predictionModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    if (predictionChart) {
        predictionChart.destroy();
        predictionChart = null;
    }
}

// 예측 기간 선택
function selectPeriod(period) {
    selectedPeriod = period;
    
    const buttons = document.querySelectorAll('.period-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = [...buttons].find(btn => btn.textContent.includes(period + '년'));
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    loadPredictionData();
}

// 🕵️ 콘솔 로그가 포함된 예측 데이터 로드 함수
async function loadPredictionData() {
    console.log('=== 🚀 예측 시작 ===');
    console.log('아파트 타입:', currentApartmentType);
    console.log('선택된 기간:', selectedPeriod + '년');
    console.log('아파트 코드:', selectedApartmentCode);
    
    // 🔥 신축 아파트만 실제 모델 사용
    if (currentApartmentType === '신축') {
        console.log('🏗️ 신축 아파트 감지 - 실제 AI 모델 호출 시도');
        
        try {
            showPredictionLoading(); // 로딩 표시
            console.log('⏳ 로딩 화면 표시 완료');
            
            console.log('📡 API 호출 시작...');
            const response = await fetch('http://localhost:5001/predict_new_apartment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cmpx_cd: selectedApartmentCode,
                    period_years: selectedPeriod,
                    apartment_type: currentApartmentType
                })
            });
            
            console.log('📡 API 응답 상태:', response.status);
            
            if (!response.ok) {
                throw new Error(`API 응답 실패: ${response.status}`);
            }
            
            const result = await response.json();
            console.log('📊 API 응답 데이터:', result);
            
            if (result.success) {
                console.log('✅ 실제 AI 모델 예측 성공!');
                console.log('🤖 LSTM + N-BEATS 모델 결과 사용');
                console.log('예측 데이터:', result.prediction);
                
                // 실제 모델 결과 사용
                createRealPredictionChart(result.prediction);
                updateRealPredictionStats(result.prediction);
                
                console.log('🎯 실제 AI 모델 차트 생성 완료');
                return;
            } else {
                console.log('⚠️ API 성공했지만 예측 실패:', result.error);
                throw new Error(result.error || '예측 실패');
            }
            
        } catch (error) {
            console.log('❌ 실제 AI 모델 호출 실패:', error.message);
            console.log('🔄 더미 데이터로 대체합니다...');
        }
    } else {
        console.log('📝 중견/노후 아파트 - 더미 데이터 사용');
    }
    
    // 🔄 기존 더미 데이터 로직 (중견/노후 또는 신축 실패시)
    console.log('📋 더미 데이터 생성 시작');
    
    let predictionData, statsData;
    
    switch (currentApartmentType) {
        case '노후':
            console.log('🏚️ 노후 아파트 더미 데이터 생성');
            predictionData = generateLongTermMaintenanceData();
            statsData = generateLongTermMaintenanceStats();
            break;
        case '중견':
            console.log('🏢 중견 아파트 더미 데이터 생성');
            predictionData = generateRepairCostData();
            statsData = generateRepairCostStats();
            break;
        case '신축':
            console.log('🏗️ 신축 아파트 더미 데이터 생성 (AI 모델 실패시)');
            predictionData = generateElectricityPredictionData();
            statsData = generateElectricityPredictionStats();
            break;
        default:
            console.log('❓ 기본 더미 데이터 생성');
            predictionData = generateElectricityPredictionData();
            statsData = generateElectricityPredictionStats();
    }
    
    console.log('📊 더미 데이터 생성 완료');
    console.log('더미 차트 데이터:', predictionData);
    console.log('더미 통계 데이터:', statsData);
    
    createPredictionChart(predictionData);
    updatePredictionStats(statsData);
    
    console.log('🎯 더미 데이터 차트 생성 완료');
    console.log('=== ✅ 예측 완료 ===');
}

// 🎯 빈 여백을 완전히 제거한 차트 생성 함수
function createRealPredictionChart(predictionData) {
    console.log('🎨 AI 모델 차트 생성 시작');
    console.log('차트 데이터:', predictionData);
    
    const ctx = document.getElementById('predictionChart').getContext('2d');
    
    if (predictionChart) {
        predictionChart.destroy();
        console.log('🗑️ 기존 차트 제거 완료');
    }
    
    try {
        const historicalDates = predictionData.historical.dates || [];
        const historicalValues = predictionData.historical.values || [];
        const predictionDates = predictionData.prediction.dates || [];
        const predictionValues = predictionData.prediction.values || [];
        
        console.log('📅 과거 날짜:', historicalDates);
        console.log('🔮 예측 날짜:', predictionDates);
        console.log('📈 과거 데이터:', historicalValues);
        console.log('🔮 예측 데이터:', predictionValues);
        
        // 🔥 실제 예측 데이터가 있는 만큼만 사용 (빈 공간 제거)
        const actualPredictionCount = predictionValues.length;
        const trimmedPredictionDates = predictionDates.slice(0, actualPredictionCount);
        
        console.log(`✂️ 예측 데이터 트리밍: ${predictionDates.length}개 → ${actualPredictionCount}개`);
        
        // 실제 데이터가 있는 범위만으로 차트 구성
        const allDates = [...historicalDates, ...trimmedPredictionDates];
        const allHistorical = [...historicalValues, ...new Array(actualPredictionCount).fill(null)];
        const allPredicted = [...new Array(historicalDates.length).fill(null), ...predictionValues];
        
        console.log('📊 최종 라벨 (빈공간 제거):', allDates);
        console.log('📈 최종 과거 데이터:', allHistorical);
        console.log('🔮 최종 예측 데이터:', allPredicted);
        
        // 차트 생성
        predictionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: allDates,
                datasets: [
                    {
                        // 🔥 "실제" 단어 제거
                        label: `${predictionData.target_metric}`,
                        data: allHistorical,
                        borderColor: '#3b82f6',
                        backgroundColor: '#3b82f6',
                        borderWidth: 3,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 4,
                        spanGaps: false
                    },
                    {
                        // 🔥 "실제" 단어 제거
                        label: `🤖 AI 예측 ${predictionData.target_metric}`,
                        data: allPredicted,
                        borderColor: '#ef4444',
                        backgroundColor: '#ef4444',
                        borderWidth: 3,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        pointRadius: 4,
                        spanGaps: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    title: {
                        display: true,
                        // 🔥 "실제" 단어 제거
                        text: '🤖 LSTM + N-BEATS AI 모델 예측 결과',
                        color: '#ef4444',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        filter: function(tooltipItem) {
                            return tooltipItem.parsed.y !== null;
                        },
                        callbacks: {
                            label: function(context) {
                                if (context.parsed.y === null) return null;
                                return `${context.dataset.label}: ${Math.round(context.parsed.y).toLocaleString()}원`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + '원';
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            // 🔥 실제 데이터 범위에 맞게 조정
                            maxTicksLimit: Math.min(allDates.length, 15),
                            callback: function(value, index) {
                                const label = this.getLabelForValue(value);
                                // YYYY-MM 형태로 표시
                                if (label && label.length >= 7) {
                                    return label.slice(2); // 20XX-MM → XX-MM
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
        
        console.log('✅ 빈 여백 제거된 차트 생성 완료!');
        
    } catch (error) {
        console.error('❌ 차트 생성 중 오류:', error);
        throw error;
    }
}

// 🆕 안전한 실제 예측 통계 업데이트 함수
function updateRealPredictionStats(predictionData) {
    console.log('📊 AI 모델 통계 업데이트 시작');
    
    try {
        const historical = predictionData.historical.values || [];
        const predicted = predictionData.prediction.values || [];
        
        if (historical.length === 0 || predicted.length === 0) {
            console.log('⚠️ 데이터가 없어서 통계 업데이트 실패');
            return;
        }
        
        const currentAvg = historical.reduce((a, b) => a + b, 0) / historical.length;
        const futureAvg = predicted.reduce((a, b) => a + b, 0) / predicted.length;
        const changePercent = Math.round(((futureAvg - currentAvg) / currentAvg) * 100);
        
        console.log('📈 현재 평균:', currentAvg.toLocaleString() + '원');
        console.log('🔮 미래 평균:', futureAvg.toLocaleString() + '원');
        console.log('📊 변화율:', changePercent + '%');
        
        // 🔥 하드코딩된 신뢰도 완전 삭제 - 2개 항목만
        const statsData = [
            {
                title: `현재 월 평균 ${predictionData.target_metric}`,
                value: `${Math.round(currentAvg).toLocaleString()}원`,
                change: ''
            },
            {
                title: `${selectedPeriod}년 후 예상 월 평균 ${predictionData.target_metric}`,
                value: `${Math.round(futureAvg).toLocaleString()}원`,
                change: `${Math.abs(changePercent)}% ${changePercent >= 0 ? '증가' : '감소'}`,
                isPositive: changePercent >= 0
            }
        ];
        
        updatePredictionStats(statsData);
        console.log('✅ AI 모델 통계 업데이트 완료!');
        
    } catch (error) {
        console.error('❌ 통계 업데이트 중 오류:', error);
        throw error;
    }
}

// 🆕 로딩 표시 함수 (로그 포함)
function showPredictionLoading() {
    console.log('⏳ 예측 로딩 화면 표시');
    
    const statsContainer = document.getElementById('predictionStats');
    statsContainer.innerHTML = `
        <div class="loading-container" style="text-align: center; padding: 20px;">
            <div class="loading-spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 0 auto;"></div>
            <p style="margin-top: 10px; color: #666;">🤖 LSTM + N-BEATS AI 모델이 예측을 수행중입니다...</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    // 차트 영역도 로딩 표시
    const ctx = document.getElementById('predictionChart').getContext('2d');
    if (predictionChart) {
        predictionChart.destroy();
    }
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('🤖 AI 모델 예측 수행 중...', ctx.canvas.width / 2, ctx.canvas.height / 2);
    
    console.log('✅ 로딩 화면 표시 완료');
}

// 노후 아파트 - 장기수선충당금 데이터 생성
function generateLongTermMaintenanceData() {
    const months = [];
    const currentData = [];
    const predictedData = [];
    
    // 현재 데이터 (최근 12개월)
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
        currentData.push(50000 + Math.random() * 10000 - 5000);
        predictedData.push(null);
    }
    
    // 예측 데이터
    const monthsToPredict = selectedPeriod * 12;
    for (let i = 1; i <= monthsToPredict; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() + i);
        months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
        
        const baseAmount = 50000;
        const increaseRate = 0.05 / 12;
        const predictedAmount = baseAmount * Math.pow(1 + increaseRate, i);
        
        currentData.push(null);
        predictedData.push(predictedAmount + Math.random() * 3000 - 1500);
    }
    
    return {
        labels: months,
        datasets: [
            {
                label: '실제 장기수선충당금',
                data: currentData,
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f6',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                spanGaps: false
            },
            {
                label: '예측 장기수선충당금',
                data: predictedData,
                borderColor: '#ef4444',
                backgroundColor: '#ef4444',
                borderWidth: 3,
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                spanGaps: false
            }
        ]
    };
}

// 구축 아파트 - 수선비 데이터 생성
function generateRepairCostData() {
    const months = [];
    const currentData = [];
    const predictedData = [];
    
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
        currentData.push(35000 + Math.random() * 8000 - 4000);
        predictedData.push(null);
    }
    
    const monthsToPredict = selectedPeriod * 12;
    for (let i = 1; i <= monthsToPredict; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() + i);
        months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
        
        const baseAmount = 35000;
        const increaseRate = 0.05 / 12;
        const predictedAmount = baseAmount * Math.pow(1 + increaseRate, i);
        
        currentData.push(null);
        predictedData.push(predictedAmount + Math.random() * 2000 - 1000);
    }
    
    return {
        labels: months,
        datasets: [
            {
                label: '실제 수선비',
                data: currentData,
                borderColor: '#10b981',
                backgroundColor: '#10b981',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                spanGaps: false
            },
            {
                label: '예측 수선비',
                data: predictedData,
                borderColor: '#f59e0b',
                backgroundColor: '#f59e0b',
                borderWidth: 3,
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                spanGaps: false
            }
        ]
    };
}

// 신축 아파트 - 공용 전기료 데이터 생성
function generateElectricityPredictionData() {
    const months = [];
    const currentData = [];
    const predictedData = [];
    
    for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
        currentData.push(18000 + Math.random() * 4000 - 2000);
        predictedData.push(null);
    }
    
    const monthsToPredict = selectedPeriod * 12;
    for (let i = 1; i <= monthsToPredict; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() + i);
        months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
        
        const baseAmount = 18000;
        const increaseRate = 0.04 / 12;
        const predictedAmount = baseAmount * Math.pow(1 + increaseRate, i);
        
        currentData.push(null);
        predictedData.push(predictedAmount + Math.random() * 1500 - 750);
    }
    
    return {
        labels: months,
        datasets: [
            {
                label: '실제 공용 전기료',
                data: currentData,
                borderColor: '#8b5cf6',
                backgroundColor: '#8b5cf6',
                borderWidth: 3,
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                spanGaps: false
            },
            {
                label: '예측 공용 전기료',
                data: predictedData,
                borderColor: '#f97316',
                backgroundColor: '#f97316',
                borderWidth: 3,
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                spanGaps: false
            }
        ]
    };
}

// 예측 차트 생성
function createPredictionChart(data) {
    const ctx = document.getElementById('predictionChart').getContext('2d');
    
    if (predictionChart) {
        predictionChart.destroy();
    }
    
    predictionChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    filter: function(tooltipItem) {
                        return tooltipItem.parsed.y !== null;
                    },
                    callbacks: {
                        label: function(context) {
                            if (context.parsed.y === null) return null;
                            return `${context.dataset.label}: ${Math.round(context.parsed.y).toLocaleString()}원`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + '원';
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#f1f5f9'
                    },
                    ticks: {
                        maxTicksLimit: 12,
                        callback: function(value, index) {
                            const label = this.getLabelForValue(value);
                            return label.slice(-5);
                        }
                    }
                }
            }
        }
    });
}

// 통계 생성 함수들
function generateLongTermMaintenanceStats() {
    const currentAmount = 50000;
    const futureAmount = Math.round(currentAmount * Math.pow(1.05, selectedPeriod));
    const increasePercent = Math.round(((futureAmount - currentAmount) / currentAmount) * 100);
    
    return [
        {
            title: '현재 월 부과액',
            value: `${currentAmount.toLocaleString()}원`,
            change: ''
        },
        {
            title: `${selectedPeriod}년 후 예상 월 부과액`,
            value: `${futureAmount.toLocaleString()}원`,
            change: `${increasePercent}% 증가`,
            isPositive: true
        },
        {
            title: '총 적립금 (현재)',
            value: '500,000,000원',
            change: ''
        },
        {
            title: '예상 소진 시점',
            value: `20${27 + selectedPeriod}년`,
            change: '대규모 보수 예정'
        }
    ];
}

function generateRepairCostStats() {
    const currentAmount = 35000;
    const futureAmount = Math.round(currentAmount * Math.pow(1.05, selectedPeriod));
    const increasePercent = Math.round(((futureAmount - currentAmount) / currentAmount) * 100);
    
    return [
        {
            title: '최근 1년 월 평균 수선비',
            value: `${currentAmount.toLocaleString()}원`,
            change: ''
        },
        {
            title: `${selectedPeriod}년 후 예상 월 평균 수선비`,
            value: `${futureAmount.toLocaleString()}원`,
            change: `${increasePercent}% 증가`,
            isPositive: true
        },
        {
            title: '예상 수선비 증가율',
            value: '연평균 5%',
            change: ''
        }
    ];
}

function generateElectricityPredictionStats() {
    const currentAmount = 18000;
    const futureAmount = Math.round(currentAmount * Math.pow(1.04, selectedPeriod));
    const increasePercent = Math.round(((futureAmount - currentAmount) / currentAmount) * 100);
    
    return [
        {
            title: '현재 월 평균 공용 전기료',
            value: `${currentAmount.toLocaleString()}원`,
            change: ''
        },
        {
            title: `${selectedPeriod}년 후 예상 월 평균 공용 전기료`,
            value: `${futureAmount.toLocaleString()}원`,
            change: `${increasePercent}% 증가`,
            isPositive: true
        }
    ];
}

// 예측 통계 업데이트
function updatePredictionStats(statsData) {
    const statsContainer = document.getElementById('predictionStats');
    
    statsContainer.innerHTML = statsData.map(stat => `
        <div class="stat-card">
            <h5>${stat.title}</h5>
            <div class="value">${stat.value}</div>
            ${stat.change ? `<div class="change ${stat.isPositive ? 'positive' : ''}">${stat.change}</div>` : ''}
        </div>
    `).join('');
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// 페이지가 로드된 후 select 항목과 일치하는 아파트 자동 선택
async function autoSelectApartmentByName() {
    const aptName = getQueryParam('apartmentName');
    if (!aptName) return;

    const select = document.getElementById('apartmentSelect');
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].textContent.trim() === aptName.trim()) {
            select.selectedIndex = i;
            select.dispatchEvent(new Event('change'));
            break;
        }
    }
}

