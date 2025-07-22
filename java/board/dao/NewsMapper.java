package com.house.team.board.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.board.vo.NewsVO;

@Mapper
public interface NewsMapper {
	
	// 전체 뉴스 페이징 조회
    List<NewsVO> selectNewsPage(@Param("offset") int offset, 
    							@Param("pageSize") int pageSize);

    // 전체 뉴스 수
    int selectNewsCount();

    // 카테고리 기반 뉴스 페이징 조회
    List<NewsVO> selectNewsByCategoryPage(@Param("category") String category,
                                          @Param("offset") int offset,
                                          @Param("pageSize") int pageSize);

    // 카테고리별 뉴스 수
    int countNewsByCategory(@Param("category") String category);

    // 키워드 + 카테고리 검색 페이징
    List<NewsVO> searchNewsPage(@Param("keyword") String keyword,
    							 @Param("searchField") String searchField,
                                 @Param("category") String category,
                                 @Param("offset") int offset,
                                 @Param("pageSize") int pageSize);

    // 키워드 검색 결과 수
    int countSearchNews(@Param("keyword") String keyword,
    					@Param("searchField") String searchField,
                        @Param("category") String category);
    
    
    List<NewsVO> searchNewsPage(Map<String, Object> paramMap);
    int countSearchNews(Map<String, Object> paramMap);
    NewsVO selectedNewsById(Long id);
    
    // 조회수 증가
 	void incrementViewCnt(int newsNo);
}
