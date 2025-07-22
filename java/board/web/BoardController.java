package com.house.team.board.web;

import java.net.http.HttpHeaders;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.house.team.admin.service.ViewCountService;
import com.house.team.board.service.NewsService;
import com.house.team.board.service.NoticeService;
import com.house.team.board.service.PoliciesService;
import com.house.team.board.service.QnaService;
import com.house.team.board.vo.NewsVO;
import com.house.team.board.vo.NoticeVO;
import com.house.team.board.vo.PoliciesVO;
import com.house.team.board.vo.QnaVO;

import jakarta.servlet.http.HttpSession;

@Controller
public class BoardController {
	
	@Autowired
	private NewsService newsService;
	
	@Autowired
	private PoliciesService policiesService;
	
	@Autowired
	private QnaService qnaService;
	
	@Autowired
	private NoticeService noticeService;
	
	@Autowired
	private ViewCountService viewCountService;
	
    @GetMapping("/news")
    public String newsList(HttpSession session, RedirectAttributes redirectAttributes,
    					   @RequestParam(required = false) String keyword,
    					   @RequestParam(required = false) String searchField,
    					   @RequestParam(required = false) String cat,
    					   @RequestParam(defaultValue = "1") int page,
    					   @RequestParam(defaultValue = "4") int pageSize,
    					   Model model) {
    	   	
    	
    	if (searchField == null || searchField.trim().isEmpty()) {
            searchField = "";
        }
    	
    	Map<String, Object> data;
    	// 키워드 검색 우선 처리
    	if (keyword != null && !keyword.trim().isEmpty()) {
    		data = newsService.searchNewsPage(keyword, cat, searchField, page, pageSize);
    	} 
    	// 카테고리만 선택된 경우
    	else if (cat != null && !cat.trim().isEmpty()) {
    		data = newsService.getNewsByCategoryPage(cat, page, pageSize);
    	}
    	// 전체 뉴스
    	else {
    		data = newsService.getNewsPage(page, pageSize);
    	}
    	
    	if (keyword == null) keyword = "";
        if (cat == null) cat = "";
       
    	model.addAttribute("newsList", data.get("newsList"));
        model.addAttribute("totalPages", data.get("totalPages"));
        model.addAttribute("currentPage", data.get("currentPage"));
        model.addAttribute("totalCount", data.get("totalCount"));
        
        // 선택된 카테고리/키워드 유지
        model.addAttribute("keyword", keyword);
        model.addAttribute("cat", cat);
        model.addAttribute("searchField", searchField);
        
        // 정책 요약 리스트도 함께 추가
        List<PoliciesVO> policies = policiesService.fetchRecentPolicies(6);
        model.addAttribute("policies", policies);
        return "board/news";
    }
    @GetMapping("/news/detail/{id}")
    public String newsDetail(@PathVariable("id") Long id, Model model,HttpSession session, RedirectAttributes redirectAttributes) {
    	
    	newsService.incrementViewCnt(id.intValue());
    	NewsVO news = newsService.selectNewsById(id);
    	model.addAttribute("news", news);
    	   
    	return "board/news_view";
    }
    
    @GetMapping("/policies")
    public String showPolicies(
    		HttpSession session, RedirectAttributes redirectAttributes,
    		@RequestParam(name = "searchField", required = false) String searchField,
    		@RequestParam(name = "keyword", required = false) String keyword,
    		@RequestParam(name = "page", defaultValue = "1") int page,
    		Model model) {
    	
    	
    	LocalDate today = LocalDate.now();
    	LocalDate startDate = today.minusDays(3);
    	LocalDate endDate = today.minusDays(1);
    	// 전체 데이터 호춣    	
    	List<PoliciesVO> policies = policiesService.fetchPolicyNews(1, Integer.MAX_VALUE, startDate, endDate);
    	// 검색 필터 적용
    	List<PoliciesVO> filteredPolicies;
    	if(keyword != null && !keyword.isEmpty()) {
    		String lowerKeyword = keyword.toLowerCase();
    		
    		filteredPolicies = policies.stream()
    	    	.filter(p -> {
    	        	if ("title".equalsIgnoreCase(searchField)) {
    	        		return p.getTitle().toLowerCase().contains(lowerKeyword);
    	         	} else if ("content".equalsIgnoreCase(searchField)) {
    	            	return p.getContent().toLowerCase().contains(lowerKeyword);
    	            	} else {
    	            	// 전체 (제목 + 내용)
    	            	return p.getTitle().toLowerCase().contains(lowerKeyword) ||
    	                       p.getContent().toLowerCase().contains(lowerKeyword);
    	            }
    	        })
    	        .toList();
    	    } else {
    	    	// 검색이 없으면 전체
    	        filteredPolicies = policies;
    	    }
    	
    	int pageSize = 6;
    	int totalCount = filteredPolicies.size();
    	int totalPages = (int) Math.ceil((double) totalCount / pageSize);
    	int fromIndex = (page - 1) * pageSize;
    	int toIndex = Math.min(fromIndex + pageSize, totalCount);
    	List<PoliciesVO> pageList = (fromIndex > totalCount) ? List.of() : filteredPolicies.subList(fromIndex, toIndex);
    	
    	model.addAttribute("policies", pageList);
    	model.addAttribute("currentPage", page);
    	model.addAttribute("totalCount", totalCount);
    	model.addAttribute("totalPages", totalPages);
    	model.addAttribute("keyword", keyword);
    	model.addAttribute("searchField", searchField);
    	
        return "board/policies";
    }
    
    @GetMapping("/policies/detail")
    public String policyDetail(@RequestParam("url") String url, Model model, HttpSession session, RedirectAttributes redirectAttributes) {
    	
    	
    	LocalDate today = LocalDate.now();
    	LocalDate startDate = today.minusDays(3);
    	LocalDate endDate = today.minusDays(1);
    	
    	List<PoliciesVO> policies = policiesService.fetchPolicyNews(1, Integer.MAX_VALUE, startDate, endDate);
    	
    	PoliciesVO selected = policies.stream()
    		.filter(p -> url.equals(p.getNewsUrl()))
    		.findFirst()
    		.orElse(null);
        
    	if (selected == null) {
    		return "redirect:/policies";
    	}
    	
    	model.addAttribute("policy", selected);

        return "board/policies_view";
    }
    
    @GetMapping("/notice")
    public String noticePage(HttpSession session, RedirectAttributes redirectAttributes,
    						 @RequestParam(defaultValue = "1") int page,
    						 @RequestParam(defaultValue = "10") int size,
    						 @RequestParam(required = false, defaultValue = "title_content") String searchField,
    						 @RequestParam(required = false, defaultValue = "") String keyword,
    						 @RequestParam(defaultValue = "latest") String sort,
    						 Model model) {
    	
    	if (keyword != null && keyword.trim().isEmpty()) {
    	    keyword = null;
    	}
    	
    	List<NoticeVO> noticeList = noticeService.getNoticesList(page, size, searchField, keyword, sort);
    	int totalCount = noticeService.getNoticeCount(searchField, keyword);

        model.addAttribute("noticeList", noticeList);
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", size);
        model.addAttribute("totalPage", (int) Math.ceil((double) totalCount / size));
        model.addAttribute("searchField", searchField);
        model.addAttribute("keyword", keyword);

        return "board/notice";
    }
    
    @GetMapping("/notice_view/{noticeNo}")
    public String noticeview(@PathVariable int noticeNo, Model model, HttpSession session, RedirectAttributes redirectAttributes) {
    	noticeService.incrementViewCnt(noticeNo);
    	NoticeVO notice = noticeService.getNoticeById(noticeNo);
    	model.addAttribute("notice", notice);
    	
    	// ==== 조회 로그 서비스 호출 ====
        // 세션에서 회원 번호 가져오기 
    	
        // ==============================
        
    	return "board/notice_view";
    }
    
    @GetMapping("/faq")
    public String faqPage(HttpSession session, RedirectAttributes redirectAttributes) {
    	
        return "board/faq";
    }  
    
    @GetMapping("/qa")
    public String list(@RequestParam(defaultValue = "1") int page,
    				   @RequestParam(defaultValue = "10") int size,
    				   @RequestParam(required = false) String searchField,
    				   @RequestParam(required = false) String keyword,
    				   Model model, HttpSession session, RedirectAttributes redirectAttributes) {
    	
    	
    	List<QnaVO> list = qnaService.getQnaList(page, size, searchField, keyword);
    	int totalCount = qnaService.getQnaCount(searchField, keyword);
    	int totalPage = (int) Math.ceil((double) totalCount / size);
    	
    	model.addAttribute("qaList", list);
        model.addAttribute("totalCount", totalCount);
        model.addAttribute("currentPage", page);
        model.addAttribute("pageSize", size);
        model.addAttribute("totalPage", totalPage);
        model.addAttribute("searchField", searchField);
        model.addAttribute("keyword", keyword);
        model.addAttribute("loggedInMemNo", session.getAttribute("memNo")); 
        
        return "board/qa";
    }
    
    @GetMapping("/qa/{boardNo}")
    public String getQnaDetail(@PathVariable("boardNo") int boardNo, Model model, HttpSession session, RedirectAttributes redirectAttributes) {
    	qnaService.incrementRateCnt(boardNo);
    	QnaVO qna = qnaService.getQnaByBoardNo(boardNo);
    	if (qna == null) {
    		return "redirect:/qa";
    	}
    	model.addAttribute("qna", qna);
    	
    	// ==== 조회 로그 서비스 호출 ====
    	Long loggedInMemNoLong = (Long) session.getAttribute("memNo");
    	if (loggedInMemNoLong == null) {
    		redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
    		return "redirect:/login";
    	}
    	Integer loggedInMemNo = null;
    	if (loggedInMemNoLong != null) {
    		loggedInMemNo = loggedInMemNoLong.intValue();
    	}
    	
    	
    	 model.addAttribute("loggedInMemNo", loggedInMemNoLong); 
        try {
            viewCountService.logBoardView("Q&A", loggedInMemNo, (long) boardNo); 
            System.out.println("Q&A 조회 로그 기록 완료: boardNo=" + boardNo + ", MemNo=" + loggedInMemNo);
        } catch (Exception e) {
            System.err.println("Q&A 조회 로그 기록 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
        // ==============================
    	
        return "board/qa_view";
    }
    
    @GetMapping("/qa_write")
    public String showWriteForm(HttpSession session, RedirectAttributes redirectAttributes, Model model) {
        Long memNo = (Long) session.getAttribute("memNo");
        if (memNo == null) {
            return "redirect:/login";
        }
        model.addAttribute("qna", new QnaVO());
        return "board/qa_write";
    }
    
    @PostMapping("/qa_write")
    public String submitWriteForm(@ModelAttribute QnaVO qnaVO, HttpSession session) {
        Long memNo = (Long) session.getAttribute("memNo");
        qnaVO.setMemNo(memNo);

        // null 체크 및 기본값 설정
        if (qnaVO.getPostPw() == null || qnaVO.getPostPw().trim().isEmpty()) {
            qnaVO.setPostPw("");  // 혹은 " " 같은 기본값
        }

        qnaService.insertQna(qnaVO);
        return "redirect:/qa";
    }
    //수정
    @GetMapping("/qa_correction/{boardNo}")
    public String showCorrectionForm(@PathVariable int boardNo, Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        QnaVO qna = qnaService.getQnaByBoardNo(boardNo);
        Long sessionMemNo = (Long) session.getAttribute("memNo");
    	if (sessionMemNo == null) {
    		redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
    		return "redirect:/login";
    	}
        if (qna == null || sessionMemNo == null || !sessionMemNo.equals(qna.getMemNo())) {
            // 권한 없을 때
            redirectAttributes.addFlashAttribute("error", "수정 권한이 없습니다.");
            return "redirect:/qa";
        }

        model.addAttribute("qna", qna);
        return "board/qa_correction";
    }

    @PostMapping("/qa_correction")
    public String correctionQna(@ModelAttribute("qna") QnaVO qna, HttpSession session, RedirectAttributes redirectAttributes) {
        Long sessionMemNo = (Long) session.getAttribute("memNo");

        QnaVO original = qnaService.getQnaByBoardNo(qna.getBoardNo());
        if (original == null || sessionMemNo == null || !sessionMemNo.equals(original.getMemNo())) {
            redirectAttributes.addFlashAttribute("error", "수정 권한이 없습니다.");
            return "redirect:/qa/" + qna.getBoardNo();
        }

        qnaService.correctionQna(qna);
        redirectAttributes.addFlashAttribute("message", "게시글이 성공적으로 수정되었습니다.");
        return "redirect:/qa/" + qna.getBoardNo();
    }
    
    @GetMapping("/qa/delete/{boardNo}")
    public String deleteQna(@PathVariable int boardNo, HttpSession session, RedirectAttributes redirectAttributes) {
        Long sessionMemNo = (Long) session.getAttribute("memNo");
        if (sessionMemNo == null) {
            redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
            return "redirect:/login";
        }

        QnaVO qna = qnaService.getQnaByBoardNo(boardNo);
        if (qna == null) {
            redirectAttributes.addFlashAttribute("error", "게시글이 존재하지 않습니다.");
            return "redirect:/qa";
        }

        // 작성자 본인 또는 관리자(memNo == 1)만 삭제 가능
        if (!sessionMemNo.equals(qna.getMemNo()) && sessionMemNo != 1L) {
            redirectAttributes.addFlashAttribute("error", "삭제 권한이 없습니다.");
            return "redirect:/qa";
        }

        qnaService.deleteQua(boardNo);
        redirectAttributes.addFlashAttribute("message", "게시글이 성공적으로 삭제되었습니다.");
        return "redirect:/qa";
    }
    
    
}
