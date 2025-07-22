// 전역 변수
let yearlyData = null;
let seasonalData = null;
let efficiencyData = null;
let publicYearlyChart = null; // 전기료 추이 - 공용 연도별
let privateYearlyChart = null; // 전기료 추이 - 전용 연도별
let publicMonthlyChart = null; // 전기료 추이 - 공용 월별
let privateMonthlyChart = null; // 전기료 추이 - 전용 월별
let seasonalPublicChart = null;
let seasonalPrivateChart = null;
let efficiencySingleChart = null; // 통합된 효율 차트
// let mySwiper = null; // Swiper 인스턴스를 저장할 변수 (제거)

// 전기료 추이 차트 관련 변수 추가
let currentElectricChartType = 'yearly'; // 'yearly' or 'monthly'
let currentElectricDataType = 'public'; // 'public' or 'private'
let selectedElectricYear = new Date().getFullYear().toString(); // Default to current year

// 월별 데이터 캐시 (이미 로드된 월별 데이터를 저장)
const monthlyElectricDataCache = {
    public: {}, // { year: data }
    private: {} // { year: data }
};

// 계절별 차트 관련 변수 추가
let currentSeasonalDataType = 'public'; // 'public' or 'private'

// 계절별 탭 클릭 이벤트 핸들러 (기존과 동일)
function handleSeasonalTabClick(dataType) {
    currentSeasonalDataType = dataType;
    updateSeasonalChartDisplay();
}

// 색상 설정 (기존과 동일)
const colors = {
    new: '#10b981',      // 신축 - 초록색 (Emerald-500)
    medium: '#f59e0b',   // 중견 - 주황색 (Amber-500)
    old: '#ef4444'       // 노후 - 빨간색 (Red-500)
};

// 계절별 색상 설정 (기존과 동일)
const seasonalColors = {
    summer: '#f97316',   // 여름철 - 주황색 (Orange-500)
    winter: '#3b82f6'    // 겨울철 - 파란색 (Blue-500)
};

// 페이지 로드 시 초기화 (기존과 동일)
document.addEventListener('DOMContentLoaded', function() {
    const storedCode = localStorage.getItem('selectedApartmentCode');
    const storedName = localStorage.getItem('selectedApartmentName');

    if (storedCode && storedName) {
        const select = document.getElementById('apartmentSelect');
        const input = document.getElementById('apartmentCode');

        if (select) {
            const observer = new MutationObserver(() => {
                const option = [...select.options].find(opt => opt.value === storedCode);
                if (option) {
                    select.value = storedCode;
                    observer.disconnect(); // 옵션 선택 후 옵저버 해제
                }
            });
            observer.observe(select, { childList: true });
        }

        if (input) {
            input.value = storedCode;
        }

        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            setTimeout(() => searchBtn.click(), 500);
        }
    }
    console.log('페이지 로드 완료');
    initializePage();

    // trendChartRetryBtn 클릭 이벤트 리스너 추가 (오류 시 재시도)
    document.getElementById('trendChartRetryBtn').addEventListener('click', async function() {
        console.log("Retry button clicked for electric trend chart.");
        await initializePage(); // 전체 페이지 데이터 로드 및 차트 재렌더링
    });
});

// 페이지 초기화 (Swiper 관련 부분 제거)
async function initializePage() {
    console.log('페이지 초기화 시작');
    // 모든 로딩 스피너를 초기화 시 보이게 합니다.
    showLoading('loadingSpinner');      // 전체 페이지 로딩 스피너
    showLoading('loadingTrendChart');   // 전기료 추이 차트 로딩 스피너

    // 오류 메시지 및 다시 시도 버튼 숨기기
    hideError(); // 전체 오류 모달 숨기기
    hideChartError('trendChartRetryBtn'); // 전기료 추이 차트 재시도 버튼 숨기기

    try {
        // 모든 데이터 로드
        await Promise.all([
            loadYearlyData(),
            loadSeasonalData(),
            loadEfficiencyData()
        ]);
        
        // 전기료 추이 차트를 위한 연도 선택기 초기화 및 최신 데이터 로드
        setupElectricTrendYearSelect();
        // 초기 월별 데이터 로드를 위해 현재 선택된 연도와 타입을 사용하여 로드
        await Promise.all([
            loadElectricMonthlyData(selectedElectricYear, 'public'),
            loadElectricMonthlyData(selectedElectricYear, 'private')
        ]);
        
        // Swiper 초기화 제거. 대신 모든 차트를 직접 생성합니다.
        // initializeSwiper(); // 제거

        // Swiper가 없으므로 모든 차트를 직접 생성 및 업데이트합니다.
        console.log('Swiper가 없으므로 모든 차트 직접 렌더링 호출');
        createElectricTrendCharts();
        createSeasonalCharts();
        createEfficiencyCharts();
        
        // 초기 렌더링 후 디스플레이 업데이트 (차트 표시 로직)
        updateElectricTrendChartDisplay();
        updateSeasonalChartDisplay();


        // 전기료 추이 탭 이벤트 설정 (Swiper와 관계 없이 작동)
        setupElectricTrendTabEvents();
        // 계절별 탭 이벤트 설정
        setupSeasonalTabEvents();

        hideLoading('loadingSpinner'); // 전체 페이지 로딩 스피너 숨기기
        hideLoading('loadingTrendChart'); // 전기료 추이 차트 로딩 스피너 숨기기
        console.log('페이지 초기화 완료');
    } catch (error) {
        console.error('페이지 초기화 실패:', error);
        // 전기료 추이 차트에서 에러 발생 시 재시도 버튼 표시
        showChartError('trendChartRetryBtn');
        hideLoading('loadingSpinner');      // 에러 발생 시 전체 페이지 로딩 스피너 숨기기
        hideLoading('loadingTrendChart');   // 에러 발생 시 전기료 추이 차트 로딩 스피너 숨기기
    }
}





// Swiper 초기화 함수 (제거)
// function initializeSwiper() {
//     console.log('Swiper 초기화 시작');
//     if (mySwiper) {
//         mySwiper.destroy(true, true); // 기존 Swiper 인스턴스 파괴
//     }

//     mySwiper = new Swiper('.mySwiper', {
//         effect: 'slide',
//         slidesPerView: 1,
//         centeredSlides: true,
//         spaceBetween: 10,
//         loop: false,
//         pagination: {
//             el: '.swiper-pagination',
//             clickable: true,
//         },
//         navigation: {
//             nextEl: '.swiper-button-next',
//             prevEl: '.swiper-button-prev',
//         },
//         breakpoints: {
//             768: {
//                 slidesPerView: 1,
//                 spaceBetween: 10,
//             },
//             1024: {
//                 slidesPerView: 1,
//                 spaceBetween: 10,
//             },
//         },
//         on: {
//             init: function () {
//                 console.log('Swiper init 이벤트 발생. 초기 슬라이드 렌더링.');
//                 this.slides.forEach(function(slide) {
//                     slide.style.transform = 'scale(1)';
//                     slide.style.opacity = '1';
//                 });
//                 renderChartsForSlide(this.realIndex);
//             },
//             slideChangeTransitionEnd: function () {
//                 console.log('Swiper slideChangeTransitionEnd 이벤트 발생. 차트 재렌더링.');
//                 this.slides.forEach(function(slide) {
//                     slide.style.transform = 'scale(1)';
//                     slide.style.opacity = '1';
//                 });
//                 renderChartsForSlide(this.realIndex);
//             }
//         }
//     });
//     console.log('Swiper 초기화 완료');
// }

// Swiper 슬라이드 인덱스에 따라 해당 차트를 렌더링하는 함수 (제거)
// function renderChartsForSlide(slideIndex) {
//     console.log(`현재 활성 슬라이드 인덱스 (realIndex): ${slideIndex}, 해당 차트 렌더링 시도.`);

//     // 모든 차트 인스턴스 파괴하여 메모리 해제 및 깨끗한 상태에서 다시 그리기
//     destroyAllCharts();

//     switch (slideIndex) {
//         case 0: // 전기료 - 연식별 전기료 추이 (공용/전용)
//             console.log('전기료 추이 차트 렌더링 호출');
//             createElectricTrendCharts();
//             // 탭 상태를 현재 전역 변수에 따라 업데이트
//             updateElectricTrendChartDisplay();
//             break;
//         case 1: // 전기료 - 계절별 전기료 비교
//             console.log('계절별 전기료 차트 렌더링 호출');
//             createSeasonalCharts();
//             updateSeasonalChartDisplay(); // 계절별 차트 디스플레이 업데이트 호출
//             break;
//         case 2: // 전기료 - 단위 면적당 전기료 효율 분석
//             console.log('효율 전기료 차트 렌더링 호출');
//             createEfficiencyCharts();
//             break;
//         default:
//             console.warn(`알 수 없는 슬라이드 인덱스: ${slideIndex}. 차트를 렌더링하지 않습니다.`);
//             break;
//     }
// }

// 모든 차트 인스턴스를 파괴하는 헬퍼 함수 (이제 직접 호출할 필요 없음, initializePage에서 개별 차트 파괴)
function destroyAllCharts() {
    console.log('모든 차트 인스턴스 파괴 시작');
    // Swiper를 제거했으므로, 이 함수는 더 이상 모든 차트를 일괄 파괴할 필요가 없습니다.
    // 각 차트 생성 함수에서 자신의 차트 인스턴스를 파괴하고 다시 그릴 것입니다.
    // 하지만 안전을 위해 여기에 남겨두되, 호출 경로는 변경됩니다.
    if (publicYearlyChart) { publicYearlyChart.destroy(); publicYearlyChart = null; }
    if (privateYearlyChart) { privateYearlyChart.destroy(); privateYearlyChart = null; }
    if (publicMonthlyChart) { publicMonthlyChart.destroy(); publicMonthlyChart = null; }
    if (privateMonthlyChart) { privateMonthlyChart.destroy(); privateMonthlyChart = null; }
    if (seasonalPublicChart) { seasonalPublicChart.destroy(); seasonalPublicChart = null; }
    if (seasonalPrivateChart) { seasonalPrivateChart.destroy(); seasonalPrivateChart = null; }
    if (efficiencySingleChart) { efficiencySingleChart.destroy(); efficiencySingleChart = null; }
    console.log('모든 차트 인스턴스 파괴 완료');
}


// 연별 데이터 로드 (기존과 동일)
async function loadYearlyData() {
    try {
        console.log('연별 데이터 로드 시작');
        const response = await fetch('/api/electric/yearly-trend'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        yearlyData = await response.json();
        console.log('✅ 연별 데이터 로드 성공:', yearlyData);
    } catch (error) {
        console.error('❌ 연별 데이터 로드 실패:', error);
        throw error;
    }
}

// 계절별 데이터 로드 (기존과 동일)
async function loadSeasonalData() {
    try {
        console.log('계절별 데이터 로드 시작');
        const response = await fetch('/api/electric/seasonal-data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        seasonalData = await response.json();
        console.log('✅ 계절별 데이터 로드 성공:', seasonalData);
    } catch (error) {
        console.error('❌ 계절별 데이터 로드 실패:', error);
        throw error;
    }
}

// 효율 데이터 로드 (기존과 동일)
async function loadEfficiencyData() {
    try {
        console.log('🚀 효율 데이터 로드 시작');
        const url = '/api/electric/area-efficiency';
        console.log('🌐 효율 API 호출 URL:', url);

        console.log('📡 fetch 시작...');
        const response = await fetch(url);
        console.log('📡 fetch 완료, 응답 객체:', response);
        console.log('📡 효율 API 응답 상태:', response.status, response.statusText);
        console.log('📡 응답 헤더:', response.headers);

        if (!response.ok) {
            console.error(`❌ HTTP 에러! status: ${response.status}, statusText: ${response.statusText}`);
            const errorText = await response.text();
            console.error('❌ 에러 응답 내용:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        console.log('📡 JSON 파싱 시작...');
        const responseData = await response.json();
        console.log('📡 JSON 파싱 완료');

        efficiencyData = responseData;
        console.log('✅ 효율 데이터 로드 성공!');
        console.log('📊 받은 데이터 타입:', typeof efficiencyData);
        console.log('📊 받은 데이터:', efficiencyData);
        console.log('📊 효율 데이터 개수:', efficiencyData ? efficiencyData.length : 'null/undefined');

        if (efficiencyData && efficiencyData.length > 0) {
            console.log('🔍 첫 번째 효율 데이터 샘플:', efficiencyData[0]);
            console.log('🔍 효율 데이터 키들:', Object.keys(efficiencyData[0]));
        } else {
            console.warn('⚠️ 효율 데이터가 비어있거나 잘못된 형태입니다');
        }

    } catch (error) {
        console.error('❌ 효율 데이터 로드 실패!');
        console.error('❌ 에러 타입:', error.name);
        console.error('❌ 에러 메시지:', error.message);
        console.error('❌ 전체 에러:', error);

        if (error instanceof TypeError && error.message.includes('fetch')) {
            console.error('🌐 네트워크 에러: API 서버가 실행 중인지 확인하세요');
        }
        throw error;
    }
}

// ============== 전기료 추이 차트 관련 함수 시작 ==============

// 전기료 추이 탭 이벤트 설정 (기존과 동일)
function setupElectricTrendTabEvents() {
    // 공용/전용 탭
    document.querySelectorAll('.electric-chart .tab-buttons button[data-type]').forEach(button => {
        button.removeEventListener('click', handleElectricDataTypeChange); // 이중 리스너 방지
        button.addEventListener('click', handleElectricDataTypeChange);
    });

    // 연도별/월별 탭
    document.querySelectorAll('.electric-chart .tab-buttons button[data-chart-type]').forEach(button => {
        button.removeEventListener('click', handleElectricChartTypeChange); // 이중 리스너 방지
        button.addEventListener('click', handleElectricChartTypeChange);
    });

    // 연도 선택 드롭다운
    const yearSelect = document.getElementById('yearSelect'); // HTML ID를 yearSelect로 통일
    if (yearSelect) {
        yearSelect.removeEventListener('change', handleElectricYearChange); // 이중 리스너 방지
        yearSelect.addEventListener('change', handleElectricYearChange);
    }
}

// 전기료 데이터 타입 변경 핸들러 (공용/전용) (기존과 동일)
function handleElectricDataTypeChange(event) {
    document.querySelectorAll('.electric-chart .tab-buttons button[data-type]').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentElectricDataType = event.target.dataset.type;
    updateElectricTrendChartDisplay(); // 데이터 타입 변경 시 차트 다시 그리기
}

// 전기료 차트 타입 변경 핸들러 (연도별/월별) (수정됨: dataset.chart-type -> dataset.chartType)
async function handleElectricChartTypeChange(event) {
    document.querySelectorAll('.electric-chart .tab-buttons button[data-chart-type]').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    currentElectricChartType = event.target.dataset.chartType; // 수정됨: chart-type -> chartType

    const yearSelectContainer = document.querySelector('.electric-chart .year-select-container');
    if (currentElectricChartType === 'monthly') {
        yearSelectContainer.classList.remove('hidden');
        // 월별 데이터가 아직 로드되지 않았으면 로드
        if (!monthlyElectricDataCache[currentElectricDataType][selectedElectricYear]) {
            await loadElectricMonthlyData(selectedElectricYear, currentElectricDataType);
        }
    } else {
        yearSelectContainer.classList.add('hidden');
    }
    updateElectricTrendChartDisplay();
}

// 전기료 연도 변경 핸들러 (기존과 동일)
async function handleElectricYearChange(event) {
    selectedElectricYear = event.target.value;
    await loadElectricMonthlyData(selectedElectricYear, currentElectricDataType);
}

// 전기료 추이 차트의 연도 선택 드롭다운 채우기 (기존과 동일)
function setupElectricTrendYearSelect() {
    const yearSelect = document.getElementById('yearSelect'); // HTML ID를 yearSelect로 통일
    if (!yearSelect) return;

    yearSelect.innerHTML = ''; // Clear existing options

    // yearlyData에서 사용 가능한 모든 연도를 추출
    const years = new Set();
    if (yearlyData) {
        yearlyData.forEach(item => years.add(item.year.toString()));
    }

    const sortedYears = Array.from(years).sort((a, b) => b - a); // 최신 연도부터 표시

    if (sortedYears.length > 0) {
        sortedYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `${year}년`;
            yearSelect.appendChild(option);
        });
        // 현재 선택된 연도가 없거나 목록에 없으면 최신 연도로 설정
        if (!selectedElectricYear || !sortedYears.includes(selectedElectricYear)) {
            selectedElectricYear = sortedYears[0];
            yearSelect.value = selectedElectricYear;
        } else {
            yearSelect.value = selectedElectricYear;
        }
    } else {
        // 데이터가 없는 경우 메시지 표시 또는 기본 연도 설정
        const option = document.createElement('option');
        option.value = new Date().getFullYear().toString();
        option.textContent = `${new Date().getFullYear()}년 (데이터 없음)`;
        yearSelect.appendChild(option);
        selectedElectricYear = new Date().getFullYear().toString();
        yearSelect.value = selectedElectricYear;
    }
}

// 전기료 월별 데이터 로드 (기존과 동일)
async function loadElectricMonthlyData(year, type) {
    if (!yearlyData || yearlyData.length === 0) {
        console.warn('연별 데이터가 없어서 월별 데이터를 로드할 수 없습니다. 월별 차트를 초기화합니다.');
        clearElectricTrendChart('monthly', '연별 데이터가 없어 월별 데이터 로드 불가', true);
        return; 
    }

    // 이미 캐시에 데이터가 있으면 다시 로드하지 않음
    if (monthlyElectricDataCache[type][year]) {
        console.log(`월별 데이터 캐시 히트: ${year}년, ${type}`);
        // updateElectricTrendChartDisplay(); // 여기서 호출하면 무한루프 가능성 있음
        return;
    }

    console.log(`🚀 전기료 월별 데이터 로드 시작: ${year}년, ${type} 데이터`);
    showLoading('loadingTrendChart'); // 추이 차트 로딩 스피너
    hideChartError('trendChartRetryBtn');

    try {
        const response = await fetch(`/api/electric/monthly-data?year=${year}?year=${year}`); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`📊 ${year}년 월별 상세 응답 데이터:`, data);

        // API 응답에서 공용/전용 데이터를 분리하여 캐시
        const organizedPublicData = {};
        const organizedPrivateData = {};

        data.forEach(item => {
            if (item.dataType === 'public') {
                if (!organizedPublicData[item.ageCategory]) {
                    organizedPublicData[item.ageCategory] = {};
                }
                organizedPublicData[item.ageCategory][item.analysisMonth.toString()] = item.avgElectricCharge;
            } else if (item.dataType === 'private') {
                if (!organizedPrivateData[item.ageCategory]) {
                    organizedPrivateData[item.ageCategory] = {};
                }
                organizedPrivateData[item.ageCategory][item.analysisMonth.toString()] = item.avgElectricCharge;
            }
        });

        monthlyElectricDataCache.public[year] = organizedPublicData;
        monthlyElectricDataCache.private[year] = organizedPrivateData;

        // updateElectricTrendChartDisplay(); // loadElectricMonthlyData 호출자에서 updateElectricTrendChartDisplay를 호출하도록 함
    } catch (error) {
        console.error('❌ 전기료 월별 데이터 로드 실패:', error);
        showChartError('trendChartRetryBtn');
        // 데이터 로드 실패 시 차트 영역에 메시지 표시
        if (currentElectricChartType === 'monthly') {
            clearElectricTrendChart('monthly', '월별 데이터 로드 실패', true);
        }
    } finally {
        hideLoading('loadingTrendChart');
    }
}

// 전기료 추이 차트 생성 및 업데이트 (공용/전용, 연도별/월별 모두 처리) (기존과 동일)
function createElectricTrendCharts() {
    console.log('전기료 추이 차트 생성 시작');

    // PUBLIC Yearly Chart Canvas
    const publicYearlyCanvas = document.getElementById('electricTrendPublicYearlyCanvas');
    if (!publicYearlyCanvas) {
        console.error('공용 연도별 전기료 추이 차트 캔버스(electricTrendPublicYearlyCanvas)를 찾을 수 없습니다.');
        return;
    }

    // PUBLIC Monthly Chart Canvas
    const publicMonthlyCanvas = document.getElementById('electricTrendPublicMonthlyCanvas');
    if (!publicMonthlyCanvas) {
        console.error('공용 월별 전기료 추이 차트 캔버스(electricTrendPublicMonthlyCanvas)를 찾을 수 없습니다.');
        return;
    }

    // PRIVATE Yearly Chart Canvas
    const privateYearlyCanvas = document.getElementById('electricTrendPrivateYearlyCanvas');
    if (!privateYearlyCanvas) {
        console.error('전용 연도별 전기료 추이 차트 캔버스(electricTrendPrivateYearlyCanvas)를 찾을 수 없습니다.');
        return;
    }

    // PRIVATE Monthly Chart Canvas
    const privateMonthlyCanvas = document.getElementById('electricTrendPrivateMonthlyCanvas');
    if (!privateMonthlyCanvas) {
        console.error('전용 월별 전기료 추이 차트 캔버스(electricTrendPrivateMonthlyCanvas)를 찾을 수 없습니다.');
        return;
    }

    // Existing chart instance destruction (good practice to avoid memory leaks)
    if (publicYearlyChart) { publicYearlyChart.destroy(); publicYearlyChart = null; }
    if (privateYearlyChart) { privateYearlyChart.destroy(); privateYearlyChart = null; }
    if (publicMonthlyChart) { publicMonthlyChart.destroy(); publicMonthlyChart = null; }
    if (privateMonthlyChart) { privateMonthlyChart.destroy(); privateMonthlyChart = null; }

    if (!yearlyData || yearlyData.length === 0) {
        console.warn('yearlyData가 없어 전기료 추이 차트를 그릴 수 없습니다.');
        clearElectricTrendChart('yearly', '연도별 데이터가 없습니다.', true);
        clearElectricTrendChart('monthly', '월별 데이터가 없습니다.', true);
        return;
    }

    const years = [...new Set(yearlyData.map(item => item.year))].sort((a, b) => a - b);
    const categories = ['신축', '중견', '노후'];

    // 연도별 공용 데이터셋
    const publicYearlyDatasets = categories.map(category => {
        const data = years.map(year => {
            const item = yearlyData.find(d => d.year === year && d.aptGroup === category);
            return item ? item.avgElectricPubPerHouse : null;
        });
        return { label: category, data: data, borderColor: colors[getCategoryKey(category)], backgroundColor: colors[getCategoryKey(category)] + '20', borderWidth: 3, fill: false, tension: 0.4, pointRadius: 5, pointHoverRadius: 7, spanGaps: false };
    });
    console.log('publicYearlyDatasets:', publicYearlyDatasets);

    // 연도별 전용 데이터셋
    const privateYearlyDatasets = categories.map(category => {
        const data = years.map(year => {
            const item = yearlyData.find(d => d.year === year && d.aptGroup === category);
            return item ? item.avgElectricPrivPerHouse : null;
        });
        return { label: category, data: data, borderColor: colors[getCategoryKey(category)], backgroundColor: colors[getCategoryKey(category)] + '20', borderWidth: 3, fill: false, tension: 0.4, pointRadius: 5, pointHoverRadius: 7, spanGaps: false };
    });
    console.log('privateYearlyDatasets:', privateYearlyDatasets);

    publicYearlyChart = new Chart(publicYearlyCanvas.getContext('2d'), {
        type: 'line',
        data: { labels: years, datasets: publicYearlyDatasets },
        options: getElectricTrendChartOptions('연도별 공용 전기료 (원)')
    });
    console.log('publicYearlyChart 생성됨:', publicYearlyChart);

    privateYearlyChart = new Chart(privateYearlyCanvas.getContext('2d'), {
        type: 'line',
        data: { labels: years, datasets: privateYearlyDatasets },
        options: getElectricTrendChartOptions('연도별 전용 전기료 (원)')
    });
    console.log('privateYearlyChart 생성됨:', privateYearlyChart);

    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    publicMonthlyChart = new Chart(publicMonthlyCanvas.getContext('2d'), {
        type: 'line',
        data: { labels: months, datasets: [] },
        options: getElectricTrendChartOptions('월별 공용 전기료 (원)')
    });
    console.log('publicMonthlyChart 생성됨:', publicMonthlyChart);

    privateMonthlyChart = new Chart(privateMonthlyCanvas.getContext('2d'), {
        type: 'line',
        data: { labels: months, datasets: [] }, 
        options: getElectricTrendChartOptions('월별 전용 전기료 (원)')
    });
    console.log('privateMonthlyChart 생성됨 (더미 캔버스):', privateMonthlyChart);

    // updateElectricTrendChartDisplay(); // createCharts 다음에 initializePage에서 한번만 호출하면 됨
    console.log('전기료 추이 차트 초기 생성 완료');
}

// 전기료 추이 차트 표시 업데이트 (공용/전용, 연도별/월별 전환 로직) (기존과 동일)
function updateElectricTrendChartDisplay() {
    console.log(`전기료 차트 디스플레이 업데이트: 타입=${currentElectricDataType}, 주기=${currentElectricChartType}`);

    // Get all relevant chart containers
    const publicYearlyContainer = document.getElementById('electricTrendPublicYearlyContainer');
    const publicMonthlyContainer = document.getElementById('electricTrendPublicMonthlyContainer');
    const privateYearlyContainer = document.getElementById('electricTrendPrivateYearlyContainer');
    const privateMonthlyContainer = document.getElementById('electricTrendPrivateMonthlyContainer');
    const yearSelectContainer = document.querySelector('.electric-chart .year-select-container'); // This one seems correctly referenced based on your HTML

    // Ensure all elements exist before proceeding
    if (!publicYearlyContainer || !publicMonthlyContainer || !privateYearlyContainer || !privateMonthlyContainer || !yearSelectContainer) {
        console.error('필수 전기료 추이 차트 컨테이너 요소를 찾을 수 없습니다. HTML ID를 확인하세요.');
        return;
    }

    // Hide all chart containers initially
    publicYearlyContainer.classList.add('hidden');
    publicMonthlyContainer.classList.add('hidden');
    privateYearlyContainer.classList.add('hidden');
    privateMonthlyContainer.classList.add('hidden');
    yearSelectContainer.classList.add('hidden'); // Hide year select by default for yearly charts

    // Show the appropriate chart based on currentElectricDataType and currentElectricChartType
    if (currentElectricDataType === 'public') {
        if (currentElectricChartType === 'yearly') {
            publicYearlyContainer.classList.remove('hidden');
            if (publicYearlyChart) publicYearlyChart.update();
            console.log('공용 연도별 전기료 차트 표시');
        } else { // 'monthly'
            publicMonthlyContainer.classList.remove('hidden');
            yearSelectContainer.classList.remove('hidden'); // Show year select for monthly charts
            if (publicMonthlyChart) {
                // Update monthly chart with data from cache
                const monthlyData = monthlyElectricDataCache.public[selectedElectricYear];
                if (monthlyData) {
                    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
                    const categories = ['신축', '중견', '노후'];
                    publicMonthlyChart.data.labels = months;
                    publicMonthlyChart.data.datasets = categories.map(category => {
                        const data = months.map((month, index) => {
                            // Convert month string '1월' to number '1'
                            const monthNum = index + 1;
                            return monthlyData[getCategoryKey(category)] ? monthlyData[getCategoryKey(category)][monthNum.toString()] : null;
                        });
                        return {
                            label: category,
                            data: data,
                            borderColor: colors[getCategoryKey(category)],
                            backgroundColor: colors[getCategoryKey(category)] + '20',
                            borderWidth: 3,
                            fill: false,
                            tension: 0.4,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            spanGaps: false
                        };
                    });
                    publicMonthlyChart.update();
                    console.log('공용 월별 전기료 차트 표시 및 업데이트');
                } else {
                    console.warn(`공용 월별 데이터 캐시에 ${selectedElectricYear}년 데이터가 없습니다. 차트가 업데이트되지 않았습니다.`);
                    clearElectricTrendChart('monthly', '공용 월별 데이터 없음', true);
                }
            }
        }
    } else { // currentElectricDataType === 'private'
        if (currentElectricChartType === 'yearly') {
            privateYearlyContainer.classList.remove('hidden');
            if (privateYearlyChart) privateYearlyChart.update();
            console.log('전용 연도별 전기료 차트 표시');
        } else { // 'monthly'
            privateMonthlyContainer.classList.remove('hidden');
            yearSelectContainer.classList.remove('hidden'); // Show year select for monthly charts
            if (privateMonthlyChart) {
                // Update monthly chart with data from cache
                const monthlyData = monthlyElectricDataCache.private[selectedElectricYear];
                if (monthlyData) {
                    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
                    const categories = ['신축', '중견', '노후'];
                    privateMonthlyChart.data.labels = months;
                    privateMonthlyChart.data.datasets = categories.map(category => {
                        const data = months.map((month, index) => {
                            const monthNum = index + 1;
                            return monthlyData[getCategoryKey(category)] ? monthlyData[getCategoryKey(category)][monthNum.toString()] : null;
                        });
                        return {
                            label: category,
                            data: data,
                            borderColor: colors[getCategoryKey(category)],
                            backgroundColor: colors[getCategoryKey(category)] + '20',
                            borderWidth: 3,
                            fill: false,
                            tension: 0.4,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            spanGaps: false
                        };
                    });
                    privateMonthlyChart.update();
                    console.log('전용 월별 전기료 차트 표시 및 업데이트');
                } else {
                    console.warn(`전용 월별 데이터 캐시에 ${selectedElectricYear}년 데이터가 없습니다. 차트가 업데이트되지 않았습니다.`);
                    clearElectricTrendChart('monthly', '전용 월별 데이터 없음', true);
                }
            }
        }
    }

    // Update tab button active states for electric trend
    document.querySelectorAll('.electric-chart .tab-buttons button[data-chart-type]').forEach(btn => {
        if (btn.dataset.chartType === currentElectricChartType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update public/private tab active states based on the specific tab group
    // Assuming these exist within the .electric-chart context, not .chart-group-container
    document.querySelectorAll('.electric-chart .tab-buttons button[data-type]').forEach(btn => {
        if (btn.dataset.type === currentElectricDataType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    console.log('전기료 차트 디스플레이 업데이트 완료');
}

// Helper function to get category key (기존과 동일)
function getCategoryKey(categoryName) {
    switch (categoryName) {
        case '신축': return 'new';
        case '중견': return 'medium';
        case '노후': return 'old';
        default: return '';
    }
}

// Function to clear chart and display message (기존과 동일)
// 이 함수는 electricTrendChartYearly/Monthly용으로 사용됨
function clearElectricTrendChart(chartType, message, showNoDataMessage = true) {
    const canvasContainerId = `electricTrend${currentElectricDataType.charAt(0).toUpperCase() + currentElectricDataType.slice(1)}${chartType.charAt(0).toUpperCase() + chartType.slice(1)}Container`; // Updated ID construction
    const container = document.getElementById(canvasContainerId);
    
    if (container) {
        // 기존 차트 인스턴스 파괴
        let chartInstance = null;
        if (chartType === 'yearly') {
            chartInstance = currentElectricDataType === 'public' ? publicYearlyChart : privateYearlyChart;
            if (chartInstance) chartInstance.destroy();
            if (currentElectricDataType === 'public') publicYearlyChart = null; // 인스턴스 초기화
            else privateYearlyChart = null; // 인스턴스 초기화
        } else if (chartType === 'monthly') {
            chartInstance = currentElectricDataType === 'public' ? publicMonthlyChart : privateMonthlyChart;
            if (chartInstance) chartInstance.destroy();
            if (currentElectricDataType === 'public') publicMonthlyChart = null; // 인스턴스 초기화
            else privateMonthlyChart = null; // 인스턴스 초기화
        }
        
        // 메시지를 표시하거나 캔버스 재생성
        if (showNoDataMessage) {
            container.innerHTML = `<p class="no-data">${message}</p>`;
            console.log(`${canvasContainerId}: 데이터 없음 메시지 표시 - "${message}"`);
        } else {
            // 메시지를 지우고 캔버스 다시 삽입 (차트가 그려질 공간 확보)
            container.innerHTML = '';
            const newCanvas = document.createElement('canvas');
            newCanvas.id = currentElectricDataType === 'public' 
                ? (chartType === 'yearly' ? 'electricTrendPublicYearlyCanvas' : 'electricTrendPublicMonthlyCanvas')
                : (chartType === 'yearly' ? 'electricTrendPrivateYearlyCanvas' : 'electricTrendPrivateMonthlyCanvas');
            newCanvas.className = 'chart-large';
            container.appendChild(newCanvas);
            console.log(`${canvasContainerId}: 캔버스 재생성`);
        }
    } else {
        console.warn(`clearElectricTrendChart: 컨테이너를 찾을 수 없습니다 - ${canvasContainerId}`);
    }
}
// 전기료 추이 차트 옵션
function getElectricTrendChartOptions(yAxisLabel) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
		layout: {
            padding: {
                top: 0, // 💡 상단 여백을 0으로 설정하여 없앱니다.
                right: 20,
                left: 20,
                bottom: 50
            }
        },
        plugins: {
            legend: {
                display: false, // 💡 범례(Legend)를 숨깁니다.
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 25,
                    font: {
                        size: 14,
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
                displayColors: true,
                filter: function(tooltipItem) {
                    return tooltipItem.parsed.y !== null;
                },
                callbacks: {
                    title: function(context) {
                        if (currentElectricChartType === 'yearly') {
                            return context[0].label + '년';
                        } else {
                            return context[0].label + '월'; // 월별일 때 '월' 추가
                        }
                    },
                    label: function(context) {
                        if (context.parsed.y === null) return null;
                        return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + '원';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: '#f1f5f9',
                    drawBorder: false
                },
                border: {
                    display: false
                },
                ticks: {
                    callback: function(value) {
                        return value.toLocaleString() + '원';
                    },
                    color: '#64748b',
                    font: {
                        size: 12
                    },
                    padding: 10
                },
                title: {
                    display: false, // 💡 Y축 제목을 숨깁니다.
                    text: yAxisLabel,
                    color: '#374151',
                    font: {
                        size: 14,
                        weight: '600'
                    },
                    padding: 20
                }
            },
            x: {
                grid: {
                    color: '#f1f5f9',
                    drawBorder: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 12
                    },
                    padding: 10
                },
                title: {
                    display: false, // 💡 X축 제목을 숨깁니다.
                    text: currentElectricChartType === 'yearly' ? '연도' : '월',
                    color: '#374151',
                    font: {
                        size: 14,
                        weight: '600'
                    },
                    padding: 20
                }
            }
        },
        elements: {
            point: {
                hoverBorderWidth: 3
            },
            line: {
                borderCapStyle: 'round',
                borderJoinStyle: 'round'
            }
        }
    };
}


// ============== 전기료 추이 차트 관련 함수 끝 ==============


// ============== 계절별 차트 관련 함수 시작 ==============

// 계절별 탭 이벤트 설정 (기존과 동일)
function setupSeasonalTabEvents() {
    document.querySelectorAll('.seasonal-charts-grid .chart-tabs button').forEach(button => {
		document.querySelector('.seasonal-charts-grid .chart-tabs button[data-tab="seasonal-public"]').classList.add('active');
		document.querySelector('.seasonal-charts-grid .chart-tabs button[data-tab="seasonal-private"]').classList.remove('active');
    });
}

// 계절별 데이터 타입 변경 핸들러 (공용/전용) (기존과 동일)
function handleSeasonalDataTypeChange(event) {
    // 모든 탭 버튼에서 active 클래스 제거
    document.querySelectorAll('.seasonal-charts-grid .chart-tabs button').forEach(btn => btn.classList.remove('active'));
    // 클릭된 버튼에 active 클래스 추가
    event.target.classList.add('active');
    currentSeasonalDataType = event.target.dataset.tab; // data-tab 속성을 사용하도록 변경
    updateSeasonalChartDisplay();
}

// 계절별 차트가 없을 때 메시지 표시 (seasonalPublic/PrivateCanvas용)
function clearSeasonalChart(canvasId, message) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`clearSeasonalChart: 캔버스를 찾을 수 없습니다 - ${canvasId}`);
        return;
    }

    // 기존 차트 인스턴스 파괴
    if (canvasId === 'seasonalPublicCanvas' && seasonalPublicChart) {
        seasonalPublicChart.destroy();
        seasonalPublicChart = null;
    } else if (canvasId === 'seasonalPrivateCanvas' && seasonalPrivateChart) {
        seasonalPrivateChart.destroy();
        seasonalPrivateChart = null;
    }

    const container = canvas.parentElement; 
    if (container) {
        // 기존 캔버스를 제거하기 전에 컨테이너의 자식인지 확인
        if (container.contains(canvas)) {
             canvas.remove();
        }

        let messageDiv = container.querySelector('.no-data-message');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.classList.add('no-data-message');
            messageDiv.style.textAlign = 'center';
            messageDiv.style.padding = '20px';
            messageDiv.style.color = '#777';
            container.appendChild(messageDiv);
        }
        messageDiv.textContent = message;
        messageDiv.classList.remove('hidden');
        
        console.log(`${canvasId}: 데이터 없음 메시지 표시 - "${message}"`);
    } else {
        console.error(`clearSeasonalChart: 컨테이너를 찾을 수 없습니다 - ${canvasId}`);
        // Fallback if container is not found, attempt to put message on parent
        const parentOfCanvas = document.getElementById(canvasId)?.parentElement;
        if (parentOfCanvas) {
            parentOfCanvas.innerHTML = `<p class="no-data">${message}</p>`;
        }
    }
}

// 이 함수는 메시지를 지우고 캔버스 엘리먼트를 다시 생성합니다.
function recreateSeasonalCanvas(canvasId) {
    const canvasElement = document.getElementById(canvasId);
    let container;

    if (canvasElement) {
        container = canvasElement.parentElement;
        // 기존 캔버스 제거
        canvasElement.remove();
    } else {
        // 캔버스 자체가 없으면, 컨테이너를 직접 찾아 새로 생성
        if (canvasId === 'seasonalPublicCanvas') {
            container = document.getElementById('seasonalPublicChart');
        } else if (canvasId === 'seasonalPrivateCanvas') {
            container = document.getElementById('seasonalPrivateChart');
        }
        if (!container) {
            console.error(`recreateSeasonalCanvas: 캔버스 및 컨테이너를 찾을 수 없습니다 - ${canvasId}`);
            return;
        }
    }

    if (container) {
        // 기존 메시지 제거
        const messageDiv = container.querySelector('.no-data-message');
        if (messageDiv) messageDiv.remove();

        const newCanvas = document.createElement('canvas');
        newCanvas.id = canvasId;
        newCanvas.className = 'chart-large'; // 필요한 클래스 유지
        container.appendChild(newCanvas);
        console.log(`${canvasId}: 캔버스 재생성 완료`);
    } else {
        console.error(`recreateSeasonalCanvas: 캔버스 컨테이너를 찾을 수 없습니다 - ${canvasId}`);
    }
}


// 계절별 차트 생성
function createSeasonalCharts() {
    console.log('계절별 차트 생성 시작');

    // 캔버스 ID를 직접 사용
    const seasonalPublicCanvasId = 'seasonalPublicCanvas';
    const seasonalPrivateCanvasId = 'seasonalPrivateCanvas';

    const seasonalChartErrorDiv = document.getElementById('seasonalChartError');
    if (seasonalChartErrorDiv) seasonalChartErrorDiv.classList.add('hidden');

    // 기존 차트 인스턴스 파괴 및 캔버스 재생성
    if (seasonalPublicChart) { seasonalPublicChart.destroy(); seasonalPublicChart = null; }
    recreateSeasonalCanvas(seasonalPublicCanvasId);
    
    if (seasonalPrivateChart) { seasonalPrivateChart.destroy(); seasonalPrivateChart = null; }
    recreateSeasonalCanvas(seasonalPrivateCanvasId);
    
    const seasonalPublicCanvas = document.getElementById(seasonalPublicCanvasId);
    const seasonalPrivateCanvas = document.getElementById(seasonalPrivateCanvasId);

    if (!seasonalPublicCanvas || !seasonalPrivateCanvas) {
        console.error('계절별 차트 캔버스 요소를 찾을 수 없습니다. HTML ID를 확인하세요.');
        if (seasonalChartErrorDiv) {
            seasonalChartErrorDiv.classList.remove('hidden');
            seasonalChartErrorDiv.querySelector('p').textContent = '계절별 차트 표시 요소를 찾을 수 없습니다.';
        }
        return;
    }

    if (!seasonalData || seasonalData.length === 0) {
        console.error('계절별 데이터가 없습니다');
        clearSeasonalChart(seasonalPublicCanvasId, '계절별 공용 전기료 데이터가 없습니다.');
        clearSeasonalChart(seasonalPrivateCanvasId, '계절별 전용 전기료 데이터가 없습니다.');
        
        if (seasonalChartErrorDiv) {
            seasonalChartErrorDiv.classList.remove('hidden');
            seasonalChartErrorDiv.querySelector('p').textContent = '계절별 데이터를 로드할 수 없습니다.';
        }
        return;
    } else {
        // 데이터가 있다면, 차트 에러 메시지가 표시되어 있을 경우 숨깁니다.
        if (seasonalChartErrorDiv) seasonalChartErrorDiv.classList.add('hidden');
    }

    const categories = ['신축', '중견', '노후'];
    const seasons = ['여름철', '겨울철'];

    // 공용 전기료 계절별 데이터셋 생성
    const publicSeasonalDatasets = seasons.map(season => {
        const data = categories.map(category => {
            const item = seasonalData.find(d => d.ageCategory === category && d.season === season);
            return item ? item.avgElectricPubPerHouse : null; // 데이터 없을 시 null 처리
        });

        return {
            label: season,
            data: data,
            backgroundColor: seasonalColors[getSeasonKey(season)],
            borderColor: seasonalColors[getSeasonKey(season)],
            borderWidth: 1
        };
    });
    console.log('publicSeasonalDatasets:', publicSeasonalDatasets);

    // 전용 전기료 계절별 데이터셋 생성
    const privateSeasonalDatasets = seasons.map(season => {
        const data = categories.map(category => {
            const item = seasonalData.find(d => d.ageCategory === category && d.season === season);
            return item ? item.avgElectricPrivPerHouse : null; // 데이터 없을 시 null 처리
        });

        return {
            label: season,
            data: data,
            backgroundColor: seasonalColors[getSeasonKey(season)],
            borderColor: seasonalColors[getSeasonKey(season)],
            borderWidth: 1
        };
    });
    console.log('privateSeasonalDatasets:', privateSeasonalDatasets);

    try {
        const publicCtx = seasonalPublicCanvas.getContext('2d');
        seasonalPublicChart = new Chart(publicCtx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: publicSeasonalDatasets
            },
            options: getSeasonalChartOptions('공용 전기료 (원)')
        });
        console.log('공용 전기료 계절별 차트 생성 완료');
    } catch (error) {
        console.error('공용 전기료 계절별 차트 생성 실패:', error);
        clearSeasonalChart(seasonalPublicCanvasId, '공용 전기료 차트 생성 중 오류가 발생했습니다.');
        if (seasonalChartErrorDiv) {
            seasonalChartErrorDiv.classList.remove('hidden');
            seasonalChartErrorDiv.querySelector('p').textContent = '공용 전기료 계절별 차트 생성 중 오류가 발생했습니다.';
        }
    }

    try {
        const privateCtx = seasonalPrivateCanvas.getContext('2d');
        seasonalPrivateChart = new Chart(privateCtx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: privateSeasonalDatasets
            },
            options: getSeasonalChartOptions('전용 전기료 (원)')
        });
        console.log('전용 전기료 계절별 차트 생성 완료');
    } catch (error) {
        console.error('전용 전기료 계절별 차트 생성 실패:', error);
        clearSeasonalChart(seasonalPrivateCanvasId, '전용 전기료 차트 생성 중 오류가 발생했습니다.');
        if (seasonalChartErrorDiv) {
            seasonalChartErrorDiv.classList.remove('hidden');
            seasonalChartErrorDiv.querySelector('p').textContent = '전용 전기료 계절별 차트 생성 중 오류가 발생했습니다.';
        }
    }

    // updateSeasonalChartDisplay(); // createCharts 다음에 initializePage에서 한번만 호출하면 됨
    if (seasonalChartErrorDiv) seasonalChartErrorDiv.classList.add('hidden');
}

// 계절별 차트 표시 업데이트 (공용/전용 전환 로직)
function updateSeasonalChartDisplay() {
    console.log(`계절별 차트 디스플레이 업데이트: 타입=${currentSeasonalDataType}`);

    // 직접 캔버스 컨테이너 ID를 사용합니다.
    const seasonalPublicChartContainer = document.getElementById('seasonalPublicChart');
    const seasonalPrivateChartContainer = document.getElementById('seasonalPrivateChart');

    if (!seasonalPublicChartContainer || !seasonalPrivateChartContainer) {
        console.error('계절별 차트 컨테이너 요소를 찾을 수 없습니다. HTML ID를 확인하세요.');
        const seasonalChartErrorDiv = document.getElementById('seasonalChartError');
        if (seasonalChartErrorDiv) {
            seasonalChartErrorDiv.classList.remove('hidden');
            seasonalChartErrorDiv.querySelector('p').textContent = '계절별 차트 컨테이너를 찾을 수 없습니다. HTML ID를 확인하세요.';
        }
        return;
    }

	// === 이 부분이 수정됩니다: 모든 차트 컨테이너를 항상 표시합니다. ===
    seasonalPublicChartContainer.classList.remove('hidden'); // 공용 차트 컨테이너 항상 표시
    seasonalPrivateChartContainer.classList.remove('hidden'); // 전용 차트 컨테이너 항상 표시
    // 기존의 currentSeasonalDataType에 따른 숨김/표시 로직은 모두 제거합니다.
    // =========================================================

    // 차트 인스턴스가 존재하면 업데이트를 호출합니다.
    // 만약 차트 인스턴스가 없으면 (초기 로드 또는 데이터 문제), createSeasonalCharts()를 다시 호출하여 차트 생성을 시도합니다.
    if (seasonalPublicChart) {
        seasonalPublicChart.update();
        console.log('공용 계절별 차트 표시 및 업데이트');
    } else {
        console.warn('seasonalPublicChart 인스턴스가 없어 공용 계절별 차트 업데이트 불가. 차트 생성을 시도합니다.');
        // createSeasonalCharts() 함수는 이미 두 차트를 모두 생성하려고 시도합니다.
        // 여기서는 이미 생성되었다고 가정하고 update()만 호출하므로,
        // 만약 차트가 없다면 초기 로딩 시 createSeasonalCharts()가 제대로 호출되었는지 확인해야 합니다.
        // 불필요한 차트 재생성을 막기 위해, 차트 생성은 initializePage() 또는 해당 차트 섹션 로딩 시에만 하도록 합니다.
    }

    if (seasonalPrivateChart) {
        seasonalPrivateChart.update();
        console.log('전용 계절별 차트 표시 및 업데이트');
    } else {
        console.warn('seasonalPrivateChart 인스턴스가 없어 전용 계절별 차트 업데이트 불가. 차트 생성을 시도합니다.');
    }

    // 탭 버튼의 활성화 상태는 이제 차트 가시성을 제어하지 않고,
    // 단순히 시각적인 피드백만을 제공합니다.
    // 필요에 따라 모든 버튼의 'active' 클래스를 관리할 수 있지만,
    // 두 차트가 항상 보이는 상황에서는 '공용'만 활성화된 것처럼 유지하거나,
    // 이 로직 자체를 제거해도 됩니다. 여기서는 제거된 것으로 간주합니다.
    document.querySelectorAll('.seasonal-charts-grid .chart-tabs button').forEach(button => {
        button.classList.remove('active'); // 모든 버튼의 active 클래스 제거
    });
    // 필요하다면 특정 버튼에 active 클래스를 수동으로 추가 (예: 공용 탭)
    document.querySelector('.seasonal-charts-grid .chart-tabs button[data-tab="seasonal-public"]').classList.add('active');


    console.log('계절별 차트 디스플레이 업데이트 완료');
}

// ============== 계절별 차트 관련 함수 끝 ==============


// 통합된 효율 차트 생성 (기존과 동일)
function createEfficiencyCharts() {
    console.log('통합 효율 차트 생성 시작');

    const canvas = document.getElementById('efficiencySingleCanvas');
    if (!canvas) {
        console.error('efficiencySingleCanvas 캔버스를 찾을 수 없습니다');
        return;
    }

    if (!efficiencyData || efficiencyData.length === 0) {
        console.error('효율 데이터가 없습니다');
        if (canvas) canvas.parentElement.innerHTML = '<p class="no-data">효율 분석 데이터가 없습니다.</p>';
        return;
    }

    const years = [...new Set(efficiencyData.map(item => item.analysisYear))].sort((a, b) => a - b); // 오름차순 정렬
    const categories = ['신축', '중견', '노후'];

    const datasets = categories.map(category => {
        const data = years.map(year => {
            const item = efficiencyData.find(d => d.analysisYear === year && d.ageCategory === category);
            return item ? item.avgElectricPubPerSqm : null;
        });

        return {
            label: category,
            data: data,
            borderColor: colors[getCategoryKey(category)],
            backgroundColor: colors[getCategoryKey(category)] + '20',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            spanGaps: false,
            pointBorderWidth: 2,
            pointBackgroundColor: colors[getCategoryKey(category)],
            pointBorderColor: '#ffffff'
        };
    });
    console.log('efficiencySingleChart datasets:', datasets);

    try {
        if (efficiencySingleChart) {
            efficiencySingleChart.destroy();
            efficiencySingleChart = null;
        }

        efficiencySingleChart = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: years,
                datasets: datasets
            },
            options: getEfficiencySingleChartOptions()
        });
        console.log('통합 효율 차트 생성 완료');
    } catch (error) {
        console.error('통합 효율 차트 생성 실패:', error);
        if (canvas) canvas.parentElement.innerHTML = '<p class="no-data">효율 차트 생성 중 오류가 발생했습니다.</p>';
    }
}


// 통합 효율 차트 옵션 (기존과 동일)
function getEfficiencySingleChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 50,
                bottom: 50
            }
        },
        plugins: {
            legend: {
                display: false,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 25,
                    font: {
                        size: 14,
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
                displayColors: true,
                filter: function(tooltipItem) {
                    return tooltipItem.parsed.y !== null;
                },
                callbacks: {
                    title: function(context) {
                        return context[0].label + '년';
                    },
                    label: function(context) {
                        if (context.parsed.y === null) return null;
                        return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + '원/㎡';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: '#f1f5f9',
                    drawBorder: false
                },
                border: {
                    display: false
                },
                ticks: {
                    callback: function(value) {
                        return value.toFixed(1) + '원/㎡';
                    },
                    color: '#64748b',
                    font: {
                        size: 12
                    },
                    padding: 10
                },
                title: {
                    display: true,
                    text: '단위 면적당 평균 공용 전기료 (원/㎡)',
                    color: '#374151',
                    font: {
                        size: 14,
                        weight: '600'
                    },
                    padding: 20
                }
            },
            x: {
                grid: {
                    color: '#f1f5f9',
                    drawBorder: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 12
                    },
                    padding: 10
                },
                title: {
                    display: true,
                    text: '연도',
                    color: '#374151',
                    font: {
                        size: 14,
                        weight: '600'
                    },
                    padding: 20
                }
            }
        },
        elements: {
            point: {
                hoverBorderWidth: 3
            },
            line: {
                borderCapStyle: 'round',
                borderJoinStyle: 'round'
            }
        }
    };
}
// 계절별 차트 옵션 생성 (기존과 동일)
function getSeasonalChartOptions(yAxisLabel) {
    return {
        responsive: true,
        maintainAspectRatio: false,
		layout: {
            padding: {
                top: 10, // 상단 여백 추가
                right: 5,
                left: 5,
                bottom: 10
            }
        },
        plugins: {
            legend: {
                display: true, // 계절별은 계절 구분을 위해 legend 필요
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 25,
                    font: {
                        size: 14,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + '원';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9'
                },
                ticks: {
                    callback: function(value) {
                        return value.toLocaleString() + '원';
                    }
                },
                title: {
                    display: true,
                    text: yAxisLabel,
					color: '#374151',
                    font: {
                        size: 14,
                        weight: '600'
                    }
                }
            },
            x: {
                grid: {
                    color: '#f1f5f9'
                },
                title: {
                    display: true,
                    text: '노후 그룹', // Changed to "노후 그룹"
					color: '#374151',
                    font: {
                        size: 14,
                        weight: '600'
                    }
                }
            }
        }
    };
}


// 카테고리 키 변환 유틸리티 함수 (기존과 동일)
function getCategoryKey(category) {
    switch(category) {
        case '신축': return 'new';
        case '중견': return 'medium';
        case '노후': return 'old';
        default: return 'new'; // 기본값 설정
    }
}

// 계절 키 변환 유틸리티 함수 (기존과 동일)
function getSeasonKey(season) {
    switch(season) {
        case '여름철': return 'summer';
        case '겨울철': return 'winter';
        default: return 'summer'; // 기본값 설정
    }
}

// 로딩 표시 함수 개선 (기존과 동일)
function showLoading(elementId) {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.classList.remove('hidden');
    }
}

// 로딩 숨김 함수 개선 (기존과 동일)
function hideLoading(elementId) {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.classList.add('hidden');
    }
}

// 전체 페이지 에러 모달 표시 (메시지 포함) (기존과 동일)
function showError(message = '데이터 로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.') {
    const errorModal = document.getElementById('errorModal');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorMessage) {
        errorMessage.textContent = message;
    }
    if (errorModal) {
        errorModal.classList.remove('hidden');
    }
    hideLoading('loadingSpinner'); // 에러 발생 시 전체 로딩 스피너 숨김
    hideLoading('loadingTrendChart'); // 에러 발생 시 전기료 추이 로딩 스피너 숨김
}

// 전체 페이지 에러 모달 숨김 (기존과 동일)
function hideError() {
    const errorModal = document.getElementById('errorModal');
    if (errorModal) {
        errorModal.classList.add('hidden');
    }
}

// 차트별 에러 메시지 및 다시 시도 버튼 표시/숨김 (기존과 동일)
function showChartError(retryButtonId) {
    const retryButton = document.getElementById(retryButtonId);
    if (retryButton) {
        retryButton.classList.remove('hidden');
    }
}

function hideChartError(retryButtonId) {
    const retryButton = document.getElementById(retryButtonId);
    if (retryButton) {
        retryButton.classList.add('hidden');
    }
}


// 모달 닫기 기능 추가 (HTML에 모달이 있으므로 JS에서도 제어) (기존과 동일)
document.addEventListener('click', function(event) {
    const modal = document.getElementById('errorModal');
    if (modal && (event.target.classList.contains('modal-close') || event.target.classList.contains('modal'))) {
        modal.classList.add('hidden');
        // 모달이 닫힐 때 로딩 스피너가 보인다면 숨김 (안전 장치)
        hideLoading('loadingSpinner');
        hideLoading('loadingTrendChart');
    }
});

// Quick Menu toggle (기존과 동일)
$('.quick-menu-section h4 .toggle-arrow').on('click', function () {
    var $h4 = $(this).closest('h4');
    var $submenu = $h4.parent().next('.quick-menu-submenu');

    $h4.toggleClass('open');
    $submenu.slideToggle(300);
});