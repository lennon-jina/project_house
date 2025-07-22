package com.house.team.admin.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.admin.vo.AdminNoticeVO;

@Mapper
public interface IAdminNoticeDAO {
	// 공지글 리스트
	List<AdminNoticeVO> selectNoticeList(@Param("offset") int offset,
								    @Param("size") int size,
								    @Param("searchField") String searchField,
								    @Param("keyword") String keyword,
							     	@Param("sortOrder") String sortOrder);
	 
	// 검색 결과 수 
	int getNoticeCount(@Param("searchField") String searchField,
					   @Param("keyword") String keyword,
					   @Param("sortOrder") String sortOrder);
	
	// 상세 공지글
	AdminNoticeVO getNoticeById(@Param("noticeNo") int noticeNo);
	
	// 새 글 작성
	int insertNotice(AdminNoticeVO notice);
	// 글 수정
	int updateNotice(AdminNoticeVO notice);
	// 글 삭제
	int deleteNotice(@Param("noticeNos") List<Integer> noticeNos);
}

