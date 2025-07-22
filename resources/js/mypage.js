// 마이페이지 JavaScript 파일

// 프로필 사진 업로드 처리
/*document.addEventListener('DOMContentLoaded', function() {
    const photoUpload = document.getElementById('photo-upload');
    const profileImg = document.getElementById('profile-img');
    
    if (photoUpload) {
        photoUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});*/

// 관리비 비교 모달 열기
function showMaintenanceComparison() {
    document.getElementById('maintenance-modal').style.display = 'flex'; // flex로 변경하여 중앙 정렬

    updateMaintenanceModalDetails(); // 상세 내역 업데이트 함수 호출
}
    
// 동적으로 상세 내역의 증감 표시를 업데이트하는 함수 (수정됨)
function updateMaintenanceModalDetails() {
    const detailItems = document.querySelectorAll('#maintenance-detail-list .detail-item');

    detailItems.forEach(item => {
        const changeIndicatorSpan = item.querySelector('.change-indicator');
        // data-diff-val 속성에서 값 가져오기. 속성 값이 문자열이므로 숫자로 파싱
        const diffVal = parseFloat(changeIndicatorSpan.dataset.diffVal);

        let iconHtml = '';
        let text = '';
        let className = '';

        if (diffVal > 0) {
            iconHtml = '<i class="fa-solid fa-caret-up"></i>';
            text = `${Math.abs(diffVal).toLocaleString()}원 올랐어요!`;
            className = 'increase';
        } else if (diffVal < 0) {
            iconHtml = '<i class="fa-solid fa-caret-down"></i>';
            text = `${Math.abs(diffVal).toLocaleString()}원 떨어졌어요!`;
            className = 'decrease';
        } else {
            iconHtml = '';
            text = '변동 없음'; // 또는 빈 문자열
            className = 'no-change';
        }

        // 기존 클래스 제거 후 새 클래스 추가
        changeIndicatorSpan.className = `change-indicator ${className}`;
        changeIndicatorSpan.innerHTML = iconHtml + ' ' + text;

        // 변동 없음일 경우 텍스트 숨김 (CSS에서 visibility: hidden 처리)
        if (className === 'no-change') {
            changeIndicatorSpan.style.visibility = 'hidden';
        } else {
            changeIndicatorSpan.style.visibility = 'visible';
        }
    });
}

// 에너지 사용 현황 모달 열기
function showEnergyUsage() {
    document.getElementById('energy-modal').style.display = 'flex';
}

// 장충금 환급 모달 열기
function showMaintenanceRefund() {
	document.getElementById('refund-modal').classList.add('show-modal'); 
    // 초기 상태로 리셋
    document.getElementById('refund-info').style.display = 'block';
    document.getElementById('refund-calculator').style.display = 'none';
    document.getElementById('refund-result').style.display = 'none';
}

// 모달 닫기
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 환급액 계산기 표시
function showRefundCalculator() {
    document.getElementById('refund-info').style.display = 'none';
    document.getElementById('refund-calculator').style.display = 'block';
}

// 환급액 계산 및 결과 표시
function calculateRefund() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        alert('시작일과 종료일을 모두 선택해주세요.');
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
        alert('종료일이 시작일보다 늦어야 합니다.');
        return;
    }
    
    const cmpxCd = document.getElementById('cmpxCd')?.value;
	console.log("cmpxCd:", cmpxCd);
	
	fetch(`/api/refund?cmpxCd=${cmpxCd}&startDate=${startDate}&endDate=${endDate}`)
		.then(res => res.json())
		.then(data => {
			console.log("data 확인:", data);
			document.getElementById('refund-calculator').style.display = 'none';
			const resultSection = document.getElementById('refund-result');
			resultSection.style.display = 'block';
			
			const amountElement = resultSection.querySelector('.result-amount');
			amountElement.textContent = data.totalAmount.toLocaleString() + '원';
			
			const tbody = document.querySelector("#detail-table tbody");
			tbody.innerHTML = "";
			
			data.details.forEach(item => {
				const tr = document.createElement("tr");
				tr.innerHTML = `
					<td>${item.month}</td>
					<td>${item.amount.toLocaleString()}원</td>
				`;
				tbody.appendChild(tr);
			});
			
			animateNumber(amountElement, 0, data.totalAmount, 2000);
		})
		.catch(error => {
			console.error('환급액 계산 오류:', error);
			alert('환급액 계산 중 오류가 발생했습니다. 다시 시도해주세요.');
		})
}

// 환급 상세내역 토글
function toggleRefundDetail() {
    const detailTable = document.getElementById('detail-table');
    const arrow = document.getElementById('detail-arrow');
    
    if (detailTable.style.display === 'none' || detailTable.style.display === '') {
        detailTable.style.display = 'block';
        arrow.className = 'fa fa-chevron-up';
    } else {
        detailTable.style.display = 'none';
        arrow.className = 'fa fa-chevron-down';
    }
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') { // Changed from 'block' to 'flex'
                modal.style.display = 'none';
                // 배경 스크롤 다시 활성화
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// 날짜 입력 제한 (오늘 이후 날짜 선택 불가)
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    if (startDateInput) {
        startDateInput.max = today;
    }
    if (endDateInput) {
        endDateInput.max = today;
    }
    
    // 시작일 변경 시 종료일 최소값 설정
    if (startDateInput) {
        startDateInput.addEventListener('change', function() {
            const startDate = this.value;
            if (endDateInput) {
                endDateInput.min = startDate;
            }
        });
    }
});

// 에너지 사용량 애니메이션
function animateEnergyBars() {
    const energyFills = document.querySelectorAll('.energy-fill');
    energyFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = width;
        }, 300);
    });
}

// 에너지 모달이 열릴 때 애니메이션 실행
const energyModalObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            const modal = mutation.target;
            if (modal.id === 'energy-modal' && modal.style.display === 'flex') { // Changed from 'block' to 'flex'
                setTimeout(animateEnergyBars, 100);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const energyModal = document.getElementById('energy-modal');
    if (energyModal) {
        energyModalObserver.observe(energyModal, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
});

// 숫자 애니메이션 효과
function animateNumber(element, start, end, duration) {
    let startTime = null;
    const step = function(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value.toLocaleString() + '원';
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

// 환급액 결과 표시 시 숫자 애니메이션
document.addEventListener('DOMContentLoaded', function() {
    const resultObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.id === 'refund-result' && target.style.display === 'block') {
                    const amountElement = target.querySelector('.result-amount');
                    if (amountElement) {
                        animateNumber(amountElement, 0, 2000); 
                    }
                }
            }
        });
    });
    
    const refundResult = document.getElementById('refund-result');
    if (refundResult) {
        resultObserver.observe(refundResult, {
            attributes: true,
            attributeFilter: ['style']
        });
    }
});

// 폼 유효성 검사
function validateForm() {
    const nickname = document.getElementById('nickname').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!nickname) {
        alert('닉네임을 입력해주세요.');
        return false;
    }
    
    if (!email) {
        alert('이메일을 입력해주세요.');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return false;
    }
    
    return true;
}

// 툴팁 기능
function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.whiteSpace = 'nowrap';
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
    
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 3000);
}

// 로딩 상태 표시
function showLoading(button) {
    const originalText = button.textContent;
    button.textContent = '처리 중...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// 부드러운 스크롤 효과
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}