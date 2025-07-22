
document.addEventListener("DOMContentLoaded", function () {
  const map = new kakao.maps.Map(document.getElementById('map'), {
    center: new kakao.maps.LatLng(36.3504, 127.3845),
    level: 4
  });

  let geojsonData = null;
  let polygonData = [];
  let markerData = [];
  let isPolygonVisible = false;
  let isMarkerVisible = false;
  let currentRegion = '서구';  // 초기 선택 구
  let polygons = [];      // 그려진 폴리곤 객체들
  let searchMarkers = [];


  const noiseIcon = new kakao.maps.MarkerImage(
    '/img/noise.png', new kakao.maps.Size(52, 52)
  );
  
  // 노후도 폴리곤 색상 기준 함수
  function getColorByYear(year) {
      if (!year || year === 0) return '#FFFFFF';
      const currentYear = new Date().getFullYear();
      const age = currentYear - year;

      if (age <= 5) return '#3498db';     // 매우 양호 (0~5년)
      if (age <= 10) return '#2ecc71';    // 양호 (6~10년)
      if (age <= 20) return '#f1c40f';    // 보통 (11~20년)
      if (age <= 30) return '#e67e22';    // 노후 (21~30년)
      return '#e74c3c';                   // 매우 노후 (31년 이상)
  }
	

	window.togglePolygons = function () {
		if (isPolygonVisible) {
		    // 폴리곤이 보이는 상태 → 숨기기
		    polygonData.forEach(polygon => polygon.setMap(null));
		    polygonData = [];
		    isPolygonVisible = false;
		    return;
		}
		const center = map.getCenter();  // Kakao Map 객체에서 중심 좌표 가져옴
		const lat = center.getLat();
		const lng = center.getLng();
		const geocoder = new kakao.maps.services.Geocoder();

		const coord = new kakao.maps.LatLng(lat, lng);
		geocoder.coord2RegionCode(coord.getLng(), coord.getLat(), function(result, status) {
		  if (status === kakao.maps.services.Status.OK) {
		    // 일반적으로 행정동명은 result[0].region_3depth_name에 위치
		    const dong = result[0].region_3depth_name;
		    console.log("현재 지도 중심의 동:", dong);
			alert(dong + " 노후도");
			fetch(`/geojson?dong=${encodeURIComponent(dong)}`)
			      .then(res => res.json())
			      .then(data => {
			        geojsonData = data;
			        showPolygons();
		 	});
		  }
		});
	};


	window.showPolygons = function () {
	  if (!geojsonData) return;
	  clearPolygons();

	  geojsonData.features.forEach(f => {
	    const addr = `${f.properties.A4 || ''} ${f.properties.A5 || ''}`.trim();
	    const coords = f.geometry.type === 'Polygon'
	      ? f.geometry.coordinates[0].map(c => new kakao.maps.LatLng(c[1], c[0]))
	      : f.geometry.coordinates[0][0].map(c => new kakao.maps.LatLng(c[1], c[0]));

	    const year = parseInt((f.properties.A13 || '').substring(0, 4)) || 0;
	    const polygon = new kakao.maps.Polygon({
	      path: coords,
	      strokeWeight: 1,
	      strokeColor: '#333',
	      fillColor: getColorByYear(year),
	      fillOpacity: 0.6
	    });
	    polygon.setMap(map);

	    kakao.maps.event.addListener(polygon, 'click', () => {
	      alert(`주소: ${addr}\n준공일자: ${f.properties.A13 || '없음'}`);
	    });

	    polygonData.push(polygon);
	  });
	  isPolygonVisible = true;
	};



  window.toggleHelp = function () {
    const helpOverlay = document.getElementById('helpOverlay');
    if (helpOverlay.style.display === 'none' || helpOverlay.style.display === '') {
      helpOverlay.style.display = 'block';
    } else {
      helpOverlay.style.display = 'none';
    }
  };
  
  window.resetMap = function () {
      clearPolygons();

      // 기존 검색 마커 모두 제거
      searchMarkers.forEach(marker => marker.setMap(null));
      searchMarkers = [];

      document.getElementById('searchInput').value = '';
      map.setLevel(4);
      map.setCenter(new kakao.maps.LatLng(36.3504, 127.3845));
  };
  
  function clearPolygons() {
    polygons.forEach(polygon => {
      polygon.setMap(null);
    });
    polygonData.forEach(polygon => {
      polygon.setMap(null);
    });
    polygons = [];
    polygonData = [];  
  }

  
  function getColorByDb(db) {
    if (db >= 90) return "#d73027";
    if (db >= 85) return "#fc8d59";
    if (db >= 80) return "#fee08b";
    if (db >= 75) return "#d9ef8b";
    if (db >= 70) return "#91cf60";
    return "#1a9850";
  }

  function createNoiseOverlay(data) {
    const level = data.db;
    const color = getColorByDb(level);
    const exceedText = level > 65
      ? "📍“일반주거지역 주간 기준(65dB)”을 초과한 수준입니다.<br> 이 정도의 소음은 일반적인 대화보다 크며,<br>장시간 노출 시 불쾌감을 줄 수 있습니다."
      : "기준치 이내입니다.";

    return `
    <div style="width: 360px; background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); font-family: 'Noto Sans KR'; position: relative;">
      <!-- X 닫기 버튼 -->
      <div onclick="closeOverlay()" style="position: absolute; top: 10px; right: 12px; cursor: pointer; font-size: 18px; font-weight: bold; color: #999;">×</div>

      <div style="font-size: 18px; font-weight: bold;">${data.name}</div>
      <div style="font-size: 14px; color: #444;">${data.addr}</div>

      <div style="margin-top: 10px; display: flex; gap: 8px;">
        <div style="font-size: 13px; background: #eee; padding: 3px 10px; border-radius: 6px;">${data.zone} 구역</div>
  
        <div style="font-size: 13px; background: #444; color: white; padding: 3px 10px; border-radius: 6px;">${data.location}</div>
      </div>

      <div style="margin-top: 14px; font-weight: bold;">현재 소음 단계</div>
      <div style="margin: 6px 0;">
        <span style="display: inline-block; background: ${color}; color: white; padding: 5px 10px; border-radius: 14px;">
          ${data.db} dB
        </span>
      </div>

      <div style="margin: 12px 0;">
        <div style="height: 10px; background: linear-gradient(to right, #1a9850, #91cf60, #d9ef8b, #fee08b, #fc8d59, #d73027); border-radius: 4px;"></div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-top: 4px;">
          <span>70(기준)</span><span>75</span><span>80</span><span>85</span><span>90+</span>
        </div>
      </div>

      <div style="font-size: 13px; color: #333; line-height: 1.5;">
        현재 측정된 소음은 <b>${data.db}dB</b>로,<br>
        ${exceedText}<br>
        
      </div>
    </div>`;
  }


  const overlay = new kakao.maps.CustomOverlay({ map: null });
  window.overlay = overlay; 
  const markerPoints = [
  {
    name: "가수원경로당 앞",
    addr: "대전광역시 서구 가수원동 643",
    x: 127.350801285859,
    y: 36.3026448845129,
    db: 55.2,
    location: "도로",
    zone: "라"
  },
  {
    name: "LG텔레콤",
    addr: "대전광역시 중구 목중로 40",
    x: 127.410141863085,
    y: 36.3371224736382,
    db: 63.19,
    location: "도로",
    zone: "나"
  },
  {
    name: "S-OIL 건너편",
    addr: "대전광역시 서구 도산로 446",
    x: 127.398509564013,
    y: 36.3418609275787,
    db: 68.39,
    location: "도로",
    zone: "다"
  },
  {
    name: "CU편의점 앞",
    addr: "대전광역시 중구 대종로593번길 14",
    x: 127.417551845823,
    y: 36.3344856646544,
    db: 59.49,
    location: "도로",
    zone: "가"
  },
  {
    name: "건양대학교 입구 옆",
    addr: "대전광역시 서구 계백로 1059",
    x: 127.340956594358,
    y: 36.303146997072,
    db: 65.57,
    location: "도로",
    zone: "나"
  },
  {
    name: "개나리아파트 106동 뒷편",
    addr: "대전광역시 서구 계룡로509번길 31",
    x: 127.382257756248,
    y: 36.3454124442612,
    db: 57.58,
    location: "일반",
    zone: "가"
  },
  {
    name: "P&C테크앞",
    addr: "대전광역시 대덕구 신일동로67번길 24",
    x: 127.410856790293,
    y: 36.4407085767821,
    db: 64.21,
    location: "도로",
    zone: "나"
  },
  {
    name: "근로복지공단 대전병원 옆",
    addr: "대전광역시 대덕구 법동 286",
    x: 127.428314838619,
    y: 36.3672761545917,
    db: 57.5,
    location: "일반",
    zone: "나"
  },
  {
    name: "건양대학교 주차장 앞",
    addr: "대전광역시 서구 관저동로 158",
    x: 127.34264048636,
    y: 36.3068221303823,
    db: 72.55,
    location: "도로",
    zone: "다"
  },
  {
    name: "관저2동 우체국 앞",
    addr: "대전광역시 서구 관저로 63",
    x: 127.328747389682,
    y: 36.2991026576442,
    db: 61.07,
    location: "도로",
    zone: "라"
  },
  {
    name: "교촌빌딩 건너편",
    addr: "대전광역시 유성구 진잠로 145",
    x: 127.317465186458,
    y: 36.3036515665546,
    db: 64.34,
    location: "도로",
    zone: "가"
  },
  {
    name: "귀뚜라미보일러 앞",
    addr: "대전광역시 서구 배재로233번길 11",
    x: 127.369921373802,
    y: 36.3292309340394,
    db: 60.31,
    location: "도로",
    zone: "가"
  },
  {
    name: "구암어린이공원",
    addr: "대전광역시 유성구 계룡로74번길 79-15",
    x: 127.338865321411,
    y: 36.3511434643144,
    db: 58.89,
    location: "일반",
    zone: "나"
  },
  {
    name: "국토정보공사 대전동부지사 정문 우측",
    addr: "대전광역시 중구 대흥로10번길 41",
    x: 127.417050322533,
    y: 36.3199658965274,
    db: 55.77,
    location: "도로",
    zone: "다"
  },
  {
    name: "나날요양원 앞",
    addr: "대전광역시 동구 태전로 5",
    x: 127.430785088283,
    y: 36.3312014805297,
    db: 59.87,
    location: "일반",
    zone: "라"
  },
  {
    name: "김밥나라 문화2호점",
    addr: "대전광역시 중구 천근로69번길 114",
    x: 127.405181357167,
    y: 36.3131829077184,
    db: 58.76,
    location: "도로",
    zone: "다"
  },
  {
    name: "대림아파트 1동 앞",
    addr: "대전광역시 서구 용화6길 21",
    x: 127.374824837963,
    y: 36.320409990841,
    db: 52.48,
    location: "일반",
    zone: "라"
  },
  {
    name: "궁전하이츠 옆",
    addr: "대전광역시 서구 변동서로6번길 14",
    x: 127.36985403582,
    y: 36.3303850672059,
    db: 54.62,
    location: "도로",
    zone: "라"
  },
  {
    name: "뉴딜사업 현장지원센터 앞",
    addr: "대전광역시 서구 정림로24번길 24",
    x: 127.36757516528,
    y: 36.3025894376825,
    db: 55.03,
    location: "도로",
    zone: "나"
  },
  {
    name: "농수산도매시장 제2문 우측편",
    addr: "대전광역시 유성구 노은동로 33",
    x: 127.320448810671,
    y: 36.3646432101597,
    db: 61.89,
    location: "도로",
    zone: "가"
  },
  {
    name: "늘푸른약국 건너편",
    addr: "대전광역시 서구 대덕대로242번길 26",
    x: 127.380967481359,
    y: 36.354129777698,
    db: 58.42,
    location: "도로",
    zone: "다"
  },
  {
    name: "대동펜타뷰아파트 정문 건너편",
    addr: "대전광역시 동구 계족로140번길 33",
    x: 127.446451511793,
    y: 36.3264816131916,
    db: 64.91,
    location: "일반",
    zone: "다"
  },
  {
    name: "더 할인마트 앞",
    addr: "대전광역시 동구 판암동 231-1",
    x: 127.460934229694,
    y: 36.3225542307098,
    db: 60.14,
    location: "도로",
    zone: "나"
  },
  {
    name: "대덕테크노밸리5단지 501동옆",
    addr: "대전광역시 유성구 배울2로 42",
    x: 127.387077891016,
    y: 36.419117596929,
    db: 64.7,
    location: "일반",
    zone: "가"
  },
  {
    name: "대대로 감자탕족발 건너편",
    addr: "대전광역시 서구 둔산중로134번길 21",
    x: 127.388135785117,
    y: 36.3590473628458,
    db: 62.96,
    location: "도로",
    zone: "라"
  },
  {
    name: "대일탕 앞",
    addr: "대전광역시 대덕구 대화7길 21",
    x: 127.416065034406,
    y: 36.3650111410866,
    db: 57.16,
    location: "도로",
    zone: "나"
  },
  {
    name: "대전동산고등학교 건너편",
    addr: "대전광역시 중구 문화동 284-54",
    x: 127.404669395311,
    y: 36.3145911361228,
    db: 69.96,
    location: "도로",
    zone: "가"
  },
  {
    name: "대양빌라 103동 맞은편",
    addr: "대전광역시 대덕구 비래동로32번길 36",
    x: 127.452305138185,
    y: 36.3558754738655,
    db: 56.97,
    location: "일반",
    zone: "가"
  },
  {
    name: "대덕폐차사업소 맞은편",
    addr: "대전광역시 대덕구 대화로 80",
    x: 127.411853552382,
    y: 36.368398751123,
    db: 65.61,
    location: "도로",
    zone: "나"
  },
  {
    name: "대전 출입국사무소 앞",
    addr: "대전광역시 중구 목중로26번길 7",
    x: 127.410992135542,
    y: 36.3366550552322,
    db: 60.87,
    location: "도로",
    zone: "라"
  },
  {
    name: "대전 양지초등학교 옆",
    addr: "대전광역시 대덕구 쌍청당로 45",
    x: 127.433249573371,
    y: 36.3657752552034,
    db: 61.45,
    location: "일반",
    zone: "다"
  },
  {
    name: "대창아파트 정문 우측",
    addr: "대전광역시 대덕구 벚꽃길 142",
    x: 127.424411879761,
    y: 36.4248030343645,
    db: 61.5,
    location: "일반",
    zone: "가"
  },
  {
    name: "롯데엑스포2단지 206동 뒷편",
    addr: "대전광역시 유성구 엑스포로 448",
    x: 127.409202641349,
    y: 36.3975506025886,
    db: 61.99,
    location: "일반",
    zone: "라"
  },
  {
    name: "대전청사자연마당 앞",
    addr: "대전광역시 서구 둔산2동 930",
    x: 127.384880534851,
    y: 36.3587592914894,
    db: 68.32,
    location: "일반",
    zone: "라"
  },
  {
    name: "동양빌라3동 앞",
    addr: "대전광역시 중구 산성동 306-2",
    x: 127.388007208051,
    y: 36.303580756701,
    db: 53.37,
    location: "일반",
    zone: "나"
  },
  {
    name: "대전우체국 좌측편",
    addr: "대전광역시 동구 대전로 753",
    x: 127.434644765543,
    y: 36.3270358411621,
    db: 68.26,
    location: "도로",
    zone: "다"
  },
  {
    name: "도마1동 행정복지센터 앞",
    addr: "대전광역시 서구 도마3길 46",
    x: 127.381132043455,
    y: 36.3160241421466,
    db: 55.07,
    location: "도로",
    zone: "라"
  },
  {
    name: "대전서문교회 입구",
    addr: "대전광역시 중구 대둔산로373번길 39",
    x: 127.383946999299,
    y: 36.3030995124858,
    db: 53.6,
    location: "일반",
    zone: "나"
  },
  {
    name: "더클래식 빌딩 앞",
    addr: "대전광역시 유성구 테크노중앙로 130",
    x: 127.397056256658,
    y: 36.4220732372196,
    db: 66.12,
    location: "도로",
    zone: "다"
  },
  {
    name: "두울샤브칼국수 앞",
    addr: "대전광역시 서구 탄방동 문정로90번길 15",
    x: 127.389531151523,
    y: 36.3459775385542,
    db: 58.05,
    location: "도로",
    zone: "다"
  },
  {
    name: "도안린풀하우스18단지 정문 앞",
    addr: "대전광역시 서구 도안동 도안동로 77",
    x: 127.349184951623,
    y: 36.3105945067565,
    db: 61.23,
    location: "일반",
    zone: "가"
  },
  {
    name: "럭키스포츠프라자 앞",
    addr: "대전광역시 대덕구 중리서로 83",
    x: 127.422840888357,
    y: 36.3663511959505,
    db: 64.48,
    location: "도로",
    zone: "다"
  },
  {
    name: "멕시칸 양념치킨 앞",
    addr: "대전 서구 동서대로 1017-2",
    x: 127.375085438375,
    y: 36.3324219477375,
    db: 70.15,
    location: "도로",
    zone: "라"
  },
  {
    name: "디에이치인테리어 앞",
    addr: "대전광역시 대덕구 선비마을로 6",
    x: 127.446309035179,
    y: 36.3619997748366,
    db: 64.96,
    location: "도로",
    zone: "나"
  },
  {
    name: "드림교회 앞",
    addr: "대전광역시 서구 계룡로662번길 21",
    x: 127.394020986024,
    y: 36.3360253352845,
    db: 53.29,
    location: "도로",
    zone: "가"
  },
  {
    name: "백억프라자 좌측",
    addr: "대전광역시 유성구 지족로148번길 39-29",
    x: 127.305680676706,
    y: 36.3782483482867,
    db: 62.94,
    location: "일반",
    zone: "나"
  },
  {
    name: "문충사 앞",
    addr: "대전광역시 동구 용운동 356-2",
    x: 127.459874143774,
    y: 36.3243351599454,
    db: 54.79,
    location: "일반",
    zone: "가"
  },
  {
    name: "맘스터치 앞",
    addr: "대전광역시 동구 가양동 162-3",
    x: 127.451052672129,
    y: 36.347911929975,
    db: 67.3,
    location: "도로",
    zone: "다"
  },
  {
    name: "반도빌라 건너편",
    addr: "대전광역시 중구 목동 10-33",
    x: 127.40951604308,
    y: 36.3360423047411,
    db: 54.57,
    location: "일반",
    zone: "라"
  },
  {
    name: "바우배기어린이공원 앞",
    addr: "대전광역시 대덕구 법동 280-1",
    x: 127.424678007844,
    y: 36.3725894980762,
    db: 65.74,
    location: "일반",
    zone: "다"
  },
  {
    name: "만년고교 뒷편",
    addr: "대전광역시 서구 만년로 6",
    x: 127.372760292861,
    y: 36.3672667020544,
    db: 69.86,
    location: "일반",
    zone: "나"
  },
  {
    name: "두유빈스 앞",
    addr: "대전광역시 유성구 원신흥남로42번길 5-37",
    x: 127.338399447388,
    y: 36.3378647675179,
    db: 66.55,
    location: "도로",
    zone: "라"
  },
  {
    name: "마라본공원 앞",
    addr: "대전광역시 중구 문화로99번길 5",
    x: 127.39619536502,
    y: 36.3126668037523,
    db: 54.93,
    location: "일반",
    zone: "가"
  },
  {
    name: "배재대학교 산학협력단 건너편",
    addr: "대전광역시 유성구 구즉로48번길 46",
    x: 127.387351222086,
    y: 36.4324422760045,
    db: 71.12,
    location: "일반",
    zone: "가"
  },
  {
    name: "볼보대리점 앞",
    addr: "대전광역시 대덕구 한밭대로 1112",
    x: 127.421904708467,
    y: 36.3584359499755,
    db: 72.09,
    location: "도로",
    zone: "나"
  },
  {
    name: "삼호아파트 2동 앞",
    addr: "대전광역시 대덕구 계족로663번길 32",
    x: 127.425515749638,
    y: 36.3728217509616,
    db: 68.65,
    location: "일반",
    zone: "가"
  },
  {
    name: "부일지업사 앞",
    addr: "대전광역시 서구 월평로 31-1",
    x: 127.360783067982,
    y: 36.3563409322972,
    db: 61.85,
    location: "도로",
    zone: "다"
  },
  {
    name: "보성빌딩 앞",
    addr: "대전광역시 중구 용두동 112-1",
    x: 127.406404871095,
    y: 36.3281296595833,
    db: 68.3,
    location: "도로",
    zone: "다"
  },
  {
    name: "복용삼거리 앞",
    addr: "대전광역시 유성구 유성대로 510",
    x: 127.321275618473,
    y: 36.341408172492,
    db: 71.87,
    location: "도로",
    zone: "가"
  },
  {
    name: "삼양패키징 앞",
    addr: "대전광역시 대덕구 대덕대로1417번길 47",
    x: 127.4044298605,
    y: 36.4487174511782,
    db: 60.97,
    location: "도로",
    zone: "다"
  },
  {
    name: "보창한의원 건너편",
    addr: "대전광역시 중구 보문산로 44-1",
    x: 127.385488900598,
    y: 36.3043919531067,
    db: 68.2,
    location: "도로",
    zone: "라"
  },
  {
    name: "삼성아파트 8동 건너편",
    addr: "대전광역시 중구 계룡로 852",
    x: 127.408108325556,
    y: 36.323599498177,
    db: 60.77,
    location: "일반",
    zone: "가"
  },
  {
    name: "문화2동우체국 앞",
    addr: "대전광역시 중구 당디로6번길 98",
    x: 127.399415385812,
    y: 36.3078369653938,
    db: 58.49,
    location: "도로",
    zone: "나"
  },
  {
    name: "새하늘교회 앞",
    addr: "대전광역시 대덕구 오정동 56-3",
    x: 127.41340865555,
    y: 36.3594328266235,
    db: 68.89,
    location: "도로",
    zone: "가"
  },
  {
    name: "삼진정밀 뒤편",
    addr: "대전광역시 대덕구 대화로132번길 22",
    x: 127.406612122389,
    y: 36.3676822379458,
    db: 60.78,
    location: "도로",
    zone: "다"
  },
  {
    name: "샘머리2단지 204동 옆",
    addr: "대전광역시 서구 문예로 174",
    x: 127.392058829862,
    y: 36.3630641988923,
    db: 74.13,
    location: "일반",
    zone: "가"
  },
  {
    name: "샘머리아파트 222동 앞",
    addr: "대전광역시 서구 청사로 281",
    x: 127.390997675009,
    y: 36.361769755787,
    db: 63.76,
    location: "일반",
    zone: "가"
  },
  {
    name: "세븐일레븐 옆",
    addr: "대전광역시 서구 관저남로25번길 8-4",
    x: 127.337672650561,
    y: 36.2951100367568,
    db: 59.78,
    location: "도로",
    zone: "가"
  },
  {
    name: "새소망교회 좌측",
    addr: "대전광역시 유성구 탑립로29번길 21",
    x: 127.398877955477,
    y: 36.4109799356199,
    db: 60.04,
    location: "도로",
    zone: "가"
  },
  {
    name: "성산수도원 입구",
    addr: "대전 유성구 북유성대로316번길 22-32",
    x: 127.315865811358,
    y: 36.3948894468174,
    db: 57.45,
    location: "도로",
    zone: "가"
  },
  {
    name: "새싹어린이집 건너편",
    addr: "대전광역시 서구 용문로 113",
    x: 127.393815537356,
    y: 36.334479797874,
    db: 60.71,
    location: "일반",
    zone: "가"
  },
  {
    name: "성경빌딩 앞",
    addr: "대전광역시 서구 계룡로 365-1",
    x: 127.369470207514,
    y: 36.3530394981061,
    db: 71.19,
    location: "도로",
    zone: "나"
  },
  {
    name: "삼부4단지아파트 410동 뒷편",
    addr: "대전광역시 중구 태평로 55",
    x: 127.391442056788,
    y: 36.3223831728175,
    db: 64.25,
    location: "일반",
    zone: "가"
  },
  {
    name: "성호빌라 뒷편",
    addr: "대전광역시 서구 신갈마로 173-13",
    x: 127.367455482172,
    y: 36.3491297234473,
    db: 55.94,
    location: "일반",
    zone: "가"
  },
  {
    name: "송촌서오아파트 105동 옆",
    addr: "대전광역시 대덕구 동춘당로23번길 37",
    x: 127.445506687067,
    y: 36.3596989384921,
    db: 55.22,
    location: "일반",
    zone: "가"
  },
  {
    name: "스위트빌 앞",
    addr: "대전광역시 동구 홍도로 17",
    x: 127.42960213628,
    y: 36.3478097465424,
    db: 64.3,
    location: "일반",
    zone: "가"
  },
  {
    name: "신일이용원 앞",
    addr: "대전광역시 중구 충무로 112",
    x: 127.429333672168,
    y: 36.3182439613395,
    db: 66.79,
    location: "도로",
    zone: "나"
  },
  {
    name: "엑스포유치원 앞",
    addr: "대전광역시 유성구 엑스포로 448",
    x: 127.409202641349,
    y: 36.3975506025886,
    db: 60.51,
    location: "도로",
    zone: "가"
  },
  {
    name: "센트럴자이 101동 앞",
    addr: "대전광역시 서구 복수서로 15",
    x: 127.371406144697,
    y: 36.3060393211303,
    db: 60.36,
    location: "일반",
    zone: "나"
  },
  {
    name: "어은어린이공원 앞",
    addr: "대전광역시 유성구 어은동 108-12",
    x: 127.355792792971,
    y: 36.3626638569664,
    db: 57.64,
    location: "일반",
    zone: "가"
  },
  {
    name: "어반힐스아파트 501동 앞",
    addr: "대전광역시 서구 관저남로 80",
    x: 127.342043630219,
    y: 36.2942634124273,
    db: 66.06,
    location: "일반",
    zone: "가"
  },
  {
    name: "옥계동 솔빛아파트 101동 앞",
    addr: "대전광역시 중구 옥계동 45-3",
    x: 127.454745641488,
    y: 36.2992901504784,
    db: 52.64,
    location: "일반",
    zone: "가"
  },
  {
    name: "소롱골 어린이공원(구, 애경화장품)",
    addr: "대전광역시 대덕구 계족로608번길 39-14",
    x: 127.432673910851,
    y: 36.3669555940581,
    db: 55.89,
    location: "일반",
    zone: "가"
  },
  {
    name: "아프리카동물메디컬센터 앞",
    addr: "대전광역시 서구 문정로 16",
    x: 127.381737137092,
    y: 36.3454867822582,
    db: 67.84,
    location: "도로",
    zone: "나"
  },
  {
    name: "서부농협 괴정지점 앞",
    addr: "대전광역시 서구 도솔로 325",
    x: 127.383404151107,
    y: 36.3372117096084,
    db: 66.47,
    location: "도로",
    zone: "나"
  },
  {
    name: "예은축산 맞은편",
    addr: "대전광역시 중구 뿌리공원로23번길 9",
    x: 127.380435858303,
    y: 36.2859729730668,
    db: 55.71,
    location: "도로",
    zone: "다"
  },
  {
    name: "오류어린이공원 앞",
    addr: "대전광역시 중구 계룡로816번길",
    x: 127.404920574447,
    y: 36.327017412608,
    db: 55.22,
    location: "도로",
    zone: "가"
  },
  {
    name: "용문빌리지 옆",
    addr: "대전광역시 서구 유등로483번길 38",
    x: 127.392983457601,
    y: 36.333765285871,
    db: 55.56,
    location: "도로",
    zone: "가"
  },
  {
    name: "엘케이팹티모 앞",
    addr: "대전광역시 유성구 복용동로 55",
    x: 127.322300705588,
    y: 36.3372638679667,
    db: 57.82,
    location: "도로",
    zone: "나"
  },
  {
    name: "용문 오토바이 앞",
    addr: "대전광역시 서구 월평로 26",
    x: 127.360030880844,
    y: 36.3559162501331,
    db: 62.97,
    location: "도로",
    zone: "나"
  },
  {
    name: "올리브영 앞",
    addr: "대전광역시 서구 관저동로 166",
    x: 127.341146619319,
    y: 36.30689081583,
    db: 62.42,
    location: "도로",
    zone: "나"
  },
  {
    name: "용인빌라 앞",
    addr: "대전광역시 중구 선화동 191-1",
    x: 127.417106631946,
    y: 36.3319801361269,
    db: 53.51,
    location: "일반",
    zone: "가"
  },
  {
    name: "우정유치원 건너편",
    addr: "대전광역시 서구 관저서로 47",
    x: 127.329643944132,
    y: 36.2966074874949,
    db: 62.89,
    location: "도로",
    zone: "가"
  },
  {
    name: "온누리교회 우측",
    addr: "대전광역시 동구 동부로 39",
    x: 127.457576446156,
    y: 36.3205614530336,
    db: 65.68,
    location: "도로",
    zone: "가"
  },
  {
    name: "용운도서관 앞",
    addr: "대전광역시 동구 용운동 389-2",
    x: 127.4639919269,
    y: 36.3253509908919,
    db: 52.4,
    location: "도로",
    zone: "가"
  },
  {
    name: "은혜요양병원 앞",
    addr: "대전광역시 중구 대사동 248-287",
    x: 127.417093610474,
    y: 36.3193484627972,
    db: 69.27,
    location: "도로",
    zone: "가"
  },
  {
    name: "열매마을대우3단지 307동 건너편",
    addr: "대전광역시 유성구 노은동로 219",
    x: 127.319854496386,
    y: 36.3787386745325,
    db: 61.27,
    location: "일반",
    zone: "가"
  },
  {
    name: "아이수안경 앞",
    addr: "대전광역시 서구 문정로 86",
    x: 127.388771037247,
    y: 36.3464570094755,
    db: 69.07,
    location: "도로",
    zone: "나"
  },
  {
    name: "우정빌라 앞",
    addr: "대전광역시 서구 신갈마로 161",
    x: 127.368069009005,
    y: 36.348195441837,
    db: 66.6,
    location: "일반",
    zone: "가"
  },
  {
    name: "이서빌 우측",
    addr: "대전광역시 유성구 지족북로13번길 2",
    x: 127.303067356144,
    y: 36.3867271727369,
    db: 58.34,
    location: "도로",
    zone: "가"
  },
  {
    name: "인동성결교회 앞",
    addr: "대전광역시 동구 인동 155-2",
    x: 127.439245625878,
    y: 36.3211282736683,
    db: 55.52,
    location: "도로",
    zone: "가"
  },
  {
    name: "용운초등학교 건너편",
    addr: "대전광역시 동구 용운동 303",
    x: 127.463934765084,
    y: 36.3265558492224,
    db: 58.42,
    location: "도로",
    zone: "가"
  },
  {
    name: "족욕체험장 건너편",
    addr: "대전광역시 유성구 온천로 60",
    x: 127.344242361402,
    y: 36.3544548609713,
    db: 63.51,
    location: "도로",
    zone: "가"
  },
  {
    name: "유성온천교회 앞",
    addr: "대전광역시 유성구 유성대로 743",
    x: 127.333764294813,
    y: 36.3594149040178,
    db: 65.81,
    location: "도로",
    zone: "가"
  },
  {
    name: "장대초등학교 옆",
    addr: "대전광역시 유성구 문화원로19번길 16",
    x: 127.339885744782,
    y: 36.3617977040082,
    db: 66.33,
    location: "일반",
    zone: "가"
  },
  {
    name: "윗용소어린이공원",
    addr: "대전광역시 서구 도안동로11번길",
    x: 127.350882548215,
    y: 36.3058423939249,
    db: 60.24,
    location: "일반",
    zone: "가"
  },
  {
    name: "참동물병원 앞",
    addr: "대전광역시 서구 도산로 82",
    x: 127.379125187111,
    y: 36.3157769341184,
    db: 68.64,
    location: "도로",
    zone: "나"
  },
  {
    name: "옥봉화학 정문 옆",
    addr: "대전광역시 대덕구 문평동로48번길 1",
    x: 127.400967712734,
    y: 36.4486745452149,
    db: 60.64,
    location: "도로",
    zone: "다"
  },
  {
    name: "정림초교 건너편",
    addr: "대전광역시 서구 정림서로 162-15",
    x: 127.365515183789,
    y: 36.303102216601,
    db: 62.89,
    location: "도로",
    zone: "가"
  },
  {
    name: "천광교회 옆",
    addr: "대전광역시 동구 대동초등1길 36",
    x: 127.447623815564,
    y: 36.3247167110191,
    db: 55.69,
    location: "도로",
    zone: "가"
  },
  {
    name: "창원빌라 앞",
    addr: "대전광역시 유성구 문화원로10번길 51",
    x: 127.338033020606,
    y: 36.3594195743835,
    db: 56.68,
    location: "일반",
    zone: "가"
  },
  {
    name: "청주식당 앞",
    addr: "대전광역시 동구 가양동 293-9",
    x: 127.442233535069,
    y: 36.3426210821096,
    db: 61.55,
    location: "도로",
    zone: "나"
  },
  {
    name: "장대노인회관 앞",
    addr: "대전광역시 유성구 유성대로758번길 28",
    x: 127.335560551199,
    y: 36.3589182004013,
    db: 58.73,
    location: "도로",
    zone: "가"
  },
  {
    name: "초대교회 앞",
    addr: "대전광역시 동구 한밭대로1237번길 37-24",
    x: 127.436202057028,
    y: 36.3589685662892,
    db: 53.73,
    location: "도로",
    zone: "가"
  },
  {
    name: "진잠향교 옆",
    addr: "대전 유성구 교촌로 67",
    x: 127.315024718849,
    y: 36.3036785561973,
    db: 53.08,
    location: "도로",
    zone: "가"
  },
  {
    name: "중촌 경희한의원 앞",
    addr: "대전광역시 동구 태전로 149",
    x: 127.42049575923,
    y: 36.3409788709856,
    db: 70.59,
    location: "도로",
    zone: "나"
  },
  {
    name: "월평2동우체국 앞",
    addr: "대전 서구 갈마역로 143-12",
    x: 127.373667822204,
    y: 36.3635676730267,
    db: 60.65,
    location: "도로",
    zone: "나"
  },
  {
    name: "케이벨 우측 도로변",
    addr: "대전광역시 유성구 테크노1로 11-8",
    x: 127.389909453786,
    y: 36.4319513366356,
    db: 63.47,
    location: "도로",
    zone: "나"
  },
  {
    name: "청춘다락 앞(구, 중앙동사무소 앞)",
    addr: "대전광역시 동구 선화로196번길 56",
    x: 127.429126002776,
    y: 36.3317369825906,
    db: 54.64,
    location: "도로",
    zone: "나"
  },
  {
    name: "커피가주차장 좌측",
    addr: "대전광역시 유성구 탑립동 624-10",
    x: 127.395459144032,
    y: 36.4090985977428,
    db: 63.6,
    location: "도로",
    zone: "나"
  },
  {
    name: "충일교회 앞",
    addr: "대전광역시 중구 옥계동 173-1",
    x: 127.452225190944,
    y: 36.296286266498,
    db: 71.66,
    location: "도로",
    zone: "가"
  },
  {
    name: "크린아이 맞은편",
    addr: "대전광역시 서구 도솔로327번길 12",
    x: 127.383201215445,
    y: 36.3377063138227,
    db: 56.68,
    location: "도로",
    zone: "나"
  },
  {
    name: "코인워시365 앞",
    addr: "대전광역시 동구 가양로80번길 23",
    x: 127.443088542482,
    y: 36.3425432650717,
    db: 55.86,
    location: "도로",
    zone: "나"
  },
  {
    name: "청룡아파트1동 앞",
    addr: "대전광역시 동구 동산초교로22번길 15",
    x: 127.427573013343,
    y: 36.347561444337,
    db: 56.2,
    location: "일반",
    zone: "가"
  },
  {
    name: "투썸플레이스 앞",
    addr: "대전광역시 유성구 은구비서로23번길 15",
    x: 127.319677282836,
    y: 36.3742209952457,
    db: 61.23,
    location: "도로",
    zone: "나"
  },
  {
    name: "하나로아파트 110동 옆",
    addr: "대전광역시 서구 청사로 5",
    x: 127.365037321587,
    y: 36.3611513895089,
    db: 67.55,
    location: "일반",
    zone: "가"
  },
  {
    name: "중앙시장공용주차장빌딩 옆",
    addr: "대전광역시 동구 중앙로200번길 70",
    x: 127.432737917859,
    y: 36.3274171704018,
    db: 58.76,
    location: "도로",
    zone: "나"
  },
  {
    name: "한빛교회 앞",
    addr: "대전광역시 서구 대덕대로22번길 21",
    x: 127.373538444669,
    y: 36.3349616646714,
    db: 55.02,
    location: "도로",
    zone: "가"
  },
  {
    name: "포도과수원 앞",
    addr: "대전광역시 유성구 엑스포로539번길 201-7",
    x: 127.395709773858,
    y: 36.4083252687925,
    db: 52.24,
    location: "도로",
    zone: "라"
  },
  {
    name: "한밭주택 옆",
    addr: "대전광역시 서구 오량3길 32",
    x: 127.376388337207,
    y: 36.3096594210792,
    db: 51.86,
    location: "도로",
    zone: "가"
  },
  {
    name: "하버드사진관 앞",
    addr: "대전광역시 대덕구 비래동로 26",
    x: 127.450524104151,
    y: 36.3561982115464,
    db: 61.86,
    location: "도로",
    zone: "나"
  },
  {
    name: "한희수 개성만두 앞",
    addr: "대전광역시 동구 한밭대로 1221",
    x: 127.434069662139,
    y: 36.3583463321635,
    db: 71.41,
    location: "도로",
    zone: "나"
  },
  {
    name: "한빛순복음교회 옆",
    addr: "대전광역시 서구 중반8길 79",
    x: 127.385399103885,
    y: 36.3272903266094,
    db: 54.08,
    location: "도로",
    zone: "가"
  },
  {
    name: "큰솔아파트 맞은편",
    addr: "대전광역시 동구 동대전로256번길 109",
    x: 127.452083233362,
    y: 36.3468423163945,
    db: 53.94,
    location: "일반",
    zone: "가"
  },
  {
    name: "해성빌라 우측편",
    addr: "대전 서구 도솔로 112",
    x: 127.373800364562,
    y: 36.3205373846535,
    db: 64.81,
    location: "일반",
    zone: "가"
  },
  {
    name: "해오름빌 앞",
    addr: "대전광역시 대덕구 홍도로129번길 89",
    x: 127.422148945433,
    y: 36.3575083201328,
    db: 53.97,
    location: "일반",
    zone: "가"
  },
  {
    name: "초록마을 옆",
    addr: "대전광역시 서구 원도안로 183",
    x: 127.343785969817,
    y: 36.320135133039,
    db: 63.78,
    location: "도로",
    zone: "가"
  },
  {
    name: "홍주네식당 앞",
    addr: "대전광역시 동구 대전로 680-4",
    x: 127.438448759347,
    y: 36.32101076503,
    db: 67.75,
    location: "도로",
    zone: "나"
  },
  {
    name: "해영우 빌딩 앞",
    addr: "대전광역시 서구 원도안로179번길 30-9",
    x: 127.342078226335,
    y: 36.3196849862513,
    db: 62.09,
    location: "도로",
    zone: "나"
  },
  {
    name: "상록스토아",
    addr: "대전광역시 서구 둔산동 908",
    x: 127.393145415941,
    y: 36.3612128616922,
    db: 61.84,
    location: "도로",
    zone: "나"
  },
  {
    name: "유진투자증권",
    addr: "대전광역시 서구 둔산동 1273",
    x: 127.380979746938,
    y: 36.3515684811983,
    db: 68.31,
    location: "도로",
    zone: "나"
  },
  {
    name: "호수식당 맞은편",
    addr: "대전광역시 대덕구 평촌2길 25",
    x: 127.434586372253,
    y: 36.4365935166639,
    db: 54.87,
    location: "도로",
    zone: "나"
  },
  {
    name: "현대해상 앞",
    addr: "대전광역시 서구 둔산서로 75",
    x: 127.382595982164,
    y: 36.353294392513,
    db: 65.14,
    location: "도로",
    zone: "나"
  },
  {
    name: "휴먼시아4단지아파트 401동 앞",
    addr: "대전광역시 유성구 상대로 40",
    x: 127.338460561269,
    y: 36.3473304385587,
    db: 62.6,
    location: "일반",
    zone: "가"
  },
  {
    name: "화로연담 옆",
    addr: "대전광역시 유성구 원신흥남로 27",
    x: 127.337940802084,
    y: 36.335080680202,
    db: 57.39,
    location: "도로",
    zone: "나"
  },
  {
    name: "해뜰마을 어린이도서관 옆",
    addr: "대전광역시 서구 관저동로 166",
    x: 127.341146619319,
    y: 36.30689081583,
    db: 58.6,
    location: "일반",
    zone: "가"
  },
  {
    name: "하나로정육식당 건너편",
    addr: "대전광역시 중구 동서대로 1190",
    x: 127.392130740494,
    y: 36.326291974121,
    db: 70.72,
    location: "도로",
    zone: "나"
  },
  {
    name: "현대자동차대전대화대리점 앞",
    addr: "대전광역시 대덕구 대화동 16-236",
    x: 127.419027705261,
    y: 36.3669211469102,
    db: 71.63,
    location: "도로",
    zone: "나"
  },
  {
    name: "열매마을7단지 정문",
    addr: "대전광역시 유성구 지족동 은구비로 55",
    x: 127.320850266538,
    y: 36.3757375841407,
    db: 63.13,
    location: "일반",
    zone: "가"
  },
  {
    name: "동대전산정현교회",
    addr: "대전광역시 대덕구 쌍청당로35번길 26",
    x: 127.433066221542,
    y: 36.3652344066075,
    db: 59.63,
    location: "도로",
    zone: "가"
  }
];

  window.toggleMarkers = function () {
    if (isMarkerVisible) {
      clearMarkers();
      isMarkerVisible = false;
    } else {
      showMarkers();
      isMarkerVisible = true;
    }
  };
  window.closeOverlay = function () {
    if (window.overlay) {
      window.overlay.setMap(null);
    }
  };

  function showMarkers() {
    clearMarkers();
    markerPoints.forEach(pt => {
      const marker = new kakao.maps.Marker({
        map,
        position: new kakao.maps.LatLng(pt.y, pt.x),
        title: pt.name,
        image: noiseIcon
      });
      kakao.maps.event.addListener(marker, 'click', () => {
        overlay.setContent(createNoiseOverlay(pt));
        overlay.setPosition(marker.getPosition());
        overlay.setMap(map);
      });
      markerData.push(marker);
    });
  }

  function clearMarkers() {
    markerData.forEach(m => m.setMap(null));
    markerData = [];
    overlay.setMap(null);
  }
  
  function markerClickHandler(marker, properties) {
    const lat = marker.getPosition().getLat();
    const lng = marker.getPosition().getLng();

    // 팝업 띄우기
    $('#buildingInfoPopup').fadeIn(() => {
      showPopupMap(lat, lng); // ✅ 클릭된 마커 좌표를 팝업 지도에 표시
    });

    $('body').css('overflow', 'hidden');

    // 상세 정보 채우기
    $('#buildingName').text(properties.cmpx_nm || '단지명 정보 없음');
    $('#buildingAddress').text(properties.rd_addr || '주소 정보 없음');
    $('#wishIcon').attr('data-cmpxcd', properties.cmpx_cd || '');

    $('#unitTotal').text(properties.hhld_cnt || '정보 없음');
    $('#buildingCount').text(properties.bld_cnt || '정보 없음');
    $('#floorMax').text(properties.flr_max || '정보 없음');
    $('#cctvCount').text(properties.cctv || '정보 없음');
    $('#areaUnit').text(properties.area_per_hhld || '정보 없음');

    $('#builtDate').text(properties.built_ym ? `${properties.built_ym} 준공` : '');

    createEnergyGauge(properties.energy || null);
    renderManagementCharts();
  }
  

window.searchBuilding = function () {
  const keywordInput = document.getElementById('searchInput');
  const keyword = keywordInput.value.trim();

  if (!keyword) {
    alert("검색어를 입력해주세요.");
    return;
  }

  clearPolygons();
  clearMarkers();

  let bounds = new kakao.maps.LatLngBounds();
  let found = false;

  fetch(`/searchKeyword?keyword=${encodeURIComponent(keyword)}`)
    .then(response => {
      if (!response.ok) throw new Error('서버 응답 오류');
      return response.json();
    })
    .then(data => {
      const geocoder = new kakao.maps.services.Geocoder();

      if (data.length === 0) {
        alert("검색 결과가 없습니다.");
        return;
      }

      const address = data[0].rdAddr;
      if (address) {
        geocoder.addressSearch(address, function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            map.setCenter(coords);
          }
        });
      }

      data.forEach(item => {
        const address = item.rdAddr;
        if (!address) return;

        geocoder.addressSearch(address, function (result, status) {
          if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            const marker = new kakao.maps.Marker({
              map: map,
              position: coords,
              title: item.cmpxNm || address
            });

            markerData.push(marker);
            searchMarkers.push(marker);

            kakao.maps.event.addListener(marker, 'click', function () {
				$('#buildingInfoPopup').show().fadeIn();
				$('body').css('overflow', 'hidden');
				$('.icons-menu .icon-item').removeClass('active');
				$('.icons-menu .icon-item[data-target="section-management-fee"]').addClass('active');
				$('.popup-scroll-content').scrollTop(0);

				// ✅ [수정] 아파트 이름으로 에너지 효율 등급과 소요량을 조회하는 AJAX 호출
				$.ajax({
				      url: '/api/energyScoreByName',      // 서버에 요청할 주소
				      method: 'GET',
				      data: { cmpxCd: item.cmpxCd },      // 클릭된 마커의 아파트 이름을 파라미터로 전송
				      dataType: 'json',
				      success: function(energyData) {     // 요청이 성공하면 energyData에 결과가 담김
						console.log(energyData);
				        // 받은 데이터로 팝업창의 HTML 요소를 찾아 텍스트를 업데이트합니다.
				        $('#energyGrade').text(`이 건물의 에너지 효율 등급은 "${energyData.energyGrade || '정보 없음'}" 입니다.`);
				        $('#energyReq').text(`에너지 소요량: ${energyData.energyReq || '-'}`);
				        $('#matchedBldName').text(`매칭된 인증 건물: ${energyData.bldName || '없음'}`);
				        
				        // 받은 등급 정보로 에너지 게이지 차트를 다시 그립니다.
				        createEnergyGaugeByGrade(energyData.energyGrade || "정보 없음");
				      },
				      error: function(err) {
				        // 서버 요청 실패 시 에러 로그를 출력하고, 게이지 차트를 기본값으로 설정
				        console.error("에너지 정보 조회 실패:", err);
				        $('#energyGrade').text(`이 건물의 에너지 효율 등급은 "정보 없음" 입니다.`);
				        $('#energyReq').text(`에너지 소요량: -`);
				        $('#matchedBldName').text(`매칭된 인증 건물: 없음`);
				        createEnergyGaugeByGrade("정보 없음");
				      }
				    });
              // ✅ popupMap 지도 생성
			  createPopupMap(result[0].y, result[0].x);

			  fetch(`/api/complexDetail?cmpxCd=${encodeURIComponent(item.cmpxCd)}`)
			    .then(res => res.json())
				.then(detail => {
				    console.log("🔥 detail.similarList =", detail.similarList); // 이거 찍어보세요
				  $('#toggle-wish-icon').data('cmpxcd', item.cmpxCd);
			      $('#buildingName').text(detail.mapVo.cmpxNm || '단지명 없음');
			      $('#buildingAddress').text(detail.mapVo.lglAddr || '주소 없음');
			      $('#builtDate').text(detail.mapVo.apprDt ? detail.mapVo.apprDt + ' 준공' : '정보 없음');

			      $('#unitTotal').text(detail.mapVo.unitTot ?? '정보 없음');
			      $('#buildingCount').text(detail.mapVo.bldgCnt ?? '정보 없음');
			      $('#floorMax').text(detail.mapVo.flrMax ?? '정보 없음');
			      $('#cctvCount').text(detail.mapVo.cctvCnt ?? '정보 없음');
			      $('#areaUnit').text(detail.areaVo?.areaUnit ?? '정보 없음');

			      $('#avgMgmtFee').text(detail.unitFee !== null ? detail.unitFee.toLocaleString() + '원' : '정보 없음');
			      $('#publicMgmtFee').text(detail.publicMgmtFee !== null ? detail.publicMgmtFee.toLocaleString() + '원' : '정보 없음');
			      $('#personalMgmtFee').text(detail.personalMgmtFee !== null ? detail.personalMgmtFee.toLocaleString() + '원' : '정보 없음');

			      $('#mgmtFeeTotal').text(detail.mgmtFeeTotalInt !== null ? detail.mgmtFeeTotalInt.toLocaleString() + '원' : '정보 없음');
			      $('#cleaningFee').text(detail.cleaningFeeInt !== null ? detail.cleaningFeeInt.toLocaleString() + '원' : '정보 없음');
			      $('#securityFee').text(detail.securityFeeInt !== null ? detail.securityFeeInt.toLocaleString() + '원' : '정보 없음');
			      $('#disinfectionFee').text(detail.disinfectionFeeInt !== null ? detail.disinfectionFeeInt.toLocaleString() + '원' : '정보 없음');
			      $('#elevatorMaintFee').text(detail.elevatorMaintFeeInt !== null ? detail.elevatorMaintFeeInt.toLocaleString() + '원' : '정보 없음');
			      $('#repairFee').text(detail.repairFeeInt !== null ? detail.repairFeeInt.toLocaleString() + '원' : '정보 없음');

			      $('#electricFee').text(detail.elecUsagePrivatePerUnit !== null ? Math.round(detail.elecUsagePrivatePerUnit).toLocaleString() + '원' : '정보 없음');
			      $('#waterFee').text(detail.waterUsagePrivatePerUnit !== null ? Math.round(detail.waterUsagePrivatePerUnit).toLocaleString() + '원' : '정보 없음');
			      $('#heatingFee').text(detail.heatingFeePrivatePerUnit !== null ? Math.round(detail.heatingFeePrivatePerUnit).toLocaleString() + '원' : '정보 없음');
			      $('#gasFee').text(detail.gasUsagePrivatePerUnit !== null ? Math.round(detail.gasUsagePrivatePerUnit).toLocaleString() + '원' : '정보 없음');

			      // 유사 단지 리스트 추가: #similarComplexList 요소에 동적으로 리스트 생성
				  const similarListContainer = $('.similar-building-list');
				  similarListContainer.empty(); // 기존 내용 비우기

				  const listToUse = detail.similarList || similarList; // 둘 중에 있는 데이터 선택
				  const fallbackImages = ['doan19.jpg', 'haerangsoop.jpg', 'richeville.jpg']; // chunnyunnamu 제외

				  if (listToUse && listToUse.length > 0) {
				    listToUse.forEach(item => {
				      // imageUrl이 없으면 랜덤 이미지 선택
				      const imageFile = item.imageUrl || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
				      const cardHtml = `
				        <div class="image-container">
				          <img src="/img/apt/${imageFile}" alt="${item.cmpxNm} Image">
				          <div class="details">
				            <h6>${item.cmpxNm}</h6>
				            <p>${item.lglAddr || '주소 정보 없음'}</p>
				            <p>${item.age || '-'}년차 / ${item.unitTot || '-'}세대</p>
				          </div>
				        </div>
				      `;
				      similarListContainer.append(cardHtml);
				    });
				  } else {
				    similarListContainer.html('<p>유사 단지가 없습니다.</p>');
				  }

			      // 관리비, 에너지 차트 렌더링 함수 호출
			      managementFees = {
			        total: detail.mgmtFeeTotalInt ?? 0,
			        cleaning: detail.cleaningFeeInt ?? 0,
			        security: detail.securityFeeInt ?? 0,
			        disinfection: detail.disinfectionFeeInt ?? 0,
			        elevator: detail.elevatorMaintFeeInt ?? 0,
			        repair: detail.repairFeeInt ?? 0
			      };

			      energyCosts = {
			        elec: detail.elecUsagePrivatePerUnit ?? 0,
			        water: detail.waterUsagePrivatePerUnit ?? 0,
			        heating: detail.heatingFeePrivatePerUnit ?? 0,
			        gas: detail.gasUsagePrivatePerUnit ?? 0
			      };

			      renderManagementCharts();
			    })
			    .catch(err => console.error("건물 상세정보 불러오기 실패", err));
            });
          }
        });
      });
    })
    .catch(error => {
      console.error('검색 중 오류 발생:', error);
    });
};

document.getElementById('searchInput').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    window.searchBuilding();
  }
});

function createPopupMap(lat, lng) {
  const container = document.getElementById('popupMap');
  if (!container) return;

  container.innerHTML = ""; // 혹시 이전 지도가 있을 경우 초기화

  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3
  };

  const popupMap = new kakao.maps.Map(container, options);

  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(lat, lng)
  });
  marker.setMap(popupMap);
}

// DB에서 가져온 데이터로 폴리곤 그리는 함수
  function drawPolygonsFromDB(itemList) {
    itemList.forEach(item => {
      try {
        const raw = item.cords;
        if (!raw) return;

        let parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        let geometry = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;

        let coords = [];
        if (geometry.type === 'Polygon') {
          coords = geometry.coordinates[0]
            .filter(e => Array.isArray(e) && !isNaN(e[0]) && !isNaN(e[1]))
            .map(e => new kakao.maps.LatLng(e[1], e[0]));
        } else if (geometry.type === 'MultiPolygon') {
          coords = geometry.coordinates[0][0]
            .filter(e => Array.isArray(e) && !isNaN(e[0]) && !isNaN(e[1]))
            .map(e => new kakao.maps.LatLng(e[1], e[0]));
        } else {
          console.warn("지원되지 않는 형식:", geometry.type);
          return;
        }

        if (coords.length < 3) return;

        const polygon = new kakao.maps.Polygon({
          path: coords,
          strokeWeight: 2,
          strokeColor: '#004c80',
          strokeOpacity: 0.8,
          fillColor: '#a6c1ee',
          fillOpacity: 0.6
        });

        polygon.setMap(map);
        polygons.push(polygon);

      } catch (err) {
        console.error("좌표 파싱 오류:", err);
      }
    });
  }
  
  function createEnergyGaugeByGrade(grade) {
    const scoreMap = {
      "1+++": 50, "1++": 75, "1+": 100, "1": 130,
      "2": 170, "3": 210, "4": 250, "5": 290,
      "6": 330, "7": 370
    };
    const score = scoreMap[grade] ?? 420; // 정보 없음 또는 기타 등급일 때

    createEnergyGauge(score); // 기존 게이지 차트 그리는 함수 호출

    $('#energyGrade').text(`이 건물의 에너지 효율 등급은 "${grade}" 입니다.`);
  }
  


});
