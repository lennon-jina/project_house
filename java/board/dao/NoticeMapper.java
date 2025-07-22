package com.house.team.board.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.hibernate.annotations.Parent;

import com.house.team.board.vo.NoticeVO;

@Mapper
public interface NoticeMapper {
	List<NoticeVO> selectNoticeList(@Param("offset") int offset,
								 @Param("size") int size,
								 @Param("searchField") String searchField,
								 @Param("keyword") String keyword,
								 @Param("sort") String sort);
	
	
	int getNoticeCount(@Param("searchField") String searchField,
					   @Param("keyword") String keyword);
	
	NoticeVO getNoticeById(@Param("noticeNo") int noticeNo);
	
	void incrementViewCnt(int noticeNo);
}
