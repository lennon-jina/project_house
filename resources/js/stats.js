// 전역 변수
let currentBaseApartment = null;
let similarApartments = [];
let selectedApartments = [];
let charts = {};
let selectedApartmentName = null; 
let currentPageType = 'electric'; // 현재 페이지 타입을 감지

// 페이지 타입 감지 (URL 또는 페이지 요소로 판단)
function detectPageType() {
    const path = window.location.pathname;
    if (path.includes('management') || path.includes('mgmt')) {
        return 'management';
    } else if (path.includes('electric')) {
        return 'electric';
    }
    
    // 또는 페이지에 특정 요소가 있는지로 판단
    if (document.getElementById('managementAnalysis')) {
        return 'management';
    } else if (document.getElementById('electricAnalysis')) {
        return 'electric';
    }
    
    return 'electric'; // 기본값
}

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    currentPageType = detectPageType();
    console.log('현재 페이지 타입:', currentPageType);
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    bindEvents();
    loadApartmentList();
    setupNavigation();
}

// 이벤트 바인딩
function bindEvents() {
    console.log('🔧 이벤트 바인딩 시작');
    
    // 검색 버튼 클릭
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        console.log('✅ 검색 버튼 이벤트 연결');
    } else {
        console.warn('⚠️ searchBtn 요소를 찾을 수 없습니다');
    }
    
    // 엔터키로 검색
    const apartmentCode = document.getElementById('apartmentCode');
    if (apartmentCode) {
        apartmentCode.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
        console.log('✅ 검색 입력 필드 엔터 이벤트 연결');
    } else {
        console.warn('⚠️ apartmentCode 요소를 찾을 수 없습니다');
    }
    
    // 아파트 선택 변경
    const apartmentSelect = document.getElementById('apartmentSelect');
    if (apartmentSelect) {
        apartmentSelect.addEventListener('change', function() {
            const codeInput = document.getElementById('apartmentCode');
            if (codeInput) {
                codeInput.value = this.value;
                console.log('🏠 아파트 선택됨:', this.value);
            }
        });
        console.log('✅ 아파트 선택 박스 이벤트 연결');
    } else {
        console.warn('⚠️ apartmentSelect 요소를 찾을 수 없습니다');
    }
    
    // 비교 관련 버튼들 (있는 경우에만)
    const selectAllBtn = document.getElementById('selectAllBtn');
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', selectAllApartments);
        console.log('✅ 전체 선택 버튼 이벤트 연결');
    }
    
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');
    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener('click', clearSelection);
        console.log('✅ 선택 해제 버튼 이벤트 연결');
    }
    
    const compareSelectedBtn = document.getElementById('compareSelectedBtn');
    if (compareSelectedBtn) {
        compareSelectedBtn.addEventListener('click', compareSelected);
        console.log('✅ 선택된 아파트 비교 버튼 이벤트 연결');
    }
    
    // 모달 닫기
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
        console.log('✅ 모달 닫기 버튼 이벤트 연결');
    }
    
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        errorModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        console.log('✅ 모달 배경 클릭 이벤트 연결');
    }
    
    console.log('🔧 이벤트 바인딩 완료');
}

// 네비게이션 설정
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 아파트 목록 로드
async function loadApartmentList() {
    try {
        const response = await fetch('/api/apartments');
        if (response.ok) {
            const apartments = await response.json();
            populateApartmentSelect(apartments);
        }
    } catch (error) {
        console.error('아파트 목록 로드 실패:', error);
    }
}

// 아파트 선택 옵션 채우기
function populateApartmentSelect(apartments) {
    const select = document.getElementById('apartmentSelect');
    select.innerHTML = '<option value="">아파트를 선택하세요</option>';
    
    apartments.forEach(apt => {
        const option = document.createElement('option');
        option.value = apt.cmpxCd;
        option.textContent = `${apt.cmpxNm} (${apt.cmpxCd})`;
        select.appendChild(option);
    });
}

// 검색 처리
async function handleSearch() {
    const apartmentCode = document.getElementById('apartmentCode').value.trim();
    
    if (!apartmentCode) {
        showError('아파트 코드를 입력하거나 선택해주세요.');
        return;
    }
    
    showLoading(true);
    hideAllSections();
    
    try {
        // 기준 아파트 정보 조회
        const response = await fetch(`/api/apartment/comparison/${apartmentCode}`);
        
        if (!response.ok) {
            throw new Error('데이터를 찾을 수 없습니다.');
        }
        
        const data = await response.json();
        
        displaySimilarApartments(data.similarApartments); 
        showSection('comparison');
        
        currentBaseApartment = data.baseApartment;
        similarApartments = data.similarApartments;
        
        // 제목 업데이트 추가
        if (data.baseApartment && data.baseApartment.cmpxNm) {
            updateComparisonTitle(data.baseApartment.cmpxNm);
        }
		
		// 페이지 타입에 따라 다른 비교 실행
		if (currentPageType === 'electric') {
			await executeElectricComparison(data.similarApartments);
		} else if (currentPageType === 'management') {
			await executeManagementComparison(data.similarApartments);
		}
        
    } catch (error) {
        console.error('검색 실패:', error);
        showError('데이터 조회 중 오류가 발생했습니다: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// 전기료 비교 실행 함수
async function executeElectricComparison(apartments) {
    try {
        console.log('🔍 전기료 비교 실행 - 입력 아파트 개수:', apartments.length);
        
        const selectedApartments = apartments.slice(0, 3);
        const aptCodes = selectedApartments.map(apt => apt.cmpxCd);
        console.log('🔍 전기료 비교 API 호출 - 단지코드들:', aptCodes);
        
        const response = await fetch('/api/electric/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aptCodes)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const comparisonData = await response.json();
        console.log('🔍 전기료 비교 응답 데이터:', comparisonData);
        
        if (comparisonData.success && comparisonData.electricComparison) {
            // 전기료 데이터로 카드 업데이트
            updateApartmentCardsWithElectricData(comparisonData.electricComparison);
            
            displayElectricComparison(comparisonData.electricComparison);
            createElectricChart(comparisonData.electricComparison, apartments[0]);
            showSection('mgmtComparison');
        } else {
            console.error('❌ 전기료 비교 데이터 조회 실패:', comparisonData.message);
            showError('전기료 데이터를 불러올 수 없습니다: ' + (comparisonData.message || '알 수 없는 오류'));
        }
        
    } catch (error) {
        console.error('❌ 전기료 비교 실패:', error);
        showError('전기료 비교 중 오류가 발생했습니다: ' + error.message);
    }
}

// 🆕 관리비 비교 실행 함수
async function executeManagementComparison(apartments) {
    try {
        console.log('🔍 관리비 비교 실행 - 입력 아파트 개수:', apartments.length);
        
        const selectedApartments = apartments.slice(0, 3);
        const aptCodes = selectedApartments.map(apt => apt.cmpxCd);
        console.log('🔍 관리비 비교 API 호출 - 단지코드들:', aptCodes);
        
        const response = await fetch('/api/management/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aptCodes)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const comparisonData = await response.json();
        console.log('🔍 관리비 비교 응답 데이터:', comparisonData);
        
        if (comparisonData.mgmtComparison) {
            // 관리비 데이터로 카드 업데이트
            updateApartmentCardsWithManagementData(comparisonData.mgmtComparison);
            
            displayManagementComparison(comparisonData.mgmtComparison);
            createManagementChart(comparisonData.mgmtComparison, apartments[0]);
            showSection('mgmtComparison');
        } else {
            console.error('❌ 관리비 비교 데이터 조회 실패:', comparisonData.message);
            showError('관리비 데이터를 불러올 수 없습니다: ' + (comparisonData.message || '알 수 없는 오류'));
        }
        
    } catch (error) {
        console.error('❌ 관리비 비교 실패:', error);
        showError('관리비 비교 중 오류가 발생했습니다: ' + error.message);
    }
}

// 전기료 데이터로 아파트 카드들 업데이트하는 함수
function updateApartmentCardsWithElectricData(electricComparisonData) {
    console.log('🔄 전기료 데이터로 카드 업데이트 시작:', electricComparisonData);
    
    electricComparisonData.forEach(electricData => {
        // 해당 아파트 카드 찾기
        const card = document.querySelector(`[data-apartment-code="${electricData.cmpxCd}"]`);
        if (!card) {
            console.warn('⚠️ 카드를 찾을 수 없음:', electricData.cmpxCd);
            return;
        }
        
        // 기존 데이터 섹션 제거 후 전기료 섹션 추가
        removeExistingDataSection(card);
        addElectricSectionToCard(card, electricData);
        
        console.log('✅ 전기료 카드 업데이트 완료:', electricData.cmpxCd);
    });
}

// 🆕 관리비 데이터로 아파트 카드들 업데이트하는 함수
function updateApartmentCardsWithManagementData(managementComparisonData) {
    console.log('🔄 관리비 데이터로 카드 업데이트 시작:', managementComparisonData);
    
    managementComparisonData.forEach(mgmtData => {
        // 해당 아파트 카드 찾기
        const card = document.querySelector(`[data-apartment-code="${mgmtData.cmpxCd}"]`);
        if (!card) {
            console.warn('⚠️ 카드를 찾을 수 없음:', mgmtData.cmpxCd);
            return;
        }
        
        // 기존 데이터 섹션 제거 후 관리비 섹션 추가
        removeExistingDataSection(card);
        addManagementSectionToCard(card, mgmtData);
        
        console.log('✅ 관리비 카드 업데이트 완료:', mgmtData.cmpxCd);
    });
}

// 기존 데이터 섹션 제거 (전기료/관리비 섹션)
function removeExistingDataSection(card) {
    const electricSection = card.querySelector('.electric-info-section');
    const managementSection = card.querySelector('.management-info-section');
    
    if (electricSection) {
        electricSection.remove();
    }
    if (managementSection) {
        managementSection.remove();
    }
}

// 카드에 전기료 섹션 추가
function addElectricSectionToCard(card, electricData) {
    const electricInfoHtml = `
        <div class="electric-info-section">
            <div class="electric-info-title">공용 전기료 정보</div>
            <div class="electric-info-item highlight">
                <span class="label">공용전기료 총액</span>
                <span class="value">${electricData.electricPubTot ? electricData.electricPubTot.toLocaleString() + '원' : 'N/A'}</span>
            </div>
            <div class="electric-info-item">
                <span class="label">세대당 공용전기료</span>
                <span class="value">${electricData.electricPubPerUnit ? electricData.electricPubPerUnit.toLocaleString() + '원' : 'N/A'}</span>
            </div>
            <div class="electric-info-item">
                <span class="label">평당 공용전기료</span>
                <span class="value">${electricData.electricPubPerArea ? electricData.electricPubPerArea.toLocaleString() + '원/평' : 'N/A'}</span>
            </div>
        </div>
    `;
    
    // 카드 끝에 전기료 섹션 추가
    card.insertAdjacentHTML('beforeend', electricInfoHtml);
}

// 🆕 카드에 관리비 섹션 추가
function addManagementSectionToCard(card, mgmtData) {
    const managementInfoHtml = `
        <div class="management-info-section">
            <div class="management-info-title">관리비 정보</div>
            <div class="management-info-item highlight">
                <span class="label">총 관리비</span>
                <span class="value">${mgmtData.pubMgmtTot ? mgmtData.pubMgmtTot.toLocaleString() + '원' : 'N/A'}</span>
            </div>
            <div class="management-info-item">
                <span class="label">세대당 관리비</span>
                <span class="value">${mgmtData.mgmtPerUnit ? mgmtData.mgmtPerUnit.toLocaleString() + '원' : 'N/A'}</span>
            </div>
            <div class="management-info-item">
                <span class="label">면적당 관리비</span>
                <span class="value">${mgmtData.mgmtPerArea ? mgmtData.mgmtPerArea.toLocaleString() + '원/㎡' : 'N/A'}</span>
            </div>
        </div>
    `;
    
    // 카드 끝에 관리비 섹션 추가
    card.insertAdjacentHTML('beforeend', managementInfoHtml);
}

// 전기료 비교 테이블 표시
function displayElectricComparison(data) {
    const tableBody = document.querySelector('#mgmtComparisonTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        const isBase = index === 0;
        
        if (isBase) {
            row.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            row.style.fontWeight = '600';
        }

        row.innerHTML = `
            <td>${item.cmpxNm} ${isBase ? '<span style="color: #3b82f6; font-size: 12px;">(기준)</span>' : ''}</td>
            <td>${item.buildingAge || 0}년 (${item.ageCategory || 'N/A'})</td>
            <td>${item.unitTot?.toLocaleString() || 'N/A'}세대</td>
            <td>${item.mainAreaUnit || 'N/A'}㎡</td>
            <td>${item.electricPubTot?.toLocaleString() || 'N/A'}원</td>
            <td>${item.electricPubPerUnit?.toLocaleString() || 'N/A'}원</td>
            <td>${item.electricPubPerArea?.toLocaleString() || 'N/A'}원</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// 🆕 관리비 비교 테이블 표시
function displayManagementComparison(data) {
    const tableBody = document.querySelector('#mgmtComparisonTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    data.forEach((item, index) => {
        const row = document.createElement('tr');
        const isBase = index === 0;
        
        if (isBase) {
            row.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            row.style.fontWeight = '600';
        }

        row.innerHTML = `
            <td>${item.cmpxNm} ${isBase ? '<span style="color: #3b82f6; font-size: 12px;">(기준)</span>' : ''}</td>
            <td>${item.buildingAge || 0}년 (${item.ageCategory || 'N/A'})</td>
            <td>${item.unitTot?.toLocaleString() || 'N/A'}세대</td>
            <td>${item.mainAreaUnit || 'N/A'}㎡</td>
            <td>${item.pubMgmtTot?.toLocaleString() || 'N/A'}원</td>
            <td>${item.mgmtPerUnit?.toLocaleString() || 'N/A'}원</td>
            <td>${item.mgmtPerArea?.toLocaleString() || 'N/A'}원</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// 전기료 차트 생성
function createElectricChart(electricData, baseApartment) {
    const canvas = document.getElementById('mgmtChart');
    if (!canvas) {
        console.error('mgmtChart 캔버스를 찾을 수 없습니다');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // 기존 차트 파괴
    if (charts.mgmtChart) {
        charts.mgmtChart.destroy();
    }
    
    const labels = electricData.map(data => data.cmpxNm);
    const electricPubPerUnit = electricData.map(data => data.electricPubPerUnit || 0);
    const electricPrivPerUnit = electricData.map(data => data.electricPrivPerUnit || 0);
    const electricPubPerArea = electricData.map(data => data.electricPubPerArea || 0);
    
    const publicBackgroundColors = electricData.map(data => 
        data.cmpxCd === baseApartment.cmpxCd 
            ? 'rgba(59, 130, 246, 0.8)'
            : 'rgba(16, 185, 129, 0.8)'
    );
    
    const privateBackgroundColors = electricData.map(data => 
        data.cmpxCd === baseApartment.cmpxCd 
            ? 'rgba(239, 68, 68, 0.8)'
            : 'rgba(245, 158, 11, 0.8)'
    );
    
    charts.mgmtChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '세대당 공용 전기료 (원)',
                    data: electricPubPerUnit,
                    backgroundColor: publicBackgroundColors,
                    borderColor: publicBackgroundColors.map(color => color.replace('0.8', '1')),
                    borderWidth: 2,
                    yAxisID: 'y',
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                },
                {
                    label: '세대당 전용 전기료 (원)',
                    data: electricPrivPerUnit,
                    backgroundColor: privateBackgroundColors,
                    borderColor: privateBackgroundColors.map(color => color.replace('0.8', '1')),
                    borderWidth: 2,
                    yAxisID: 'y',
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                },
                {
                    label: '평당 공용 전기료 (원)',
                    data: electricPubPerArea,
                    type: 'line',
                    borderColor: 'rgba(147, 51, 234, 1)',
                    backgroundColor: 'rgba(147, 51, 234, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    yAxisID: 'y1',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgba(147, 51, 234, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '아파트별 전기료 비교',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#1f2937',
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return label + ': ' + value.toLocaleString() + '원';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0,
                        color: '#64748b',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '세대당 전기료 (원)',
                        color: '#374151',
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + '원';
                        },
                        color: '#64748b',
                        font: {
                            size: 11
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    border: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '평당 공용 전기료 (원)',
                        color: '#374151',
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + '원';
                        },
                        color: '#64748b',
                        font: {
                            size: 11
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            elements: {
                bar: {
                    borderRadius: 4
                },
                point: {
                    hoverBorderWidth: 3
                },
                line: {
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round'
                }
            }
        }
    });
    
    console.log('전기료 차트 생성 완료');
}

// 🆕 관리비 차트 생성
function createManagementChart(mgmtData, baseApartment) {
    const canvas = document.getElementById('mgmtChart');
    if (!canvas) {
        console.error('mgmtChart 캔버스를 찾을 수 없습니다');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // 기존 차트 파괴
    if (charts.mgmtChart) {
        charts.mgmtChart.destroy();
    }
    
    const labels = mgmtData.map(data => data.cmpxNm);
    const mgmtPerUnit = mgmtData.map(data => data.mgmtPerUnit || 0);
    const mgmtPerArea = mgmtData.map(data => data.mgmtPerArea || 0);
    const pubMgmtTot = mgmtData.map(data => data.pubMgmtTot || 0);
    
    const backgroundColors = mgmtData.map(data =>
        data.cmpxCd === baseApartment.cmpxCd
            ? 'rgba(59, 130, 246, 0.8)'
            : 'rgba(16, 185, 129, 0.8)'
    );
    
    const borderColors = mgmtData.map(data =>
        data.cmpxCd === baseApartment.cmpxCd
            ? 'rgba(59, 130, 246, 1)'
            : 'rgba(16, 185, 129, 1)'
    );

    charts.mgmtChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '세대당 관리비 (원)',
                    data: mgmtPerUnit,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    yAxisID: 'y',
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                },
                {
                    label: '면적당 관리비 (원/㎡)',
                    data: mgmtPerArea,
                    type: 'line',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    yAxisID: 'y1',
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '아파트별 관리비 비교',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#1f2937',
                    padding: 20
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            if (label.includes('면적당')) {
                                return label + ': ' + value.toLocaleString() + '원/㎡';
                            }
                            return label + ': ' + value.toLocaleString() + '원';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0,
                        color: '#64748b',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: true,
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    border: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '세대당 관리비 (원)',
                        color: '#374151',
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + '원';
                        },
                        color: '#64748b',
                        font: {
                            size: 11
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false,
                    },
                    border: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: '면적당 관리비 (원/㎡)',
                        color: '#374151',
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + '원/㎡';
                        },
                        color: '#64748b',
                        font: {
                            size: 11
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            elements: {
                bar: {
                    borderRadius: 4
                },
                point: {
                    hoverBorderWidth: 3
                },
                line: {
                    borderCapStyle: 'round',
                    borderJoinStyle: 'round'
                }
            }
        }
    });
    
    console.log('관리비 차트 생성 완료');
}

// 전기량 비교 데이터 로드
async function loadElectricityComparison(apartmentCode) {
    try {
        // 백엔드에서 3개 아파트 정보 가져오기 (단지코드 포함)
        const response = await fetch(`/api/apartment/electricity-comparison/${apartmentCode}`);
        
        if (!response.ok) {
            throw new Error('전기량 비교 데이터를 가져올 수 없습니다.');
        }
        
        const data = await response.json();
        
        // 3개 아파트 정보 (기준 + 유사 2개)
        const allApartments = [data.baseApartment, ...data.similarApartments.slice(0, 2)];
        
        // 각 아파트의 전기량 데이터 조회
        const electricityPromises = allApartments.map(async (apartment) => {
            const electricityData = await getElectricityUsage(apartment.cmpxCd);
            
            const buildingAge = calculateBuildingAge(apartment.apprDt);
            const ageCategory = getAgeCategory(buildingAge);
            
            return {
                apartmentName: apartment.cmpxNm,
                buildYear: apartment.apprDt ? new Date(apartment.apprDt).getFullYear() : '정보없음',
                category: ageCategory,
                cmpxCd: apartment.cmpxCd,
                // 실제 API 응답 필드에 맞게 수정
                electricityUsage: electricityData ? electricityData.helect : null,  // 전기 세대당 사용량
                electricityAmount: electricityData ? electricityData.elect : null,   // 전기 총 사용량
                electricityYear: electricityData ? electricityData.useYm : null,
                isBase: apartment.cmpxCd === apartmentCode
            };
        });
        
        const results = await Promise.all(electricityPromises);
        //displayElectricityComparison(results); // 이 함수는 현재 코드에 정의되어 있지 앖음.
        
    } catch (error) {
        console.error('전기량 데이터 로드 실패:', error);
        document.getElementById('electricityComparison').innerHTML = 
            '<div class="container"><p class="error-message">전기량 데이터를 불러오는 중 오류가 발생했습니다.</p></div>';
    }
}

// 기준 아파트 정보 표시
function displayBaseApartment(apartment, areaInfo) {
    document.getElementById('baseAptName').textContent = apartment.cmpxNm;
    document.getElementById('baseAptCode').textContent = apartment.cmpxCd;
    document.getElementById('baseUnitTotal').textContent = `${apartment.unitTot?.toLocaleString() || 0}세대`;
    document.getElementById('baseMainArea').textContent = areaInfo ? `${areaInfo.areaUnit}㎡ (${areaInfo.unitCnt}세대)` : '정보 없음';
    
    // 건물 연식 계산
    const buildingAge = calculateBuildingAge(apartment.apprDt);
    document.getElementById('baseBuildingAge').textContent = `${buildingAge}년 (${getAgeCategory(buildingAge)})`;
    
    document.getElementById('baseHeatType').textContent = apartment.heatTp || '정보 없음';
    document.getElementById('baseCorridorType').textContent = apartment.corrTp || '정보 없음';
    document.getElementById('baseMaxFloor').textContent = apartment.flrMax ? `${apartment.flrMax}층` : '정보 없음';
}

// 유사 아파트 표시 (UNCHANGED)
function displaySimilarApartments(apartments) {
    const container = document.getElementById('similarApartments');
    container.innerHTML = '';
    
    apartments.forEach((apt, index) => {
        const card = createSimilarApartmentCard(apt, index);
        container.appendChild(card);
    });
}

// 유사 아파트 카드 생성 
function createSimilarApartmentCard(apartment, index) {
    const card = document.createElement('div');
    
    const buildingAge = calculateBuildingAge(apartment.apprDt);
    const ageCategory = getAgeCategory(buildingAge);
    const ageCategoryKey = getAgeCategoryKey(ageCategory);
    
    card.className = 'similar-apartment-card';
    card.dataset.apartmentCode = apartment.cmpxCd;
    card.dataset.index = index;
    
    // ⭐ 노후도별 data-age-category 속성 추가
    card.dataset.ageCategory = ageCategoryKey;
    
    // 차이값을 백분율로 변환하는 공식
    const maxDifference = 1000;
    const similarity = Math.max(0, 100 - (apartment.differenceScore / maxDifference * 100));
    
    // 100% 유사도(기준 아파트)인 경우
    const isBase = similarity.toFixed(1) === '100.0';
    if (isBase) {
        card.classList.add('perfect-match');
        card.classList.add('base-apartment-card');
        setTimeout(() => {
            
        }, 100);
    }

    // ⭐ 노후도별 유사도 태그 색상 클래스 생성
    const similarityClass = getSimilarityClass(ageCategoryKey, isBase);
    
    // ⭐ 연식 태그에 노후도별 클래스 추가
    const ageTagClass = `badge badge-${getAgeBadgeClass(ageCategory)} age-category ${ageCategoryKey}`;

    // 🆕 페이지 타입에 따른 데이터 섹션 HTML 생성
    let dataInfoHtml = '';
    if (currentPageType === 'electric') {
        dataInfoHtml = `
            <div class="electric-info-section">
                <div class="electric-info-title">공용 전기료 정보</div>
                <div class="electric-info-item highlight">
                    <span class="label">공용전기료 총액</span>
                    <span class="value">N/A</span>
                </div>
                <div class="electric-info-item">
                    <span class="label">세대당 공용전기료</span>
                    <span class="value">N/A</span>
                </div>
                <div class="electric-info-item">
                    <span class="label">평당 공용전기료</span>
                    <span class="value">N/A</span>
                </div>
            </div>
        `;
    } else if (currentPageType === 'management') {
        dataInfoHtml = `
            <div class="management-info-section">
                <div class="management-info-title">관리비 정보</div>
                <div class="management-info-item highlight">
                    <span class="label">총 관리비</span>
                    <span class="value">N/A</span>
                </div>
                <div class="management-info-item">
                    <span class="label">세대당 관리비</span>
                    <span class="value">N/A</span>
                </div>
                <div class="management-info-item">
                    <span class="label">면적당 관리비</span>
                    <span class="value">N/A</span>
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        <div class="similarity-score-wrapper">
            <div class="similarity-score ${similarityClass}">${isBase ? '기준' : `유사도 ${similarity.toFixed(1)}%`}</div>
            <div class="apartment-code-small">${apartment.cmpxCd}</div>
        </div>
        <div class="apartment-name">${apartment.cmpxNm}</div>
        <div class="info-item">
            <span class="label">건축년도</span>
            <span class="value">${apartment.apprDt ? new Date(apartment.apprDt).getFullYear() : 'N/A'}년 <span class="${ageTagClass}">${ageCategory}</span></span>
        </div>
        <div class="info-item">
            <span class="label">총 세대수</span>
            <span class="value">${apartment.unitTot?.toLocaleString() || 'N/A'}세대</span>
        </div>
        <div class="info-item">
            <span class="label">주요 면적</span>
            <span class="value">${apartment.mainAreaUnit || 'N/A'}㎡</span>
        </div>
        <div class="info-item">
            <span class="label">최고층수</span>
            <span class="value">${apartment.flrMax || 'N/A'}층</span>
        </div>
        <div class="info-item">
            <span class="label">총 층수</span>
            <span class="value">${apartment.totalFloors || apartment.flrMax || 'N/A'}층</span>
        </div>
        <div class="info-item">
            <span class="label">동수</span>
            <span class="value">${apartment.bldgCnt || 'N/A'}동</span>
        </div>
        <div class="info-item full-width-item">
            <span class="label">주소</span>
            <span class="value">${apartment.lglAddr || '정보 없음'}</span>
        </div>
        ${dataInfoHtml}
    `;
    
    // 카드 클릭 이벤트
    card.addEventListener('click', function(event) {
        toggleApartmentSelection(this);
    });
    
    return card;
}

// 노후도를 키로 변환하는 함수
function getAgeCategoryKey(category) {
    switch(category) {
        case '신축': return 'new';
        case '중간': return 'medium';
        case '노후': return 'old';
        default: return 'new';
    }
}

// 노후도별 유사도 태그 색상 클래스 반환
function getSimilarityClass(ageCategoryKey, isBase) {
    if (isBase) {
        // 기준 카드는 더 진한 색상
        switch(ageCategoryKey) {
            case 'new': return 'similarity-base-new';
            case 'medium': return 'similarity-base-medium';
            case 'old': return 'similarity-base-old';
            default: return 'similarity-base-new';
        }
    } else {
        // 일반 카드는 연한 색상
        switch(ageCategoryKey) {
            case 'new': return 'similarity-new';
            case 'medium': return 'similarity-medium';
            case 'old': return 'similarity-old';
            default: return 'similarity-new';
        }
    }
}

// 아파트 선택/해제 토글 (UNCHANGED)
function toggleApartmentSelection(cardElement) {
    const apartmentCode = cardElement.dataset.apartmentCode;
    
    if (cardElement.classList.contains('selected')) {
        // 선택 해제
        cardElement.classList.remove('selected');
        selectedApartments = selectedApartments.filter(code => code !== apartmentCode);
    } else {
        // 선택
        cardElement.classList.add('selected');
        if (!selectedApartments.includes(apartmentCode)) {
            selectedApartments.push(apartmentCode);
        }
    }
    
    updateCompareButton();
}

// 전체 선택 (UNCHANGED)
function selectAllApartments() {
    document.querySelectorAll('.similar-apartment-card').forEach(card => {
        if (!card.classList.contains('selected')) {
            card.classList.add('selected');
            const apartmentCode = card.dataset.apartmentCode;
            if (!selectedApartments.includes(apartmentCode)) {
                selectedApartments.push(apartmentCode);
            }
        }
    });
    updateCompareButton();
}

// 선택 해제 (UNCHANGED)
function clearSelection() {
    document.querySelectorAll('.similar-apartment-card').forEach(card => {
        card.classList.remove('selected');
    });
    selectedApartments = [];
    updateCompareButton();
}

// 비교 버튼 업데이트 (UNCHANGED)
function updateCompareButton() {
    const button = document.getElementById('compareSelectedBtn');
    if (selectedApartments.length > 0) {
        button.textContent = `선택된 ${selectedApartments.length}개 아파트 비교`;
        button.disabled = false;
    } else {
        button.textContent = '선택된 아파트 비교';
        button.disabled = true;
    }
}

// 원본 스크립트에 헬퍼 함수가 정의되어 있지 않은 경우를 위한 예시 플레이스홀더
function calculateBuildingAge(apprDt) {
    if (!apprDt) return 'N/A';
    const approvalYear = new Date(apprDt).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - approvalYear;
}

function getAgeCategory(age) {
    if (age >= 20) return '노후';
    if (age >= 10) return '중간';
    return '신축';
}

function getAgeBadgeClass(category) {
    switch (category) {
        case '신축': return 'success';
        case '중간': return 'warning';
        case '노후': return 'danger';
        default: return 'secondary';
    }
}

// 선택된 아파트 비교
async function compareSelected() {
    if (selectedApartments.length === 0) {
        showError('비교할 아파트를 선택해주세요.');
        return;
    }
    
    if (!currentBaseApartment) {
        showError('기준 아파트 정보가 없습니다.');
        return;
    }
    
    showLoading(true);
    
    try {
        // 기준 아파트도 포함
        const allApartments = [currentBaseApartment.cmpxCd, ...selectedApartments];
        
        // 페이지 타입에 따라 다른 API 호출
        const apiUrl = currentPageType === 'electric' 
            ? '/api/electric/compare' 
            : '/api/management/compare';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(allApartments)
        });
        
        if (!response.ok) {
            throw new Error(`${currentPageType === 'electric' ? '전기료' : '관리비'} 비교 데이터를 가져올 수 없습니다.`);
        }
        
        const comparisonData = await response.json();
        
        if (currentPageType === 'electric') {
            if (comparisonData.success && comparisonData.electricComparison) {
                displayElectricComparison(comparisonData.electricComparison);
                createElectricChart(comparisonData.electricComparison, currentBaseApartment);
            }
        } else {
            if (comparisonData.mgmtComparison) {
                displayManagementComparison(comparisonData.mgmtComparison);
                createManagementChart(comparisonData.mgmtComparison, currentBaseApartment);
            }
        }
        
        showSection('mgmtComparison');
		createElectricChart(comparisonData.electricComparison, apartments[0]);
        
    } catch (error) {
        console.error(`${currentPageType === 'electric' ? '전기료' : '관리비'} 비교 실패:`, error);
        showError(`${currentPageType === 'electric' ? '전기료' : '관리비'} 비교 중 오류가 발생했습니다: ` + error.message);
    } finally {
        showLoading(false);
    }
}

// 유틸리티 함수들

// 건물 연식 계산
function calculateBuildingAge(approvalDate) {
    if (!approvalDate) return 0;
    
    const approval = new Date(approvalDate);
    const now = new Date();
    const diffTime = Math.abs(now - approval);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    
    return diffYears;
}

// 연식 카테고리 반환
function getAgeCategory(age) {
    if (age >= 20) return '노후';
    if (age >= 10) return '중간';
    return '신축';
}

// 연식 뱃지 클래스 반환
function getAgeBadgeClass(category) {
    switch (category) {
        case '신축': return 'success';
        case '중간': return 'warning';
        case '노후': return 'danger';
        default: return 'secondary';
    }
}

// 통화 형식으로 포맷
function formatCurrency(amount) {
    if (!amount) return '0원';
    return Math.round(amount).toLocaleString() + '원';
}

// 로딩 스피너 표시/숨김
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

// 모든 섹션 숨김
function hideAllSections() {
	// 각 요소를 찾아서 존재할 경우에만 classList를 조작하도록 수정!!!
    const baseApartment = document.getElementById('baseApartment');
    if (baseApartment) {
        baseApartment.classList.add('hidden'); 
    }

    const comparison = document.getElementById('comparison');
    if (comparison) {
        comparison.classList.add('hidden');
    }

    const mgmtComparison = document.getElementById('mgmtComparison');
    if (mgmtComparison) {
        mgmtComparison.classList.add('hidden');
    }

    const statistics = document.getElementById('statistics');
    if (statistics) {
        statistics.classList.add('hidden');
    }
}

// 섹션 표시
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) { // null 체크 추가
        section.classList.remove('hidden');
        section.classList.add('fade-in');
    }
}

// 에러 모달 표시
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.remove('hidden');
}

// 모달 닫기
function closeModal() {
    document.getElementById('errorModal').classList.add('hidden');
}

// 페이지 스크롤 시 네비게이션 하이라이트
window.addEventListener('scroll', function() {
    const sections = ['search', 'comparison', 'statistics'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        if (section && !section.classList.contains('hidden')) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }
    });
});

// 상세 통계 표시
function displayDetailedStats(statsData) {
    // 면적별 세대수 차트
    createAreaChart(statsData.areaInfoList);
    
    // 관리비 추이 차트
    createTrendChart(statsData.mgmtHistory);
    
    // 관리비 구성 차트
    createCompositionChart(statsData.mgmtHistory[0]);
}

// 면적별 세대수 차트 생성
function createAreaChart(areaInfoList) {
    const container = document.getElementById('areaChart');
    if (!areaInfoList || areaInfoList.length === 0) {
        container.innerHTML = '<p>면적 정보가 없습니다.</p>';
        return;
    }
    
    container.innerHTML = '<canvas id="areaChartCanvas" width="300" height="200"></canvas>';
    const ctx = document.getElementById('areaChartCanvas').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: areaInfoList.map(area => `${area.areaUnit}㎡`),
            datasets: [{
                data: areaInfoList.map(area => area.unitCnt),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#36A2EB'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 관리비 추이 차트 생성
function createTrendChart(mgmtHistory) {
    const container = document.getElementById('trendChart');
    if (!mgmtHistory || mgmtHistory.length === 0) {
        container.innerHTML = '<p>관리비 히스토리가 없습니다.</p>';
        return;
    }
    
    container.innerHTML = '<canvas id="trendChartCanvas" width="300" height="200"></canvas>';
    const ctx = document.getElementById('trendChartCanvas').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: mgmtHistory.map(data => data.occYm).reverse(),
            datasets: [{
                label: '공용관리비',
                data: mgmtHistory.map(data => data.pubMgmtTot).reverse(),
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

// 관리비 구성 차트 생성
function createCompositionChart(latestMgmt) {
    const container = document.getElementById('compositionChart');
    if (!latestMgmt) {
        container.innerHTML = '<p>관리비 구성 정보가 없습니다.</p>';
        return;
    }
    
    container.innerHTML = '<canvas id="compositionChartCanvas" width="300" height="200"></canvas>';
    const ctx = document.getElementById('compositionChartCanvas').getContext('2d');
    
    const compositionData = [
        { label: '인건비', value: latestMgmt.laborCost },
        { label: '청소비', value: latestMgmt.cleanCost },
        { label: '경비비', value: latestMgmt.securityCost },
        { label: '승강기유지비', value: latestMgmt.elevatorCost },
        { label: '수선비', value: latestMgmt.repairCost },
        { label: '기타', value: latestMgmt.etcCost }
    ].filter(item => item.value > 0);
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: compositionData.map(item => item.label),
            datasets: [{
                data: compositionData.map(item => item.value),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// 비교 제목 업데이트 함수
function updateComparisonTitle(apartmentName) {
    const titleElement = document.getElementById('comparisonTitle');
    if (titleElement && apartmentName) {
        const dataType = currentPageType === 'electric' ? '전기료' : '관리비';
        titleElement.textContent = `[${apartmentName}] vs 유사 아파트 ${dataType} 비교`;
        selectedApartmentName = apartmentName;
    }
}