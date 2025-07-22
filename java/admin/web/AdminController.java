package com.house.team.admin.web;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // PostMapping 추가
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody; // 삭제 응답을 위한 어노테이션
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.house.team.admin.service.AdminMemberService;
import com.house.team.admin.service.AdminNoticeService;
import com.house.team.admin.service.AdminQnAService;
import com.house.team.admin.service.ViewCountService;
import com.house.team.admin.vo.AdminMemberVO;
import com.house.team.admin.vo.AdminNoticeVO;
import com.house.team.admin.vo.AdminQnAVO;
import com.house.team.admin.vo.AdminViewCountVO;
import com.house.team.user.service.UserService;

import jakarta.servlet.http.HttpSession;

@Controller
public class AdminController {

	@Autowired
	private AdminQnAService adminQnaService;
	@Autowired
	private AdminNoticeService adminNoticeService;
	@Autowired
	private UserService userService;
	@Autowired
	private AdminMemberService adminMemberService;
	@Autowired
	private ViewCountService viewCountService;

	// ======= 관리자 메인 페이지 ===========
	@GetMapping("/admin")
    public String adminPage(@RequestParam(defaultValue = "1") int page,
    						@RequestParam(defaultValue = "5") int size,
    						Model model) {
		// 대기중인 문의글 목록
		List<AdminQnAVO> watingList = adminQnaService.noCommList(page, size);
		
		model.addAttribute("List",watingList);
		model.addAttribute("currentPage",page);
		model.addAttribute("pageSize",size);
		int totalCount = adminQnaService.getNoCommCount();
		System.out.println(totalCount);
		int totalPage = (int) Math.ceil((double) totalCount / size);
		System.out.println(totalPage);
		model.addAttribute("totalCount",totalCount);
		model.addAttribute("totalPage",totalPage);
		
        return "admin/admin_main";
    }
	
	// 월별 가입자 수 그래프
	@ResponseBody
	@GetMapping("/monthlyMembers")
	public List<Map<String, Object>> getMonthlyNewMembers(@RequestParam(defaultValue = "0") int year) {
        if (year == 0) {
            year = Calendar.getInstance().get(Calendar.YEAR);
        }
        List<Map<String, Object>> rawData = userService.getNewMembers(year);
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH) + 1;

        // 현재 월까지만 데이터를 채우도록 수정
        List<Map<String, Object>> fullData = new ArrayList<>();
        for (int i = 1; i <= currentMonth; i++) { 
            final int monthLoop = i; 
            String targetMonthStr = String.format("%02d", monthLoop); 

            Map<String, Object> found = rawData.stream()
                                             .filter(item -> {
                                                 Object monthObj = item.get("MONTH");
                                                 String rawMonthStr = null;

                                                 if (monthObj instanceof String) {
                                                     rawMonthStr = (String) monthObj;
                                                 } else if (monthObj instanceof Number) {
                                                     rawMonthStr = String.format("%02d", ((Number) monthObj).intValue());
                                                 }
                                                 return rawMonthStr != null && rawMonthStr.equals(targetMonthStr);
                                             })
                                             .findFirst()
                                             .orElse(null);
            
            if (found != null) {
                Map<String, Object> convertedItem = new HashMap<>();
                convertedItem.put("month", String.format("%02d", Integer.parseInt((String) found.get("MONTH"))));
                convertedItem.put("memberCount", Integer.parseInt(found.get("MEMBERCOUNT").toString())); 
                fullData.add(convertedItem);
            } else {
                Map<String, Object> emptyMonth = new HashMap<>();
                emptyMonth.put("month", targetMonthStr);
                emptyMonth.put("memberCount", 0);
                fullData.add(emptyMonth);
            }
        }
        fullData.sort(Comparator.comparing(m -> (String)m.get("month")));

        return fullData;
    }
	
	// 월별 조회수
	@GetMapping("/monthlyBoardViews")
	@ResponseBody
	public Map<String, Object> getMonthlyBoardViewCounts() {
	    List<AdminViewCountVO> rawData = viewCountService.getMonthlyBoardViewCounts();

	    Map<String, Map<String, Integer>> monthlyData = new TreeMap<>();
	    Set<String> categories = new TreeSet<>();

	    for (AdminViewCountVO item : rawData) {
	    	String month = item.getYearMonth();
	        String category = item.getBoardCategory();
	        int count = item.getViewCount();

	        if (month != null && category != null) { // 혹시 모를 null 값 방지 (XML에서 걸러졌다면 필요 없을 수 있음)
	        	monthlyData.computeIfAbsent(month, k -> new TreeMap<>()).put(category, count);
	            categories.add(category);
	        } else {
	            System.err.println("경고: yearMonth 또는 boardCategory가 null인 조회 로그 데이터가 있습니다. 데이터: " + item);
	        }
	    }

	    List<String> allMonths = new ArrayList<>();
	    LocalDate currentDate = LocalDate.now();
	    int currentYear = currentDate.getYear();
	    int currentMonth = currentDate.getMonthValue();
	    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

	    for (int i = 1; i <= currentMonth; i++) {
	        allMonths.add(LocalDate.of(currentYear, i, 1).format(formatter));
	    }

	    // 차트 데이터셋 생성 (전체 월에 대해 0값 포함)
	    List<Map<String, Object>> chartDatasets = new ArrayList<>();

	    List<String> sortedCategories = new ArrayList<>(categories);
	    Collections.sort(sortedCategories); 

	    for (String category : sortedCategories) { 
	        Map<String, Object> dataset = new TreeMap<>();
	        dataset.put("label", category);
	        List<Integer> dataPoints = new ArrayList<>();

	        for (String month : allMonths) { // 1월부터 현재 월까지의 전체 월 목록 사용
	            // 해당 월에 해당 카테고리의 데이터가 없으면 0값 반환
	            dataPoints.add(monthlyData.getOrDefault(month, Collections.emptyMap()).getOrDefault(category, 0));
	        }
	        dataset.put("data", dataPoints);
	        chartDatasets.add(dataset);
	    }
	    
	    Map<String, Object> response = new TreeMap<>();
	    response.put("labels", allMonths); // 전체 월 목록을 레이블로 사용
	    response.put("datasets", chartDatasets);
	    
	    return response;
	}
	// 하루(요일별) 가입자 수 조회
	@ResponseBody
    @GetMapping("/weeklyMembers")
    public Map<String, Object> getWeeklyNewMembers() {
        Map<String, Object> rawData = userService.getWeeklyNewMembers();

        List<String> labels = Arrays.asList("월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일");
        List<Integer> memberCounts = new ArrayList<>();

        for (String day : labels) {
            memberCounts.add(((Number) rawData.getOrDefault(day, 0)).intValue());
        }

        Map<String, Object> dataset = new LinkedHashMap<>();
        dataset.put("label", "주간 가입자 수");
        dataset.put("data", memberCounts);
        dataset.put("fill", false);
        dataset.put("borderColor", "rgb(232, 159, 23)"); 
        dataset.put("tension", 0.1);

        List<Map<String, Object>> datasets = new ArrayList<>();
        datasets.add(dataset);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("labels", labels);
        response.put("datasets", datasets);

        return response;
    }

	
	// 주간 요일별 게시판별 조회수 (수정됨)
    @GetMapping("/weeklyBoardViews")
    @ResponseBody
    public Map<String, Object> getWeeklyBoardViewCounts() {
        List<Map<String, Object>> rawData = viewCountService.getWeeklyViewCounts();

        // 차트 라벨 (요일 순서 고정)
        List<String> labels = Arrays.asList("월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일");

        List<Map<String, Object>> datasets = new ArrayList<>();

        // 각 카테고리별 데이터셋 생성
        for (Map<String, Object> row : rawData) {
            String category = (String) row.get("BOARD_CATEGORY");
            if (category == null) {
                System.err.println("경고: BOARD_CATEGORY가 없는 주간 조회수 데이터가 있습니다: " + row);
                continue; // 카테고리 없으면 건너뛰기
            }

            Map<String, Object> dataset = new LinkedHashMap<>(); // 순서 유지를 위해 사용
            dataset.put("label", category);

            List<Integer> dataPoints = new ArrayList<>();
            for (String day : labels) {
            	// 데이터가 없으면 0으로 채움
            	dataPoints.add(((Number) row.getOrDefault(day.toUpperCase(), 0)).intValue());
            }
            dataset.put("data", dataPoints);
            datasets.add(dataset);
        }

        Map<String, Object> response = new LinkedHashMap<>(); // 순서 유지를 위해 LinkedHashMap 사용
        response.put("labels", labels);
        response.put("datasets", datasets);

        return response;
    }

	// =========== 관리자 메인 페이지 ===========
	
	
	// =========== Q&A ===========
	// Q&A
	@GetMapping("/admin_qna")
    public String list(@RequestParam(defaultValue = "1") int page,
			    		@RequestParam(defaultValue = "10") int size,
			    		@RequestParam(required = false) String searchField,
			    		@RequestParam(required = false) String keyword,
			    		@RequestParam(value = "sortOrder", defaultValue = "latest") String sortOrder,
			    		Model model) {
		List<AdminQnAVO> list = adminQnaService.getQnaList(page, size, searchField, keyword, sortOrder);
		int totalCount = adminQnaService.getQnaCount(searchField, keyword, sortOrder);
		int totalPage = (int) Math.ceil((double)totalCount / size);
        
		model.addAttribute("qaList",list);
		model.addAttribute("totalCount",totalCount);
		model.addAttribute("totalPage",totalPage);
		model.addAttribute("currentPage",page);
		model.addAttribute("pageSize",size);
		model.addAttribute("searchField", searchField);
		model.addAttribute("keyword", keyword);
		model.addAttribute("sortOrder", sortOrder);
		
		return "admin/boards_qna";
    }
	
	// 문의글 상세 페이지 (답변 작성/수정 폼)
    @GetMapping("/admin_qna/write/{boardNo}")
    public String getQnaDetailForAnswerForm(@PathVariable("boardNo") int boardNo, Model model) {
        AdminQnAVO qnaVO = adminQnaService.getQnaById(boardNo); // 문의글과 기존 답변 모두 가져옴
        if (qnaVO == null) {
            // 문의글이 없으면 목록으로 redirect
            return "redirect:/admin_qna";
        }

        model.addAttribute("qna", qnaVO);

        // 답변X -> "새 답변 작성" 모드 or "수정" 모드
        if (qnaVO.getComments() == null || qnaVO.getComments().trim().isEmpty()) {
            model.addAttribute("mode", "new"); // "새 답변" 모드
            model.addAttribute("formAction", "/admin_qna/saveAnswer"); 
        } else {
            model.addAttribute("mode", "edit"); // "수정" 모드
            model.addAttribute("formAction", "/admin_qna/updateAnswer"); 
        }

        return "admin/qna_write"; 
    }
    // 문의글 삭제 ===========
    @PostMapping("/admin_qna/delete") 
    @ResponseBody 
    public Map<String, Object> deleteQna(@RequestParam("boardNo") int boardNo) {
        Map<String, Object> response = new HashMap<>();
        try {
            adminQnaService.deleteQna(boardNo); 
            response.put("success", true);
            response.put("message", "문의글이 성공적으로 삭제(비활성화)되었습니다.");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "문의글 삭제(비활성화) 중 오류가 발생했습니다: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }
    // 체크박스 문의글 삭제
 	@PostMapping("/admin_qna/check_delete")
 	@ResponseBody
 	public Map<String, Object> checkDelete(@RequestParam("boardNos") List<Integer> boardNos) {
	     Map<String, Object> response = new HashMap<>();
	     try {
	         int updatedCount = adminQnaService.checkDelete(boardNos); 
	         response.put("success", true);
	         response.put("message", updatedCount + "개의 공지가 삭제(비활성화)되었습니다."); 
	     } catch (Exception e) {
	         response.put("success", false);
	         response.put("message", "공지 삭제(비활성화) 처리 중 오류가 발생했습니다: " + e.getMessage());
	         e.printStackTrace();
	     }
	     return response;
 	}
    
    // "새 답변" 모드
    @PostMapping("/admin_qna/saveAnswer")
    public String saveQnaAnswer(@RequestParam("boardNo") int boardNo,
                                @RequestParam("content") String answerContent,
                                RedirectAttributes redirectAttributes) {
        try {
            AdminQnAVO qnaUpdate = new AdminQnAVO();
            qnaUpdate.setBoardNo(boardNo);
            qnaUpdate.setComments(answerContent);
            // 답변 작성 시 상태 변경
            qnaUpdate.setCommState("답변 완료");

            adminQnaService.insertQnaComment(qnaUpdate); 
            redirectAttributes.addFlashAttribute("message", "답변이 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "답변 등록 중 오류가 발생했습니다: " + e.getMessage());
            e.printStackTrace();
        }
        return "redirect:/admin_qna"; // 저장 후 목록 페이지로 redirect
    }

    // "수정" 모드
    @PostMapping("/admin_qna/updateAnswer")
    public String updateQnaAnswer(@RequestParam("boardNo") int boardNo,
                                  @RequestParam("content") String answerContent,
                                  RedirectAttributes redirectAttributes) {
        try {
            AdminQnAVO qnaUpdate = new AdminQnAVO();
            qnaUpdate.setBoardNo(boardNo);
            qnaUpdate.setComments(answerContent);
         // 답변 수정 시 상태 변경
            qnaUpdate.setCommState("답변 완료");

            adminQnaService.uploadQnaComment(qnaUpdate);
            redirectAttributes.addFlashAttribute("message", "답변이 성공적으로 수정되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "답변 수정 중 오류가 발생했습니다: " + e.getMessage());
            e.printStackTrace();
        }
        return "redirect:/admin_qna"; // 저장 후 목록 페이지로 redirect
    }

    // 답변 삭제
    @PostMapping("/admin_qna/deleteAnswer")
    @ResponseBody
    public Map<String, Object> deleteQnaComment(@RequestParam("boardNo") int boardNo) {
        Map<String, Object> response = new HashMap<>();
        try {
            adminQnaService.deleteQnaComment(boardNo); 
            response.put("success", true);
            response.put("message", "답변이 성공적으로 삭제되었습니다. 문의 상태가 '대기'로 변경됩니다.");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "답변 삭제 중 오류가 발생했습니다: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }
    
    // =========== Q&A 컨트롤러 끝 ===========
	
    
	
	// =========== 공지사항 ===========
	// 공지
	@GetMapping("/admin_notice")
    public String adminNoticePage(@RequestParam(defaultValue = "1") int page,
								 @RequestParam(defaultValue = "10") int size,
								 @RequestParam(required = false) String searchField,
								 @RequestParam(required = false) String keyword,
								 @RequestParam(value = "sortOrder", defaultValue = "latest") String sortOrder,
								 Model model) {

		List<AdminNoticeVO> noticeList = adminNoticeService.selectNoticeList(page, size, searchField, keyword, sortOrder);
		int totalCount = adminNoticeService.getNoticeCount(searchField, keyword, sortOrder);
		
		model.addAttribute("noticeList", noticeList);
		model.addAttribute("totalCount", totalCount);
		model.addAttribute("currentPage", page);
		model.addAttribute("pageSize", size);
		model.addAttribute("totalPage", (int) Math.ceil((double) totalCount / size));
		model.addAttribute("searchField", searchField);
		model.addAttribute("keyword", keyword);
		model.addAttribute("sortOrder", sortOrder);
		
		return "admin/boards_notice";
    }
	
	// 공지 글쓰기 페이지로 이동
	@GetMapping("/admin_notice/write")
    public String adminNoticeWritePage() {
        return "admin/notice_write";
    }
	// form 태그 : 새 뉴스 공지 등록
	@PostMapping("/admin_notice/upload") 
	public String insertNotice(AdminNoticeVO notice, RedirectAttributes redirectAttributes) {
	    try {
	        int result = adminNoticeService.insertNotice(notice);
	        if (result > 0) {
	            redirectAttributes.addFlashAttribute("message", "공지가 성공적으로 등록되었습니다!");
	        } else {
	            redirectAttributes.addFlashAttribute("errorMessage", "공지 등록에 실패했습니다...");
	        }
	    } catch (Exception e) {
	        redirectAttributes.addFlashAttribute("errorMessage", "공지 등록 중 오류가 발생했습니다: " + e.getMessage());
	        e.printStackTrace();
	    }
	    return "redirect:/admin_notice";
	}
	// 공지 수정 페이지 - 해당 id 기사
	@GetMapping("/admin_notice/edit/{noticeNo}")
	public String getNoticeById(@PathVariable("noticeNo") int noticeNo, Model model) {
		AdminNoticeVO notice = adminNoticeService.getNoticeById(noticeNo);
		model.addAttribute("notice", notice);
		return "admin/notice_edit";
	}
	
	// form 태그 :  공지 수정
	@PostMapping("/admin_notice/update")
	public String updateNotice(AdminNoticeVO notice, RedirectAttributes redirectAttributes) {
	    try {
	        int result = adminNoticeService.updateNotice(notice);
	        if (result > 0) {
	            redirectAttributes.addFlashAttribute("message", "공지가 수정되었습니다!");
	            return "redirect:/admin_notice";
	        } else {
	            redirectAttributes.addFlashAttribute("errorMessage", "공지 수정에 실패했습니다...");
	            return "redirect:/admin_notice/edit/" + notice.getNoticeNo();
	        }
	    } catch (Exception e) {
	        redirectAttributes.addFlashAttribute("errorMessage", "공지 수정 중 오류가 발생했습니다: " + e.getMessage());
	        e.printStackTrace();
	        return "redirect:/admin_notice";
	    }
	}
	
	// 공지글 삭제
	@PostMapping("/admin_notice/delete")
    @ResponseBody
    public Map<String, Object> deleteNotice(@RequestParam("noticeNos") List<Integer> noticeNos) {
        Map<String, Object> response = new HashMap<>();
        try {
            int updatedCount = adminNoticeService.deleteNotice(noticeNos); 
            response.put("success", true);
            response.put("message", updatedCount + "개의 공지가 삭제(비활성화)되었습니다."); 
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "공지 삭제(비활성화) 처리 중 오류가 발생했습니다: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }
	// =========== 공지사항 컨트롤러 끝 ===========
	
	// =========== 회원 관리 페이지 이동 ===========
	@GetMapping("/admin/members")
    public String adminMemberPage(@RequestParam(defaultValue = "1") int page,
								 @RequestParam(defaultValue = "10") int size,
								 @RequestParam(required = false) String searchField,
								 @RequestParam(required = false) String keyword,
								 @RequestParam(defaultValue = "latest") String sort,
								 Model model) {
		List<AdminMemberVO> memberList = adminMemberService.selectMemberList(page, size, searchField, keyword, sort);
		int count = adminMemberService.getMemberCount(searchField, keyword);
		 
		model.addAttribute("memberList", memberList);
		model.addAttribute("count", count);
		model.addAttribute("currentPage", page);
		model.addAttribute("pageSize", size);
		model.addAttribute("totalPage", (int) Math.ceil((double) count / size));
		model.addAttribute("searchField", searchField);
		model.addAttribute("keyword", keyword);
		
        return "admin/admin_member";
    }
	
	// 회원 상세 정보 페이지
	@GetMapping("/admin/members/{memNo}")
	public String getMemNo(@PathVariable("memNo") int memNo, Model model) {
		AdminMemberVO member = adminMemberService.getMemNo(memNo);
		model.addAttribute("member", member);
		return "admin/member_info";
	}
	
	// =========== 회원 관리 컨트롤러 끝 ===========
	
	
	
	// =========== 관리비 파일 업로드 페이지 이동 ===========
	@GetMapping("/admin/upload")
    public String adminUploadPage() {
        return "admin/admin_upload";
    }
	
	
	// =========== 뉴스룸 ===========
	/***
	@Autowired
	private AdminNewsService adminNewsService;
	
	@GetMapping("/admin_news")
    public String adminNewsPage(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
            @RequestParam(value = "cat", required = false) String cat,
            @RequestParam(value = "searchField", required = false) String searchField,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "sortOrder", defaultValue = "newsNoDesc") String sortOrder, // 기본 정렬: 번호 내림차순
            Model model) {
	    Map<String, Object> resultMap;
	    
	    if("null".equalsIgnoreCase(cat)) cat = null;
	    if("null".equalsIgnoreCase(searchField)) searchField = null;
	    if("null".equalsIgnoreCase(keyword)) keyword = null;
	    
	    // 검색 조건이 있을 경우
	    if ((keyword != null && !keyword.isEmpty()) || (cat != null && !cat.isEmpty())) {
	        String actualSearchField = (searchField == null || searchField.isEmpty()) ? "title_content" : searchField;
	        resultMap = adminNewsService.searchNewsPage(keyword, cat, actualSearchField, page, pageSize, sortOrder);
	    }
	    else if (cat != null && !cat.isEmpty()) {
	        resultMap = adminNewsService.getNewsByCategoryPage(cat, page, pageSize, sortOrder);
	    } else {
	        resultMap = adminNewsService.getNewsPage(page, pageSize, sortOrder);
	    }
	    model.addAllAttributes(resultMap);

	    // 검색 및 카테고리, 정렬 조건 모델에 다시 추가
	    model.addAttribute("cat", cat);
	    model.addAttribute("searchField", searchField);
	    model.addAttribute("keyword", keyword); 
	    model.addAttribute("sortOrder", sortOrder);

	    return "admin/boards_news";
	}

	// 기사 삭제를 위한 POST 요청 처리
	@PostMapping("/admin_news/delete")
    @ResponseBody
    public Map<String, Object> deleteNews(@RequestParam("newsNos") List<Integer> newsNos) {
        Map<String, Object> response = new HashMap<>();
        try {
            int updatedCount = adminNewsService.updateNewsDelYn(newsNos); 
            response.put("success", true);
            response.put("message", updatedCount + "개의 뉴스가 삭제(비활성화)되었습니다."); 
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "뉴스 삭제(비활성화) 처리 중 오류가 발생했습니다: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }
	
	// 기사 작성
	@GetMapping("/admin_news/write")
	public String adminNewsWritePage() {
		return "admin/news_upload";
	}
	// form 태그 : 새 뉴스 기사 등록
	@PostMapping("/admin_news/upload") 
	public String uploadNews( AdminNewsVO newsVO, RedirectAttributes redirectAttributes) {
	    try {
	        int result = adminNewsService.saveNews(newsVO);
	        if (result > 0) {
	            redirectAttributes.addFlashAttribute("message", "기사가 성공적으로 등록되었습니다!");
	        } else {
	            redirectAttributes.addFlashAttribute("errorMessage", "기사 등록에 실패했습니다...");
	        }
	    } catch (Exception e) {
	        redirectAttributes.addFlashAttribute("errorMessage", "기사 등록 중 오류가 발생했습니다: " + e.getMessage());
	        e.printStackTrace();
	    }
	    return "redirect:/admin_news";
	}
	
	// 기사 수정 - 해당 id 기사
	@GetMapping("/admin_news/edit/{newsNo}")
	public String adminNewsEditPage(@PathVariable("newsNo") int newsNo, Model model) {
		AdminNewsVO newsVO = adminNewsService.getNewsById(newsNo);
		model.addAttribute("news", newsVO);
		return "admin/news_edit";
	}
	
	// 기사 수정
	@PostMapping("/admin_news/update")
	public String updateNews( AdminNewsVO newsVO, RedirectAttributes redirectAttributes) {
	    try {
	        int result = adminNewsService.updateNews(newsVO);
	        if (result > 0) {
	            redirectAttributes.addFlashAttribute("message", "기사가 수정되었습니다!");
	            return "redirect:/admin_news";
	        } else {
	            redirectAttributes.addFlashAttribute("errorMessage", "기사 수정에 실패했습니다...");
	            return "redirect:/admin_news/edit/" + newsVO.getNewsNo();
	        }
	    } catch (Exception e) {
	        redirectAttributes.addFlashAttribute("errorMessage", "기사 수정 중 오류가 발생했습니다: " + e.getMessage());
	        e.printStackTrace();
	        return "redirect:/admin_news";
	    }
	}
	***/
	// =========== 뉴스룸 컨트롤러 끝 ===========
	
}