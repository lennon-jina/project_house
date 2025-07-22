package com.house.team.admin.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.admin.dao.AdminNewsDAO;
import com.house.team.admin.vo.AdminNewsVO;

@Service
public class AdminNewsService {
	@Autowired
	private AdminNewsDAO adminNewsDAO;

	// 공통 페이징 결과 구성
	private Map<String, Object> buildPagingResult(List<AdminNewsVO> newsList, int totalCount, int page, int pageSize) {
	    int totalPages = (int) Math.ceil((double) totalCount / pageSize);
	    // totalPages가 0일 경우 최소 1로 설정 (게시물이 없어도 페이지 번호는 최소 1이 되도록)
	    if (totalPages == 0 && totalCount == 0) { //
	        totalPages = 1; //
	    } else if (totalPages == 0 && totalCount > 0){ //
	        totalPages = 1; //
	    }

	    Map<String, Object> result = new HashMap<>(); //
	    result.put("newsList", newsList); //
	    result.put("totalPages", totalPages); //
	    result.put("currentPage", page); //
	    result.put("totalCount", totalCount); //
	    return result; //
	}

	// 뉴스 페이징 (정렬 순서 파라미터 추가)
	public Map<String, Object> getNewsPage(int page, int pageSize, String sortOrder){ //
		int offset = (page-1)*pageSize; //
		List<AdminNewsVO> newsList = adminNewsDAO.selectNewsPage(offset, pageSize, sortOrder); //
		int totalCount = adminNewsDAO.selectNewsCount(); //

		return buildPagingResult(newsList, totalCount, page, pageSize); //
	}

	// 카테고리 기반 뉴스 페이징 (정렬 순서 파라미터 추가)
	public Map<String, Object> getNewsByCategoryPage(String category, int page, int pageSize, String sortOrder) { //
	    int offset = (page - 1) * pageSize; //
	    List<AdminNewsVO> newsList = adminNewsDAO.selectNewsByCategoryPage(category, offset, pageSize, sortOrder); //
	    int totalCount = adminNewsDAO.countNewsByCategory(category); //

	    return buildPagingResult(newsList, totalCount, page, pageSize); //
	}

	// 키워드 + 카테고리 검색 뉴스 페이징
	public Map<String, Object> searchNewsPage(String keyword, String category,
											      String searchField, int page, int pageSize, String sortOrder) { //
		int offset = (page - 1) * pageSize; //
		// int endRow = offset + pageSize; // ROWNUM 방식 사용 시 필요

	    Map<String, Object> paramMap = new HashMap<>(); //
	    paramMap.put("keyword", keyword); //
	    paramMap.put("category", category); //
	    paramMap.put("searchField", searchField); //
	    paramMap.put("offset", offset); //
	    paramMap.put("pageSize", pageSize); // FETCH NEXT ROWS ONLY에 사용
	    paramMap.put("sortOrder", sortOrder); //
	    // paramMap.put("endRow", endRow); // ROWNUM 방식 사용 시 필요


	    List<AdminNewsVO> newsList = adminNewsDAO.searchNewsPage(paramMap); //
	    int totalCount = adminNewsDAO.countSearchNews(paramMap); //
	    return buildPagingResult(newsList, totalCount, page, pageSize); //
	}

	// 뉴스 삭제
	public int updateNewsDelYn(List<Integer> newsNos) {
		return adminNewsDAO.updateNewsDelYnToY(newsNos); 
	}
	
	// 뉴스 등록
	public int saveNews(AdminNewsVO newsVO) {
		return adminNewsDAO.insertNews(newsVO);
	}
	
	// 뉴스 넘버 조회
    public AdminNewsVO getNewsById(int newsNo) {
        return adminNewsDAO.getNewsById(newsNo);
    }

    // 뉴스 수정
    public int updateNews(AdminNewsVO newsVO) {
		return adminNewsDAO.updateNews(newsVO);
	}
}