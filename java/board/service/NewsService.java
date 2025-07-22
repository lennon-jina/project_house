package com.house.team.board.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.board.dao.NewsMapper;
import com.house.team.board.vo.NewsVO;

@Service
public class NewsService {
	@Autowired
	private NewsMapper newsMapper;
	
	// 전체 뉴스 페이징
	public Map<String, Object> getNewsPage(int page, int pageSize) {
	    int offset = (page - 1) * pageSize;
	    List<NewsVO> newsList = newsMapper.selectNewsPage(offset, pageSize);
	    int totalCount = newsMapper.selectNewsCount();

	    return buildPagingResult(newsList, totalCount, page, pageSize);
	}

	// 카테고리 기반 뉴스 페이징
	public Map<String, Object> getNewsByCategoryPage(String category, int page, int pageSize) {
	    int offset = (page - 1) * pageSize;
	    List<NewsVO> newsList = newsMapper.selectNewsByCategoryPage(category, offset, pageSize);
	    int totalCount = newsMapper.countNewsByCategory(category);

	    return buildPagingResult(newsList, totalCount, page, pageSize);
	}

	// 키워드 + 카테고리 검색 뉴스 페이징
	public Map<String, Object> searchNewsPage(String keyword, String category, String searchField, int page, int pageSize) {
		int offset = (page - 1) * pageSize;
		int endRow = offset + pageSize;

	    Map<String, Object> paramMap = new HashMap<>();
	    paramMap.put("keyword", keyword);
	    paramMap.put("category", category);
	    paramMap.put("searchField", searchField);
	    paramMap.put("offset", offset);
	    paramMap.put("limit", pageSize);
	    paramMap.put("endRow", endRow);

	    List<NewsVO> newsList = newsMapper.searchNewsPage(paramMap);
	    int totalCount = newsMapper.countSearchNews(paramMap);
	    return buildPagingResult(newsList, totalCount, page, pageSize);
	}

	// 공통 페이징 결과 구성
	private Map<String, Object> buildPagingResult(List<NewsVO> newsList, int totalCount, int page, int pageSize) {
	    int totalPages = (int) Math.ceil((double) totalCount / pageSize);
	    Map<String, Object> result = new HashMap<>();
	    result.put("newsList", newsList);
	    result.put("totalPages", totalPages);
	    result.put("currentPage", page);
	    result.put("totalCount", totalCount);
	    return result;
	}
	// 뉴스 상세보기
	public NewsVO selectNewsById(Long id) {
		return newsMapper.selectedNewsById(id);
	}
	
	// 조회수 증가
	public void incrementViewCnt(int newsNo) {
		newsMapper.incrementViewCnt(newsNo);
	}
}
