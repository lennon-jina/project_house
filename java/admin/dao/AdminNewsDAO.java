package com.house.team.admin.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.admin.vo.AdminNewsVO;


@Mapper
public interface AdminNewsDAO {
	// 전체 뉴스 페이징 조회
    List<AdminNewsVO> selectNewsPage(@Param("offset") int offset, 
    								 @Param("pageSize") int pageSize,
    								 @Param("sortOrder") String sortOrder);

    // 전체 뉴스 수
    int selectNewsCount();

    // 카테고리별 페이징
    List<AdminNewsVO> selectNewsByCategoryPage(@Param("category") String category,
                                          	   @Param("offset") int offset,
                                          	   @Param("pageSize") int pageSize,
                                          	   @Param("sortOrder") String sortOrder);

    // 카테고리별 뉴스 수
    int countNewsByCategory(@Param("category") String category);

    // 카테고리+키워드검색 페이징
    List<AdminNewsVO> searchNewsPage(Map<String, Object> paramMap);

    // 키워드 검색 결과 수
    int countSearchNews(Map<String, Object> paramMap); 
    
    // 뉴스 삭제
    int updateNewsDelYnToY(@Param("newsNos") List<Integer> newsNos);
    
    // 새 뉴스 등록
    int insertNews(AdminNewsVO newsVO);
    
    // 뉴스 넘버 조회
    AdminNewsVO getNewsById(@Param("newsNo") int newsNo);
    
    // 뉴스 정보 업데이트
    int updateNews(AdminNewsVO news);
    
    
    
}
