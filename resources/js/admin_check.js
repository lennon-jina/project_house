const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const rowCheckboxes = document.querySelectorAll('.row-checkbox');

selectAllCheckbox.addEventListener('change', function() {
    rowCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
    });
});

rowCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (!this.checked) {
            selectAllCheckbox.checked = false;
        } else {
            // 모든 개별 체크박스가 선택되었는지 확인
            const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
            selectAllCheckbox.checked = allChecked;
        }
    });
});