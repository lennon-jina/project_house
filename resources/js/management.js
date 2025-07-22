// 관리비 분석 페이지 JavaScript - 장기수선충당금 기능 추가

class ManagementAnalysis {
    constructor() {
        this.chart = null;
        this.compositionChart = null;
        this.costComparisonChart = null;
        this.reserveFundChart = null; // 🆕 장기수선충당금 차트
        this.currentTab = 'public'; // 기본값: 공용관리비
        this.currentReserveTab = 'status'; // 🆕 장충금 탭 기본값: 현황
        this.publicData = null;
        this.individualData = null;
        this.compositionData = null;
        this.costComparisonData = null;
        this.reserveFundStatusData = null; // 🆕 장충금 현황 데이터
        this.reserveFundTrendData = null; // 🆕 장충금 추이 데이터
        this.init();
    }

    async init() {
        this.setupTabEvents();
        this.setupReserveTabEvents(); // 🆕 장충금 탭 이벤트 설정
        try {
            await this.loadData();
            await this.loadCompositionData();
            await this.loadCostComparisonData();
            await this.loadReserveFundData(); // 🆕 장충금 데이터 로드
        } catch (error) {
            console.error('초기화 실패:', error);
            this.showError();
        }
    }

    setupTabEvents() {
        const tabButtons = document.querySelectorAll('.tab-button');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabType = e.target.dataset.tab;
                this.switchTab(tabType);
            });
        });
    }

    // 🆕 장기수선충당금 탭 이벤트 설정
    setupReserveTabEvents() {
        const reserveTabButtons = document.querySelectorAll('.reserve-tab-button');
        
        reserveTabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabType = e.target.dataset.reserveTab;
                this.switchReserveTab(tabType);
            });
        });
    }

    switchTab(tabType) {
        // 탭 버튼 활성화 상태 변경
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabType}"]`).classList.add('active');
        
        this.currentTab = tabType;
        
        // 해당 탭 데이터로 차트 업데이트
        if (tabType === 'public' && this.publicData) {
            this.createChart(this.publicData, 'public');
        } else if (tabType === 'individual' && this.individualData) {
            this.createChart(this.individualData, 'individual');
        } else {
            this.loadData();
        }
    }

    // 🆕 장기수선충당금 탭 전환
    switchReserveTab(tabType) {
        // 탭 버튼 활성화 상태 변경
        const reserveTabButtons = document.querySelectorAll('.reserve-tab-button');
        reserveTabButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-reserve-tab="${tabType}"]`).classList.add('active');
        
        this.currentReserveTab = tabType;
        
        // 해당 탭 데이터로 차트 업데이트
        if (tabType === 'status' && this.reserveFundStatusData) {
            this.createReserveFundChart(this.reserveFundStatusData, 'status');
        } else if (tabType === 'trend' && this.reserveFundTrendData) {
            this.createReserveFundChart(this.reserveFundTrendData, 'trend');
        } else {
            this.loadReserveFundData();
        }
    }

    async loadData() {
        this.showLoading();
        
        try {
            if (this.currentTab === 'public') {
                await this.loadPublicMgmtFeeTrend();
            } else {
                await this.loadIndividualFeeTrend();
            }
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
            this.hideLoading();
            this.showError();
        }
    }

    async loadPublicMgmtFeeTrend() {
        try {
            const response = await fetch('/api/management/public-mgmt-fee-trend');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('공용관리비 추이 데이터:', data);
            
            this.publicData = data;
            this.hideLoading();
            this.createChart(data, 'public');
            
        } catch (error) {
            console.error('공용관리비 추이 데이터 로딩 실패:', error);
            throw error;
        }
    }

    async loadIndividualFeeTrend() {
        try {
            const response = await fetch('/api/management/individual-fee-trend');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('개별사용료 추이 데이터:', data);
            
            this.individualData = data;
            this.hideLoading();
            this.createChart(data, 'individual');
            
        } catch (error) {
            console.error('개별사용료 추이 데이터 로딩 실패:', error);
            throw error;
        }
    }

    async loadCompositionData() {
        this.showCompositionLoading();
        
        try {
            const response = await fetch('/api/management/composition');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('관리비 구성 비중 데이터:', data);
            
            this.compositionData = data;
            this.hideCompositionLoading();
            this.createCompositionChart(data);
            
        } catch (error) {
            console.error('관리비 구성 비중 데이터 로딩 실패:', error);
            this.hideCompositionLoading();
            this.showCompositionError();
        }
    }

    // 연식별 주요 관리비 항목 지출 비교 데이터 로드
    async loadCostComparisonData() {
        this.showCostComparisonLoading();
        
        try {
            const response = await fetch('/api/management/cost-comparison');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('연식별 관리비 항목 지출 비교 데이터:', data);
            
            this.costComparisonData = data;
            this.hideCostComparisonLoading();
            this.createCostComparisonChart(data);
            
        } catch (error) {
            console.error('연식별 관리비 항목 지출 비교 데이터 로딩 실패:', error);
            this.hideCostComparisonLoading();
            this.showCostComparisonError();
        }
    }

    // 🆕 장기수선충당금 데이터 로드
    async loadReserveFundData() {
        this.showReserveFundLoading();
        
        try {
            if (this.currentReserveTab === 'status') {
                await this.loadReserveFundStatusData();
            } else {
                await this.loadReserveFundTrendData();
            }
        } catch (error) {
            console.error('장기수선충당금 데이터 로딩 실패:', error);
            this.hideReserveFundLoading();
            this.showReserveFundError();
        }
    }

    // 🆕 장충금 현황 데이터 로드
    async loadReserveFundStatusData() {
        try {
            const response = await fetch('/api/management/reserve-fund-status');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('장기수선충당금 현황 데이터:', data);
            
            this.reserveFundStatusData = data;
            this.hideReserveFundLoading();
            this.createReserveFundChart(data, 'status');
            
        } catch (error) {
            console.error('장기수선충당금 현황 데이터 로딩 실패:', error);
            throw error;
        }
    }

    // 🆕 장충금 추이 데이터 로드
    async loadReserveFundTrendData() {
        try {
            const response = await fetch('/api/management/reserve-fund-trend');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('장기수선충당금 추이 데이터:', data);
            
            this.reserveFundTrendData = data;
            this.hideReserveFundLoading();
            this.createReserveFundChart(data, 'trend');
            
        } catch (error) {
            console.error('장기수선충당금 추이 데이터 로딩 실패:', error);
            throw error;
        }
    }

    createChart(data, type) {
        const ctx = document.getElementById('managementTrendChart').getContext('2d');
        
        // 데이터 전처리
        const processedData = this.processChartData(data, type);
        
        // 기존 차트가 있으면 제거
        if (this.chart) {
            this.chart.destroy();
        }

        const chartTitle = type === 'public' 
            ? '2024년 노후도 그룹별 세대당 평균 공용관리비 추이'
            : '2024년 노후도 그룹별 세대당 평균 개별사용료 추이';

        const yAxisTitle = type === 'public'
            ? '세대당 평균 공용관리비 (원)'
            : '세대당 평균 개별사용료 (원)';

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1월', '2월', '3월', '4월', '5월', '6월', 
                        '7월', '8월', '9월', '10월', '11월', '12월'],
                datasets: processedData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
				layout: {
                   padding: { 
                       left: 10,
                       right: 10, 
                       top: 10,
                       bottom: 10
                   }
               },
                interaction: {
                    intersect: true,
                    mode: 'nearest'
                },
                animation: false,
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle,
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        display: false // HTML로 커스텀 범례 사용
                    },
                    tooltip: {
                        animation: false, 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#374151',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                const value = context.parsed.y;
                                return `${context.dataset.label}: ${value.toLocaleString()}원`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '월',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: '#f1f5f9'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: yAxisTitle,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + '원';
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.2
                    },
                    point: {
                        radius: 5,
                        hoverRadius: 8,
                        borderWidth: 2,
                        hoverBorderWidth: 3
                    }
                }
            }
        });
    }

    processChartData(rawData, type) {
        // 그룹별로 데이터 분류
        const groupedData = {
            '신축': new Array(12).fill(null),
            '중견': new Array(12).fill(null),
            '노후': new Array(12).fill(null)
        };

        // 데이터를 월별로 정리
        rawData.forEach(item => {
            let monthIndex;
            let value;
            
            if (type === 'public') {
                monthIndex = item.monthNum - 1; // 1-based to 0-based
                value = item.avgPublicMgmtFeePerUnit;
            } else {
                monthIndex = parseInt(item.monthOnly) - 1; // 0-based index
                value = item.avgIndividualFeePerUnit;
            }
            
            if (groupedData[item.ageGroup]) {
                groupedData[item.ageGroup][monthIndex] = value;
            }
        });

        // 차트 데이터셋 생성
        const datasets = [
            {
                label: '신축',
                data: groupedData['신축'],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: false,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#2563eb',
                pointHoverBorderColor: '#ffffff'
            },
            {
                label: '중견',
                data: groupedData['중견'],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: false,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#059669',
                pointHoverBorderColor: '#ffffff'
            },
            {
                label: '노후',
                data: groupedData['노후'],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                fill: false,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#d97706',
                pointHoverBorderColor: '#ffffff'
            }
        ];

        return { datasets };
    }

    createCompositionChart(data) {
        const ctx = document.getElementById('compositionChart').getContext('2d');
        
        // 데이터 전처리 - 각 그룹별 상위 3개 항목 추출
        const processedData = this.processCompositionData(data);
        
        // 기존 차트가 있으면 제거
        if (this.compositionChart) {
            this.compositionChart.destroy();
        }

        this.compositionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['노후', '중견', '신축'],
                datasets: processedData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
				layout: {
                   padding: { 
					   left: 20,
                       right: 20, 
                       top: 50,
                       bottom: 10
                   }
               },
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: '노후도 그룹',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: '비중 (%)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '노후도 그룹별 공용관리비 주요 4개 항목 비중',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        animation: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#374151',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        cornerRadius: 8,
						displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: true,
                    mode: 'nearest'
                }
            }
        });
    }

    // 연식별 주요 관리비 항목 지출 비교 차트 생성
    createCostComparisonChart(data) {
        const ctx = document.getElementById('costComparisonChart').getContext('2d');
        
        // 기존 차트가 있으면 제거
        if (this.costComparisonChart) {
            this.costComparisonChart.destroy();
        }

        // 데이터 전처리
        const processedData = this.processCostComparisonData(data);

        this.costComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['노후', '중견', '신축'],
                datasets: processedData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
				layout: {
                   padding: { 
					left: 10,
                    right: 10, 
                    top: 50,
                    bottom: 10
                   }
               },
                interaction: {
                    intersect: true,
                    mode: 'nearest'
                },
                animation: false,
                plugins: {
                    title: {
                        display: true,
                        text: '연식별 주요 관리비 항목 지출 비교 (2015-2024년 10년 평균)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        animation: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#374151',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        cornerRadius: 8,
						displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return `${context[0].label} 아파트`;
                            },
                            label: function(context) {
                                const value = context.parsed.y;
                                return `${context.dataset.label}: ${value.toLocaleString()}원`;
                            },
                            afterBody: function(context) {
                                // 해당 그룹의 분석 대상 아파트 수 표시
                                const groupData = data.find(item => item.ageGroup === context[0].label);
                                if (groupData) {
                                    return [`분석 대상: ${groupData.apartmentCount}개 아파트`];
                                }
                                return [];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '노후도 그룹',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: '#f1f5f9'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '세대당 연평균 지출액 (원)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + '원';
                            }
                        }
                    }
                },
                elements: {
                    bar: {
                        borderWidth: 2,
                        borderSkipped: false,
                        borderRadius: 4
                    }
                }
            }
        });
    }

    // 🆕 장기수선충당금 차트 생성
    createReserveFundChart(data, type) {
        const ctx = document.getElementById('reserveFundChart').getContext('2d');
        
        // 기존 차트가 있으면 제거
        if (this.reserveFundChart) {
            this.reserveFundChart.destroy();
        }

        if (type === 'status') {
            // 장충금 현황 그룹 막대 차트
            this.createReserveFundStatusChart(ctx, data);
        } else {
            // 장충금 추이 라인 차트
            this.createReserveFundTrendChart(ctx, data);
        }
    }

	// 장충금 현황 그룹 막대 차트 생성 
    createReserveFundStatusChart(ctx, data) {
        const processedData = this.processReserveFundStatusData(data);

        this.reserveFundChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['월부과액', '월사용액'], // 총적립금액 제거
                datasets: processedData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
				layout: {
                   padding: { 
					left: 100,
                    right: 120, 
                    top: 10,
                    bottom: 10
                   }
               },
                interaction: {
                    intersect: true,
                    mode: 'nearest'
                },
                animation: false,
                plugins: {
                    title: {
                        display: true,
                        text: '노후도 그룹별 10년간 연평균 세대수당 장충금 현황 (2015-2024)',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        animation: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#374151',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        cornerRadius: 8,
						displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return `${context[0].label}`;
                            },
                            label: function(context) {
                                const value = context.parsed.y;
                                return `${context.dataset.label}: ${value.toLocaleString()}원`;
                            },
                            afterBody: function(context) {
                                // 해당 그룹의 분석 대상 아파트 수 표시
                                const groupData = data.find(item => item.ageGroup === context[0].dataset.label);
                                if (groupData) {
                                    return [`분석 대상: ${groupData.apartmentCount}개 아파트`];
                                }
                                return [];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '장충금 항목',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: '#f1f5f9'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '세대수당 금액 (원)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: '#f1f5f9'
                        },
                        min: 0,           // 🆕 최솟값을 0으로 설정
                        max: 30000,       // 🆕 최댓값을 30,000원으로 설정
                        ticks: {
                            stepSize: 5000,  // 🆕 5,000원 단위로 눈금 표시
                            callback: function(value) {
                                return value.toLocaleString() + '원';
                            }
                        }
                    }
                },
                elements: {
                    bar: {
                        borderWidth: 2,
                        borderSkipped: false,
                        borderRadius: 4
                    }
                }
            }
        });
    }

    // 🆕 장충금 현황 데이터 전처리
    processReserveFundStatusData(rawData) {
        const datasets = [
            {
                label: '신축',
                data: [],
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
                borderWidth: 2
            },
            {
                label: '중견',
                data: [],
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                borderWidth: 2
            },
            {
                label: '노후',
                data: [],
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                borderWidth: 2
            }
        ];

        // 각 그룹별 데이터 설정
        rawData.forEach(item => {
            const dataIndex = item.ageGroup === '신축' ? 0 : item.ageGroup === '중견' ? 1 : 2;
            datasets[dataIndex].data = [
                item.avgChargePerUnit,    // 월부과액
                item.avgUsagePerUnit      // 월사용액
            ];
        });

        return { datasets };
    }

    // 🆕 장충금 현황 데이터 전처리
    processReserveFundStatusData(rawData) {
        const datasets = [
            {
                label: '신축',
                data: [],
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
                borderWidth: 2
            },
            {
                label: '중견',
                data: [],
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                borderWidth: 2
            },
            {
                label: '노후',
                data: [],
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                borderWidth: 2
            }
        ];

        // 각 그룹별 데이터 설정
        rawData.forEach(item => {
            const dataIndex = item.ageGroup === '신축' ? 0 : item.ageGroup === '중견' ? 1 : 2;
            datasets[dataIndex].data = [
                item.avgChargePerUnit,    // 월부과액
                item.avgUsagePerUnit      // 월사용액
            ];
        });

        return { datasets };
    }

    // 🆕 장충금 추이 라인 차트 생성
    createReserveFundTrendChart(ctx, data) {
        const processedData = this.processReserveFundTrendData(data);

        this.reserveFundChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
                datasets: processedData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: true,
                    mode: 'nearest'
                },
                animation: false,
                plugins: {
                    title: {
                        display: true,
                        text: '노후도 그룹별 장충금 총적립금액 10년간 변화 추이',
                        font: {
                            size: 16,
                            weight: 'bold'
                        },
                        padding: 20
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        animation: false,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#374151',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return `${context[0].label}년`;
                            },
                            label: function(context) {
                                const value = context.parsed.y;
                                return `${context.dataset.label}: ${value.toLocaleString()}원`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '연도',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: '#f1f5f9'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '세대수당 연평균 총적립금액 (원)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + '원';
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.2
                    },
                    point: {
                        radius: 5,
                        hoverRadius: 8,
                        borderWidth: 2,
                        hoverBorderWidth: 3
                    }
                }
            }
        });
    }

    // 연식별 관리비 항목 지출 비교 데이터 전처리
    processCostComparisonData(rawData) {
        // 항목별 색상 정의
        const itemColors = {
            '수선비': '#ef4444',        // 빨강 - 수선/유지보수 비용
            '시설유지비': '#f97316',    // 주황 - 수선/유지보수 비용
            '경비비': '#3b82f6',        // 파랑 - 고정 지출
            '인건비': '#10b981',        // 초록 - 고정 지출
            '청소비': '#8b5cf6'         // 보라 - 고정 지출
        };

        // 데이터셋 생성
        const datasets = [
            {
                label: '수선비',
                data: rawData.map(item => item.repairCost),
                backgroundColor: itemColors['수선비'],
                borderColor: itemColors['수선비'],
                borderWidth: 2
            },
            {
                label: '시설유지비',
                data: rawData.map(item => item.facilityCost),
                backgroundColor: itemColors['시설유지비'],
                borderColor: itemColors['시설유지비'],
                borderWidth: 2
            },
            {
                label: '경비비',
                data: rawData.map(item => item.securityCost),
                backgroundColor: itemColors['경비비'],
                borderColor: itemColors['경비비'],
                borderWidth: 2
            },
            {
                label: '인건비',
                data: rawData.map(item => item.laborCost),
                backgroundColor: itemColors['인건비'],
                borderColor: itemColors['인건비'],
                borderWidth: 2
            },
            {
                label: '청소비',
                data: rawData.map(item => item.cleanCost),
                backgroundColor: itemColors['청소비'],
                borderColor: itemColors['청소비'],
                borderWidth: 2
            }
        ];

        return { datasets };
    }

    // 🆕 장충금 현황 데이터 전처리
    processReserveFundStatusData(rawData) {
        const datasets = [
            {
                label: '신축',
                data: [],
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
                borderWidth: 2
            },
            {
                label: '중견',
                data: [],
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                borderWidth: 2
            },
            {
                label: '노후',
                data: [],
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                borderWidth: 2
            }
        ];

        // 각 그룹별 데이터 설정
        rawData.forEach(item => {
            const dataIndex = item.ageGroup === '신축' ? 0 : item.ageGroup === '중견' ? 1 : 2;
            datasets[dataIndex].data = [
                item.avgChargePerUnit,    // 월부과액
                item.avgUsagePerUnit,     // 월사용액
                item.avgTotalPerUnit      // 총적립금액
            ];
        });

        return { datasets };
    }

    // 🆕 장충금 추이 데이터 전처리
    processReserveFundTrendData(rawData) {
        // 그룹별로 데이터 분류
        const groupedData = {
            '신축': new Array(10).fill(null),    // 2015~2024 (10년)
            '중견': new Array(10).fill(null),
            '노후': new Array(10).fill(null)
        };

        // 데이터를 연도별로 정리
        rawData.forEach(item => {
            const yearIndex = item.year - 2015; // 2015년을 0번 인덱스로
            if (groupedData[item.ageGroup] && yearIndex >= 0 && yearIndex < 10) {
                groupedData[item.ageGroup][yearIndex] = item.avgTotalPerUnit;
            }
        });

        // 차트 데이터셋 생성
        const datasets = [
            {
                label: '신축',
                data: groupedData['신축'],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: false,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#2563eb',
                pointHoverBorderColor: '#ffffff'
            },
            {
                label: '중견',
                data: groupedData['중견'],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: false,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#059669',
                pointHoverBorderColor: '#ffffff'
            },
            {
                label: '노후',
                data: groupedData['노후'],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderWidth: 3,
                fill: false,
                pointBackgroundColor: '#f59e0b',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#d97706',
                pointHoverBorderColor: '#ffffff'
            }
        ];

        return { datasets };
    }

    processCompositionData(rawData) {
        // 항목 이름 매핑
        const itemNames = {
            laborCostPct: '인건비',
            officeCostPct: '제사무비',
            taxCostPct: '제세공과금',
            etcCostPct: '그밖의부대비용',
            cleanCostPct: '청소비',
            securityCostPct: '경비비',
            disinfectCostPct: '소독비',
            elevatorCostPct: '승강기유지비',
            repairCostPct: '수선비',
            facilityCostPct: '시설유지비',
            residentOpFeePct: '입대의운영비',
            buildingInsPct: '건물보험료'
        };

        // 각 그룹별 상위 3개 항목 찾기
        const groupTop3 = {};

        rawData.forEach(group => {
            const items = [];
            Object.keys(itemNames).forEach(key => {
                if (group[key] > 0) {
                    items.push({
                        name: itemNames[key],
                        key: key,
                        value: group[key]
                    });
                }
            });
            
            // 비중 순으로 정렬하여 상위 4개만 선택
            items.sort((a, b) => b.value - a.value);
            groupTop3[group.ageGroup] = items.slice(0, 4);
        });

        console.log('각 그룹별 상위 4개 항목:', groupTop3);

        // 모든 그룹의 상위 4개 항목을 합쳐서 데이터셋 생성
        const allTopItems = new Set();
        Object.values(groupTop3).forEach(items => {
            items.forEach(item => allTopItems.add(item.key));
        });

        const colors = [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
            '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
        ];
        
        const datasets = [];
        const topItemsArray = Array.from(allTopItems);
        
        topItemsArray.forEach((itemKey, index) => {
            const itemName = itemNames[itemKey];
            const data = ['노후', '중견', '신축'].map(ageGroup => {
                const groupItems = groupTop3[ageGroup] || [];
                const item = groupItems.find(item => item.key === itemKey);
                // 해당 그룹의 상위 4개에 포함된 경우만 값 표시, 아니면 0
                return item ? item.value : 0;
            });
            
            // 데이터가 0이 아닌 경우에만 데이터셋에 추가
            if (data.some(value => value > 0)) {
                datasets.push({
                    label: itemName,
                    data: data,
                    backgroundColor: colors[index % colors.length],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                });
            }
        });

        return { datasets };
    }

    // 🆕 장기수선충당금 로딩 상태 관리
    showReserveFundLoading() {
        document.getElementById('reserveFundLoadingState').style.display = 'flex';
        document.getElementById('reserveFundErrorState').style.display = 'none';
        const chartContainer = document.querySelector('#reserveFundChart').parentElement;
        if (chartContainer) {
            chartContainer.style.display = 'none';
        }
    }

    hideReserveFundLoading() {
        document.getElementById('reserveFundLoadingState').style.display = 'none';
        const chartContainer = document.querySelector('#reserveFundChart').parentElement;
        if (chartContainer) {
            chartContainer.style.display = 'block';
        }
    }

    showReserveFundError() {
        document.getElementById('reserveFundLoadingState').style.display = 'none';
        document.getElementById('reserveFundErrorState').style.display = 'flex';
        const chartContainer = document.querySelector('#reserveFundChart').parentElement;
        if (chartContainer) {
            chartContainer.style.display = 'none';
        }
    }

    // 연식별 관리비 항목 지출 비교 로딩 상태 관리
    showCostComparisonLoading() {
        document.getElementById('costComparisonLoadingState').style.display = 'flex';
        document.getElementById('costComparisonErrorState').style.display = 'none';
        const chartContainer = document.querySelector('#costComparisonChart').parentElement;
        if (chartContainer) {
            chartContainer.style.display = 'none';
        }
    }

    hideCostComparisonLoading() {
        document.getElementById('costComparisonLoadingState').style.display = 'none';
        const chartContainer = document.querySelector('#costComparisonChart').parentElement;
        if (chartContainer) {
            chartContainer.style.display = 'block';
        }
    }

    showCostComparisonError() {
        document.getElementById('costComparisonLoadingState').style.display = 'none';
        document.getElementById('costComparisonErrorState').style.display = 'flex';
        const chartContainer = document.querySelector('#costComparisonChart').parentElement;
        if (chartContainer) {
            chartContainer.style.display = 'none';
        }
    }

    showCompositionLoading() {
        document.getElementById('compositionLoadingState').style.display = 'flex';
        document.getElementById('compositionErrorState').style.display = 'none';
        const chartContainer = document.querySelector('#compositionChart').parentElement;
        if (chartContainer) {
            chartContainer.style.display = 'none';
        }
    }

    hideCompositionLoading() {
        document.getElementById('compositionLoadingState').style.display = 'none';
        const chartContainer = document.querySelector('#compositionChart').parentElement;
        if (chartContainer) {
            chartContainer.style.display = 'block';
        }
    }

    showCompositionError() {
        document.getElementById('compositionLoadingState').style.display = 'none';
        document.getElementById('compositionErrorState').style.display = 'flex';
        const chartContainer = document.querySelector('#compositionChart').parentElement;
        if (chartContainer) {
            chartContainer.style.display = 'none';
        }
    }

    showLoading() {
        document.getElementById('loadingState').style.display = 'flex';
        document.getElementById('errorState').style.display = 'none';
        const chartContainer = document.querySelector('.chart-wrapper');
        if (chartContainer) {
            chartContainer.style.display = 'none';
        }
    }

    hideLoading() {
        document.getElementById('loadingState').style.display = 'none';
        const chartContainer = document.querySelector('.chart-wrapper');
        if (chartContainer) {
            chartContainer.style.display = 'block';
        }
    }

    showError() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('errorState').style.display = 'flex';
        const chartContainer = document.querySelector('.chart-wrapper');
        if (chartContainer) {
            chartContainer.style.display = 'none';
        }
    }

    handleResize() {
        if (this.chart) {
            this.chart.resize();
        }
        if (this.compositionChart) {
            this.compositionChart.resize();
        }
        if (this.costComparisonChart) {
            this.costComparisonChart.resize();
        }
        if (this.reserveFundChart) { // 🆕 장충금 차트 리사이즈
            this.reserveFundChart.resize();
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
	const storedCode = localStorage.getItem('selectedApartmentCode');
	   const storedName = localStorage.getItem('selectedApartmentName');

	   if (storedCode && storedName) {
	       const select = document.getElementById('apartmentSelect');
	       const input = document.getElementById('apartmentCode');

	       if (select) {
	           // select가 비어있을 수 있으므로 AJAX 로딩 이후 실행
	           const observer = new MutationObserver(() => {
	               const option = [...select.options].find(opt => opt.value === storedCode);
	               if (option) {
	                   select.value = storedCode;
	               }
	           });
	           observer.observe(select, { childList: true });
	       }

	       if (input) {
	           input.value = storedCode;
	       }

	       // 검색 버튼 자동 클릭
	       const searchBtn = document.getElementById('searchBtn');
	       if (searchBtn) {
	           setTimeout(() => searchBtn.click(), 500); // 약간 딜레이를 주는 것이 좋음
	       }
	   }
    const managementAnalysis = new ManagementAnalysis();
    
    // 다시 시도 버튼 이벤트
    document.getElementById('retryBtn').addEventListener('click', function() {
        managementAnalysis.loadData();
    });
    
    // 구성 비중 차트 다시 시도 버튼 이벤트
    document.getElementById('compositionRetryBtn').addEventListener('click', function() {
        managementAnalysis.loadCompositionData();
    });
    
    // 연식별 관리비 항목 지출 비교 차트 다시 시도 버튼 이벤트
    document.getElementById('costComparisonRetryBtn').addEventListener('click', function() {
        managementAnalysis.loadCostComparisonData();
    });
    
    // 장기수선충당금 차트 다시 시도 버튼 이벤트
    document.getElementById('reserveFundRetryBtn').addEventListener('click', function() {
        managementAnalysis.loadReserveFundData();
    });
    
    // 윈도우 리사이즈 이벤트
    window.addEventListener('resize', function() {
        managementAnalysis.handleResize();
    });
    
    // 페이지 언로드 시 차트 정리
    window.addEventListener('beforeunload', function() {
        if (managementAnalysis.chart) {
            managementAnalysis.chart.destroy();
        }
        if (managementAnalysis.compositionChart) {
            managementAnalysis.compositionChart.destroy();
        }
        if (managementAnalysis.costComparisonChart) {
            managementAnalysis.costComparisonChart.destroy();
        }
        if (managementAnalysis.reserveFundChart) { // 🆕 장충금 차트 정리
            managementAnalysis.reserveFundChart.destroy();
        }
    });
	

});

$('.quick-menu-section h4 .toggle-arrow').on('click', function () {
    var $h4 = $(this).closest('h4');
    var $submenu = $h4.parent().next('.quick-menu-submenu');

    $h4.toggleClass('open');
    $submenu.slideToggle(300);
});