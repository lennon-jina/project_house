package com.house.team.admin.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.admin.vo.AdminQnAVO;

@Mapper
public interface IAdminQnADAO {
	
	// 문의글 로드 및 페이징
	List<AdminQnAVO> getQnaList(@Param("start") int start,
								@Param("end") int end,
								@Param("searchField") String searchField,
								@Param("keyword") String keyword,
								@Param("sortOrder") String sortOrder);
	
	// 키워드별 검색 결과
	int getQnaCount(@Param("searchField") String searchField,
					@Param("keyword") String keyword,
					@Param("sortOrder") String sortOrder);
	
	// 문의글 상세 페이지로 이동하기 위한 boardNo 가져오기
	AdminQnAVO getQnaById(@Param("boardNo") int boardNo);
	
	// 문의글 삭제
	void deleteQna(@Param("boardNo") int boardNo);
	
	// 체크박스 문의글 삭제
	int checkDelete(@Param("boardNos") List<Integer> boardNos);
	
	
	// ========= 답변 =========
    // 답변 작성 또는 수정 
    void updateQnaAnswer(AdminQnAVO adminQnAVO);

    // 답변 삭제 
    void clearQnaAnswer(@Param("boardNo") int boardNo);
 	
 	// 대기중인 문의글 목록
 	List<AdminQnAVO> noCommList(@Param("start") int start, @Param("end") int end);
 	int getNoCommCount();
}
