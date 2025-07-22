// 1. 제어할 HTML 요소를 변수에 저장
const menuTrigger = document.getElementById('board-menu-trigger');
const submenu = document.getElementById('board-submenu');
const navItem = menuTrigger.parentElement; // 부모 li.nav-item 요소

// 2. '게시판' 링크(a 태그)에 클릭 이벤트 리스너 추가
menuTrigger.addEventListener('click', function(event) {
    // a 태그의 기본 동작(페이지 이동 등)을 막음
    event.preventDefault(); 
    
    // submenu에 'show' 클래스를 추가하거나 제거 (토글)
    submenu.classList.toggle('show');
    
    // navItem에 'active' 클래스를 토글하여 화살표 아이콘 회전
    navItem.classList.toggle('active');
});

// (선택 사항) 메뉴 바깥을 클릭하면 메뉴가 닫히게 하는 기능
window.addEventListener('click', function(event) {
    // 클릭된 요소가 nav-item 안에 포함되어 있지 않다면
    if (!navItem.contains(event.target)) {
        // 메뉴를 닫음
        submenu.classList.remove('show');
        navItem.classList.remove('active');
    }
});
  