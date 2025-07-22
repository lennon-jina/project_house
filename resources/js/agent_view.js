 $(document).ready(function() {
        const chatHistory = $('#chatHistory');
        const chatInput = $('#chatInput');
        const sendButton = $('#sendButton');
        const initialQuickReplies = $('#initialQuickReplies'); // 초기 퀵 답변 버튼 컨테이너
        const mapApartmentResponse = $('#mapApartmentResponse'); // 새로 추가된 지도/아파트 응답 컨테이너

        // 카카오 맵 초기화 변수 (초기화는 응답 시점에 진행)
    let map = null;
    let markers = [];

    // 지도와 마커를 표시하는 함수
    function displayMapAndApartments(apartments) {
        // 지도 컨테이너가 숨겨져 있다면 보여줌
        mapApartmentResponse.removeClass('hidden');

        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new kakao.maps.LatLng(36.3504119, 127.3845475), // 둔산동 중심 좌표 (예시)
            level: 5 // 지도의 확대 레벨
        };

        // 지도 객체가 없다면 새로 생성, 있다면 기존 객체 재활용
        if (map === null) {
            map = new kakao.maps.Map(mapContainer, mapOption);
        } else {
            map.relayout(); // 크기 변경 시 지도 다시 그리기
            map.setCenter(mapOption.center);
            map.setLevel(mapOption.level);
        }


        // 기존 마커 제거
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        const apartmentUL = $('#apartmentUL');
        apartmentUL.empty(); // 기존 목록 비우기

        apartments.forEach((apt, index) => {
            // 아파트 목록 추가
            const listItem = `<li>${index + 1}. ${apt.name}</li>`;
            apartmentUL.append(listItem);

            // 마커 생성 및 지도에 표시
            const markerPosition = new kakao.maps.LatLng(apt.lat, apt.lng);
            const marker = new kakao.maps.Marker({
                position: markerPosition,
                map: map,
                title: apt.name // 마우스 오버 시 표시될 이름
            });
            markers.push(marker);
        });

        // 지도가 보이도록 스크롤 이동
        chatHistory.scrollTop(chatHistory[0].scrollHeight);
    }

        // 메시지를 채팅 기록에 추가하는 함수
    function addMessage(message, sender) {
        const messageClass = sender === 'user' ? 'user' : 'bot';
        const messageBubble = `<div class="message-bubble ${messageClass}">${message}</div>`;
        chatHistory.append(messageBubble);
        chatHistory.scrollTop(chatHistory[0].scrollHeight); // 최신 메시지가 보이도록 스크롤 아래로 내리기
    }

    // 챗봇 응답을 처리하는 함수
    function getBotResponse(userMessage) {
        let botResponse = "";
        let showMap = false;
        const lowerCaseMessage = userMessage.toLowerCase();

        if (lowerCaseMessage.includes("둔산동 아파트") && lowerCaseMessage.includes("공원") && lowerCaseMessage.includes("근처")) {
            botResponse = "둔산동 공원 근처 아파트 정보를 찾아보고 있습니다...";
            // 가상의 아파트 데이터 (실제 데이터는 DB나 API 연동 필요)
            const dunsanParkApartments = [
                { name: "둔산동 크로바 아파트", lat: 36.3571, lng: 127.3879 },
                { name: "둔산동 한화꿈에그린 아파트", lat: 36.3530, lng: 127.3850 },
                { name: "둔산동 국화 아파트", lat: 36.3500, lng: 127.3820 },
                { name: "둔산동 목련 아파트", lat: 36.3480, lng: 127.3890 },
                { name: "둔산동 가람 아파트", lat: 36.3555, lng: 127.3910 }
            ];
            showMap = true; // 지도를 표시하도록 플래그 설정
            setTimeout(() => {
                // 기존 텍스트 응답 대신 지도와 목록을 표시
                // addMessage(botResponse, 'bot'); // 이 줄은 지도와 목록 표시로 대체되므로 필요 없을 수 있음
                displayMapAndApartments(dunsanParkApartments);
            }, 1000); // 챗봇이 생각하는 시간 모방
            return; // 바로 리턴하여 아래의 기본 응답이 실행되지 않도록 함
        } else if (lowerCaseMessage.includes("주변 건물")) {
            botResponse = "주변 건물 정보를 찾고 계시는군요. 어떤 종류의 건물을 찾으시나요? (예: 아파트, 상업시설, 공원 등)";
        } else if (lowerCaseMessage.includes("시세")) {
            botResponse = "어떤 지역의 시세가 궁금하신가요? (예: 둔산동 아파트 시세)";
        } else if (lowerCaseMessage.includes("에너지 효율 등급")) {
            botResponse = "에너지 효율 등급이 궁금한 건물의 정확한 주소를 알려주세요.";
        } else if (lowerCaseMessage.includes("건물 상세 정보")) {
            botResponse = "원하는 건물 주소나 이름을 알려주시면 상세 정보를 찾아드리겠습니다.";
        } else if (lowerCaseMessage.includes("아파트")) {
            botResponse = "어떤 지역의 아파트를 찾으시나요? (예: 둔산동 아파트)";
        } else if (lowerCaseMessage.includes("기타")) {
            botResponse = "다른 궁금한 점이 있으시면 자세히 설명해주세요.";
        } else if (lowerCaseMessage.includes("안녕하세요") || lowerCaseMessage.includes("안녕")) {
            botResponse = "안녕하세요! 무엇을 도와드릴까요?";
        } else if (lowerCaseMessage.includes("고마워") || lowerCaseMessage.includes("감사합니다")) {
            botResponse = "천만에요! 더 궁금한 점 있으시면 언제든지 물어보세요.";
        } else {
            botResponse = "죄송합니다. 이해하지 못했습니다. 다른 질문을 입력해 주시거나 아래 키워드를 선택해주세요.";
        }

        // 일반 텍스트 응답일 경우 지도 컨테이너 숨김
        mapApartmentResponse.addClass('hidden');
        setTimeout(() => addMessage(botResponse, 'bot'), 500);
    }

    // 메시지 전송 이벤트 처리
    sendButton.on('click', function() {
        const userMessage = chatInput.val().trim();
        if (userMessage !== '') {
            addMessage(userMessage, 'user');
            chatInput.val(''); // 입력창 비우기
            getBotResponse(userMessage);
            initialQuickReplies.hide(); // 메시지 전송 후 초기 퀵 답변 숨김
        }
    });

    // 엔터 키 입력 시 메시지 전송
    chatInput.keypress(function(e) {
        if (e.which === 13) { // Enter key pressed
            sendButton.click();
        }
    });

    // 초기 퀵 답변 버튼 클릭 이벤트 처리
    initialQuickReplies.on('click', '.quick-reply-button', function() {
        const keyword = $(this).text();
        addMessage(keyword, 'user');
        getBotResponse(keyword);
        initialQuickReplies.hide(); // 버튼 클릭 후 퀵 답변 숨김
    });
});