package com.house.team.admin.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.house.team.admin.service.AdminUploadService;

@Controller
public class AdminUploadController {
	
	@Autowired
	private AdminUploadService adminUploadService;
    
	// 관리비 파일 업로드 컨트롤러
	@PostMapping("/admin/upload/excel")
    @ResponseBody
	public ResponseEntity<Map<String, String>> excelUploadFile(@RequestParam("file") MultipartFile file) {
		 Map<String, String> response = new HashMap<>();
		// 파일 선택X
    	if(file.isEmpty()) {
    		response.put("status", "error");
			response.put("message","업로드할 파일을 선택해주세요.");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
    	
    	// 엑셀파일이 아닌 다른 형식의 파일 선택시
    	String fileName = file.getOriginalFilename();
        if (fileName == null || (!fileName.endsWith(".xls") && !fileName.endsWith(".xlsx"))) {
            response.put("status", "error");
            response.put("message", "Excel 파일(.xls 또는 .xlsx) 형식만 업로드할 수 있습니다.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

		try {
			int savedCount = adminUploadService.processExcelFile(file); // Service 호출 (현재 insertAdminUploadBatch 사용)
            response.put("status", "success");
			response.put("message","파일 업로드 성공! 총 " + savedCount + "개의 데이터가 DB에 저장되었습니다.");
            return new ResponseEntity<>(response, HttpStatus.OK); // 200 OK 상태 코드와 함께 응답 반환
		} catch(IllegalArgumentException e){
            response.put("status", "error");
			response.put("message","Excel 파일 처리 오류: " + e.getMessage());
            e.printStackTrace(); // 개발 중 오류 추적을 위해 스택 트레이스 출력
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		} catch(Exception e) {
            response.put("status", "error");
			response.put("message","오류 발생! : " + e.getMessage());
			e.printStackTrace(); // 개발 중 오류 추적을 위해 스택 트레이스 출력
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR); // 500 Internal Server Error 상태 코드와 함께 응답 반환
		}
    }
}
