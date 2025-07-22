package com.house.team.board.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.board.vo.QnaVO;
@Mapper
public interface QnaMapper {
	List<QnaVO> getQnaList(@Param("start") int start,
						   @Param("end") int end,
						   @Param("searchField") String searchField,
						   @Param("keyword") String keyword);
	
	int getQnaCount(@Param("searchField") String searchField,
					@Param("keyword") String keyword);
	
	void insertQna(QnaVO qnaVo);
	
	QnaVO selectQnaByBoardNo(int boardNo);
	
	void correctionQna(QnaVO qnaVO);
	
	void deleteQna(int boardNo);
	
	// 조회수 증가
	void incrementRateCnt(int boardNo);
}
