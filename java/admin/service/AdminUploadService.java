package com.house.team.admin.service;

import com.house.team.admin.dao.IAdminUploadDAO;
import com.house.team.admin.vo.AdminUploadVO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminUploadService {
	
	@Autowired
    private IAdminUploadDAO adminUploadDAO;
	
	
	// Excel 컬럼과 DB 컬럼 매핑
    private static final Map<String, String> excelColumnHeaderToVoField = new HashMap<>();
    static {
        excelColumnHeaderToVoField.put("단지코드", "cmpxCd");
        excelColumnHeaderToVoField.put("공용관리비계", "mgmtFeeTotal");
        excelColumnHeaderToVoField.put("청소비", "cleaningFee");
        excelColumnHeaderToVoField.put("경비비", "securityFee");
        excelColumnHeaderToVoField.put("소독비", "disinfectionFee");
        excelColumnHeaderToVoField.put("승강기유지비", "elevatorMaintFee");
        excelColumnHeaderToVoField.put("수선비", "repairFee");
        excelColumnHeaderToVoField.put("난방비(공용)", "heatingFeePublic");
        excelColumnHeaderToVoField.put("난방비(전용)", "heatingFeePrivate");
        excelColumnHeaderToVoField.put("가스사용료(공용)", "gasUsagePublic");
        excelColumnHeaderToVoField.put("가스사용료(전용)", "gasUsagePrivate");
        excelColumnHeaderToVoField.put("전기료(공용)", "elecUsagePublic");
        excelColumnHeaderToVoField.put("전기료(전용)", "elecUsagePrivate");
        excelColumnHeaderToVoField.put("수도료(공용)", "waterUsagePublic");
        excelColumnHeaderToVoField.put("수도료(전용)", "waterUsagePrivate");
        excelColumnHeaderToVoField.put("발생년월(YYYYMM)", "expYearMonth");
    }


    @Transactional
    public int processExcelFile(MultipartFile file) throws IOException {
    	// Excel 파일을 파싱 -> AdminUploadVO 객체 리스트로 변환
    	List<AdminUploadVO> uploadList = parseExcelFile(file);
        
        // 파싱된 데이터가 없으면 0 반환
    	if (uploadList.isEmpty()) {
            return 0;
        }
    	int savedCount = 0;
        // 각 VO 객체에 대해 개별적으로 mergeAdminUpload 메서드 호출
    	for (AdminUploadVO vo : uploadList) {
            savedCount += adminUploadDAO.mergeAdminUpload(vo); // mergeAdminUpload로 변경
        }
        return savedCount;
    }

    /**
     * 업로드된 Excel 파일을 파싱하여 AdminUploadVO 객체 리스트로 변환
     */
    public List<AdminUploadVO> parseExcelFile(MultipartFile file) throws IOException {
        List<AdminUploadVO> uploadList = new ArrayList<>();

        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {
        	
        	// 첫번째 시트, 헤더 행 가져오기
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                throw new IllegalArgumentException("Excel 파일에 헤더가 없습니다.");
            }

            // 헤더의 인덱스와 해당 컬럼이 매핑될 AdminUploadVO의 필드명을 저장하는 맵
            Map<Integer, String> headerIndexToVoField = new HashMap<>();
            for (Cell cell : headerRow) {
                String headerName = getCellValueAsString(cell).trim();
                String voFieldName = excelColumnHeaderToVoField.get(headerName);
                if (voFieldName != null) {
                    headerIndexToVoField.put(cell.getColumnIndex(), voFieldName);
                } else {
                    System.out.println("경고: Excel에서 알 수 없는 헤더 컬럼 발견 - '" + headerName + "' (이 컬럼은 무시됩니다)");
                }
            }

            if (headerIndexToVoField.isEmpty()) {
                throw new IllegalArgumentException(
                    "Excel 파일에서 유효한 컬럼 헤더를 찾을 수 없습니다. 다음 컬럼 중 하나 이상이 필요합니다: "
                    + excelColumnHeaderToVoField.keySet()
                );
            }
            
            // for문으로 데이터를 채우기
            // 첫 번째 행(인덱스 0)은 헤더. 두 번째 행(인덱스 1)부터 시작!!
            for (int r = 1; r <= sheet.getLastRowNum(); r++) {
                Row dataRow = sheet.getRow(r);
                if (dataRow == null) continue;

                AdminUploadVO uploadVO = new AdminUploadVO();

                try {
                    for (Map.Entry<Integer, String> entry : headerIndexToVoField.entrySet()) {
                        int columnIndex = entry.getKey();
                        String fieldName = entry.getValue();
                        Cell cell = dataRow.getCell(columnIndex);

                        switch (fieldName) {
                            case "cmpxCd":
                                uploadVO.setCmpxCd(getCellValueAsString(cell));
                                break;
                            case "mgmtFeeTotal":
                                uploadVO.setMgmtFeeTotal(getNumericCellValue(cell));
                                break;
                            case "cleaningFee":
                                uploadVO.setCleaningFee(getNumericCellValue(cell));
                                break;
                            case "securityFee":
                                uploadVO.setSecurityFee(getNumericCellValue(cell));
                                break;
                            case "disinfectionFee":
                                uploadVO.setDisinfectionFee(getNumericCellValue(cell));
                                break;
                            case "elevatorMaintFee":
                                uploadVO.setElevatorMaintFee(getNumericCellValue(cell));
                                break;
                            case "repairFee":
                                uploadVO.setRepairFee(getNumericCellValue(cell));
                                break;
                            case "heatingFeePublic":
                                uploadVO.setHeatingFeePublic(getNumericCellValue(cell));
                                break;
                            case "heatingFeePrivate":
                                uploadVO.setHeatingFeePrivate(getNumericCellValue(cell));
                                break;
                            case "gasUsagePublic":
                                uploadVO.setGasUsagePublic(getNumericCellValue(cell));
                                break;
                            case "gasUsagePrivate":
                                uploadVO.setGasUsagePrivate(getNumericCellValue(cell));
                                break;
                            case "elecUsagePublic":
                                uploadVO.setElecUsagePublic(getNumericCellValue(cell));
                                break;
                            case "elecUsagePrivate":
                                uploadVO.setElecUsagePrivate(getNumericCellValue(cell));
                                break;
                            case "waterUsagePublic":
                                uploadVO.setWaterUsagePublic(getNumericCellValue(cell));
                                break;
                            case "waterUsagePrivate":
                                uploadVO.setWaterUsagePrivate(getNumericCellValue(cell));
                                break;
                            case "expYearMonth":
                                uploadVO.setExpYearMonth(parseExpYearMonth(cell));
                                break;
                            default:
                                break;
                        }
                    }
                    uploadList.add(uploadVO);
                } catch (Exception e) {
                    System.err.println("Excel 파일 " + (r + 1) + "번째 행 처리 중 오류 발생: " + e.getMessage());
                    throw new IllegalArgumentException(
                        "Excel 파일 " + (r + 1) + "번째 행 데이터 파싱 오류: " + e.getMessage(), e
                    );
                }
            }
        }
        return uploadList;
    }

    /**
     * 문자열로 반환
     */
    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return "";
        }
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield new SimpleDateFormat("yyyyMM").format(cell.getDateCellValue());
                } else {
                    yield String.valueOf((long) cell.getNumericCellValue());
                }
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> {
                yield cell.getCellFormula();
            }
            default -> "";
        };
    }

    /**
     * Double 타입 숫자로 반환
     * 숫자, 빈 값, 문자열(숫자로 변환 가능한) 셀을 처리
     */
    private Double getNumericCellValue(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return 0.0;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue());
            } catch (NumberFormatException e) {
                return 0.0;
            }
        }
        return 0.0;
    }

    /**
     * Excel 파일의 '발생년월(YYYYMM)' 값을 SQL Date 로 파싱
     * 숫자 형식의 날짜(Excel Date) or "YYYYMM" 형식으로 처리
     */
    private Date parseExpYearMonth(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return null;
        }
        
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            java.util.Date utilDate = cell.getDateCellValue();
            return new Date(utilDate.getTime());
        }

        String yearMonthStr = getCellValueAsString(cell);
        if (yearMonthStr.matches("^\\d{6}$")) {
            try {
                java.util.Date utilDate = new SimpleDateFormat("yyyyMMdd").parse(yearMonthStr + "01");
                return new Date(utilDate.getTime());
            } catch (ParseException e) {
                System.err.println("날짜 파싱 오류 (YYYYMM): " + yearMonthStr + " - " + e.getMessage());
                return null;
            }
        }
        return null;
    }
}