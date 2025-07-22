﻿﻿$(document).ready(function() {
    // 카카오 지도 초기화 함수
    function initKakaoMap() {
        var mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        var mapOption = {
            center: new kakao.maps.LatLng(36.3515633, 127.3849505),
            level: 3
        };

        var map = new kakao.maps.Map(mapContainer, mapOption);

        var markerPosition = new kakao.maps.LatLng(36.3515633, 127.3849505);
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map);
    }

    // 에너지 게이지 차트 생성 함수 (Plotly.js 사용)
// 에너지 게이지 차트 생성 함수 (Plotly.js 사용) - 수정 완료된 버전
window.createEnergyGauge = function(value) {
    // 값이 없으면 '정보 없음' 위치인 420으로 기본값 설정
    
	/***
	 * if (value === null || typeof value === 'undefined') {
        value = 420;
    }
	***/
	value = 120;
    const MAX_KWH = 420;
    const MIN_KWH = 0;
    const radius = .4;

    // 화살표 각도 계산 (정규화된 값 사용)
    const degrees = 180 * (1 - (Math.min(Math.max(value, MIN_KWH), MAX_KWH) - MIN_KWH) / (MAX_KWH - MIN_KWH));
    const radians = degrees * Math.PI / 180;
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);

    // 화살표 경로 생성
    const mainPath = 'M -.0 -0.025 L .0 0.025 L ';
    const pathEnd = ' Z';
    const path = mainPath.concat(String(x), ' ', String(y), pathEnd);

    const data = [{
        type: 'scatter',
        x: [0],
        y: [0],
        marker: {
            size: 28,
            color: '#850000' // ✅ 수정: '#' 추가
        },
        showlegend: false,
        name: 'kWh/㎡·년',
        text: value,
        hoverinfo: 'text+name'
    }, {
        values: [42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 420], // 10개 섹션 + 투명 영역
        rotation: 90,
        text: ['7', '6', '5', '4', '3', '2', '1', '1+', '1++', '1+++', ''],
        textinfo: 'text',
        textposition: 'inside',
        textfont: {
            size: 12,
            color: 'black'
        },
        marker: {
            colors: [
                'rgba(255, 0, 0, 0.7)', 'rgba(255, 69, 0, 0.6)', 'rgba(255, 140, 0, 0.6)',
                'rgba(255, 165, 0, 0.6)', 'rgba(255, 215, 0, 0.6)', 'rgba(173, 255, 47, 0.6)',
                'rgba(124, 252, 0, 0.6)', 'rgba(0, 128, 0, 0.6)', 'rgba(0, 100, 0, 0.6)',
                'rgba(0, 50, 0, 0.7)', 'rgba(255, 255, 255, 0)'
            ]
        },
        labels: ['370-419', '320-369', '270-319', '230-269', '190-229', '150-189', '120-149', '90-120', '60-89', '0-59', ''],
        hoverinfo: 'label',
        hole: 0.4,
        type: 'pie',
        showlegend: false
    }];

    const layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '#850000', // ✅ 수정: '#' 추가
            line: {
                color: '#850000' // ✅ 수정: '#' 추가
            }
        }],
        title: '',
        height: 400,
        width: 480,
        xaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
        yaxis: { zeroline: false, showticklabels: false, showgrid: false, range: [-1, 1] },
        margin: { t: 30, b: 30, l: 30, r: 30 }
    };

    Plotly.newPlot('myDiv', data, layout, { responsive: true, displayModeBar: false });
};


    // 건물 정보 팝업 열기 버튼 클릭 이벤트
    $('#openBuildingInfoBtn').on('click', function() {
        $('#buildingInfoPopup').fadeIn();
        $('body').css('overflow', 'hidden'); // 본문 스크롤 막기
        createEnergyGauge(250); // 에너지 게이지 차트 생성
        renderManagementCharts(); // 차트 렌더링 함수 호출

        $('.icons-menu .icon-item').removeClass('active');
        $('.icons-menu .icon-item[data-target="section-management-fee"]').addClass('active');
        $('.popup-scroll-content').scrollTop(0); // 팝업 내용 최상단으로 스크롤
    });

    // 건물 정보 팝업 닫기 버튼 클릭 이벤트
    $('#buildingInfoPopup .popup-close-btn').on('click', function() {
        $('#buildingInfoPopup').fadeOut();
        $('body').css('overflow', ''); // 본문 스크롤 허용
    });

    const iconItems = document.querySelectorAll('.icons-menu .icon-item');
    const popupScrollContent = document.querySelector('.popup-scroll-content');
    const iconsMenu = document.querySelector('.icons-menu');

    // 건물 정보 팝업 열기 버튼 재클릭 시 초기화 (스크롤 및 아이콘 활성화)
    $('#openBuildingInfoBtn').on('click', function() {
        if (popupScrollContent) {
            popupScrollContent.scrollTop = 0; // 팝업 내용 스크롤 최상단으로
        }
        iconItems.forEach(i => i.classList.remove('active')); // 모든 아이콘 비활성화
        if (iconItems.length > 0) {
            iconItems[0].classList.add('active'); // 첫 번째 아이콘 활성화
        }
    });

    // 특정 섹션으로 스크롤 이동 함수
    function scrollToSection(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement && popupScrollContent && iconsMenu) {
            const menuHeight = iconsMenu.offsetHeight;
            const targetOffset = targetElement.offsetTop;

            const additionalOffset = 100; // 에너지 등급 클릭 시, 보여지는 위치 조정을 위한 추가 오프셋
            const scrollToPosition = targetOffset - menuHeight - additionalOffset;

            $(popupScrollContent).animate({
                scrollTop: scrollToPosition < 0 ? 0 : scrollToPosition // 계산된 위치로 스크롤 애니메이션
            }, 400, function() {
                iconItems.forEach(i => i.classList.remove('active')); // 모든 아이콘 비활성화
                const clickedIcon = document.querySelector(`.icons-menu .icon-item[data-target="${targetId}"]`);
                if (clickedIcon) {
                    clickedIcon.classList.add('active'); // 클릭된 아이콘 활성화
                }
            });
        }
    }

    // 아이콘 메뉴 항목 클릭 이벤트 (섹션 스크롤 및 활성화)
    iconItems.forEach(item => {
        item.addEventListener('click', function() {
            iconItems.forEach(i => i.classList.remove('active')); // 모든 아이콘 비활성화
            this.classList.add('active'); // 클릭된 아이콘 활성화
            scrollToSection(this.dataset.target); // 해당 data-target 섹션으로 스크롤
        });
    });

    // 찜 아이콘 토글 기능 관련 변수 및 함수
    const toggleWishIcon = $('#toggle-wish-icon');
    const wishNotification = $('#wish-notification');
    let isWished = false;

    // 변수 선언부 직후에 찜 상태 초기화 함수 추가
    var cmpxCd = $('#map').data('cmpxcd');  // data-cmpxcd 속성에서 꺼내오기
    var userId = window.loggedInUserId;  // 로그인 정보 JS 변수로 있다고 가정

    // 찜 상태 초기화 함수
    function initWishStatus() {
        $.ajax({
            url: '/bookmark/check',
            method: 'GET',
            data: { cmpxCd: cmpxCd, userId: userId },
            success: function(response) {
                isWished = response.isWished; // 서버에서 Boolean 값 받음
                updateWishIcon();
            },
            error: function() {
                console.error('찜 상태 조회 실패');
                // 필요 시 실패 처리 추가
            }
        });
    }

    // 페이지 로드 시 찜 상태 초기화 함수 호출
    initWishStatus();

    // 찜 아이콘 상태 업데이트 함수
    function updateWishIcon() {
        if (isWished) {
            toggleWishIcon.addClass('active'); // 찜 상태일 때 active 클래스 추가
        } else {
            toggleWishIcon.removeClass('active'); // 찜 해제 상태일 때 active 클래스 제거
        }
    }

    // 찜 알림 메시지 표시 함수
    function showNotification(message) {
        wishNotification.text(message).fadeIn(300); // 메시지 표시
        setTimeout(function() {
            wishNotification.fadeOut(300); // 2.5초 후 메시지 숨김
        }, 2500);
    }
	
	// =========================================
	// 찜 아이콘 토글 기능 (변동 없음)
	// =========================================
	$(document).on('click', '.toggle-wish-icon', function() {
	    const $icon = $(this);
	    const cmpxCd = $icon.data('cmpxcd');

	    if (!cmpxCd) {
	        alert('단지 코드가 없습니다.');
	        return;
	    }

	    $.ajax({
	        url: '/bookmark/toggle',
	        type: 'POST',
	        contentType: 'application/json',
	        data: JSON.stringify({ cmpxCd }),
	        success: function(res) {
	            if(res.success) {
	                if(res.bookmarked) {
	                    $icon.removeClass('far').addClass('fas active');
	                    alert('찜 하셨습니다');
	                } else {
	                    $icon.removeClass('fas active').addClass('far');
	                }
	            } else {
	                alert('찜 처리에 실패했습니다.');
	            }
	        },
	        error: function(err) {
	            console.error('찜 실패', err);
	            alert('로그인 해라(테스트용).');
	        }
	    });
	});



    updateWishIcon(); // 페이지 로드 시 찜 아이콘 초기 상태 설정

    // 유사 건물 목록 슬라이드 기능
    const sliderList = $('.similar-building-list');
    const cards = sliderList.find('.image-container');
    const cardWidth = cards.outerWidth(true); // 카드 너비 + 마진 포함
    const containerWidth = sliderList.width();

    let currentIndex = 0; // 현재 화면에 보이는 첫 번째 카드의 인덱스

    // 다음 슬라이드 버튼 클릭 이벤트
    $('.next-slide').on('click', function() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            
            // 다음 카드의 가운데로 스크롤
            const targetScrollLeft = cards.eq(currentIndex).position().left + sliderList.scrollLeft() - (containerWidth / 2) + (cardWidth / 2);
            
            sliderList.animate({
                scrollLeft: targetScrollLeft
            }, 400);
        }
    });

    // 이전 슬라이드 버튼 클릭 이벤트
    $('.prev-slide').on('click', function() {
        if (currentIndex > 0) {
            currentIndex--;

            // 이전 카드의 가운데로 스크롤
            const targetScrollLeft = cards.eq(currentIndex).position().left + sliderList.scrollLeft() - (containerWidth / 2) + (cardWidth / 2);
            
            sliderList.animate({
                scrollLeft: targetScrollLeft
            }, 400);
        }
    });

    // --- ECharts 차트들 ---
    let myAreaChartEChartsInstance = null;
    let myBarChartEChartsInstance = null;

	window.renderManagementCharts = function() {
	    // 기존 차트 인스턴스 파기
	    if (myAreaChartEChartsInstance) {
	        myAreaChartEChartsInstance.dispose();
	    }
	    if (myBarChartEChartsInstance) {
	        myBarChartEChartsInstance.dispose();
	        }

	    // 관리비 항목별 구성비 (파이차트)
	    const chartDomArea = document.getElementById('myAreaChart');
	    if (chartDomArea) {
	        myAreaChartEChartsInstance = echarts.init(chartDomArea);
	        const pieOption = {
	            title: {
	                text: '관리비 항목별 구성비',
	                left: 'center',
	                textStyle: { fontSize: 18 }
	            },
	            tooltip: {
	                trigger: 'item',
	                formatter: function (params) {
	                    const formatted = params.value.toLocaleString();
	                    return `${params.name}: ${formatted}원 (${params.percent}%)`;
	                }
	            },
	            legend: {
	                orient: 'vertical',
	                left: 'left',
	                top: 'top',
	                textStyle: {
	                    fontSize: 12
	                },
	                data: ['수선유지비', '청소비', '경비비', '소독비', '승강기 유지비', '일반관리비']
	            },
	            series: [{
	                name: '관리비',
	                type: 'pie',
	                radius: '60%',
	                data: [
	                    { value: managementFees.total, name: '일반관리비' },
	                    { value: managementFees.cleaning, name: '청소비' },
	                    { value: managementFees.security, name: '경비비' },
	                    { value: managementFees.disinfection, name: '소독비' },
	                    { value: managementFees.elevator, name: '승강기 유지비' },
	                    { value: managementFees.repair, name: '수선유지비' }
	                ],
	                label: {
	                    show: false
	                },
	                itemStyle: {
	                    color: function (params) {
	                        const pastelColors = [
	                            '#FF9AA2',
	                            '#D9F2B4',
	                            '#FFF9B1',
	                            '#FFE0B2',
	                            '#FFBC80',
	                            '#A8D5BA'
	                        ];
	                        return pastelColors[params.dataIndex];
	                    }
	                }
	            }]
	        };
	        myAreaChartEChartsInstance.setOption(pieOption);
	        myAreaChartEChartsInstance.resize();

	        $(window).on('resize', function () {
	            if (myAreaChartEChartsInstance) {
	                myAreaChartEChartsInstance.resize();
	            }
	        });
	    }

	    // 에너지 사용량 및 요금 (바 차트)
	    const chartDomBar = document.getElementById('myBarChart');
	    if (chartDomBar) {
	        myBarChartEChartsInstance = echarts.init(chartDomBar);
	        const barOption = {
	            title: {
	                text: '에너지 사용량 및 요금',
	                left: 'center',
	                textStyle: { fontSize: 18 }
	            },
	            xAxis: {
	                type: 'category',
	                data: ['전기료', '수도료', '난방비', '가스비'],
	                axisLabel: { interval: 0, rotate: 0 }
	            },
	            yAxis: {
	                type: 'value',
	                axisLabel: {
	                    formatter: function (value) {
	                        return value.toLocaleString() + '원';
	                    }
	                }
	            },
	            tooltip: {
	                trigger: 'axis',
	                formatter: function (params) {
	                    let result = params[0].name + '<br/>';
	                    params.forEach(function (item) {
	                        result += item.marker + item.seriesName + ': ' + item.value.toLocaleString() + '원<br/>';
	                    });
	                    return result;
	                }
	            },
	            grid: {
	                left: '3%',
	                right: '4%',
	                bottom: '3%',
	                containLabel: true
	            },
	            series: [{
	                name: '우리 단지',
	                data: [
	                    energyCosts.elec,
	                    energyCosts.water,
	                    energyCosts.heating,
	                    energyCosts.gas
	                ],
	                type: 'bar',
	                itemStyle: {
	                    color: function (params) {
	                        const colors = [
	                            'rgba(255, 99, 132, 0.8)',
	                            'rgba(54, 162, 235, 0.8)',
	                            'rgba(255, 206, 86, 0.8)',
	                            'rgba(75, 192, 192, 0.8)'
	                        ];
	                        return colors[params.dataIndex];
	                    }
	                }
	            }]
	        };
	        myBarChartEChartsInstance.setOption(barOption);
	        myBarChartEChartsInstance.resize();
	    }

	    $(window).off('resize').on('resize', function () {
	        if (myAreaChartEChartsInstance) {
	            myAreaChartEChartsInstance.resize();
	        }
	        if (myBarChartEChartsInstance) {
	            myBarChartEChartsInstance.resize();
	        }
	    });
	};
	
	


	
	window.showPopupMap = function(lat, lng) {
	    const container = document.getElementById('popupMap');
	    if (!container) return;

	    container.innerHTML = ''; // 혹시 이전 지도 제거

	    const mapOption = {
	        center: new kakao.maps.LatLng(lat, lng),
	        level: 4
	    };

	    const map = new kakao.maps.Map(container, mapOption);

	    new kakao.maps.Marker({
	        map: map,
	        position: new kakao.maps.LatLng(lat, lng)
	    });

	    setTimeout(() => {
	        kakao.maps.event.trigger(map, 'resize');
	        map.setCenter(new kakao.maps.LatLng(lat, lng));
	    }, 300);
	};
	




    initKakaoMap();
});