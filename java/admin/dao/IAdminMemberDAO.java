package com.house.team.admin.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.admin.vo.AdminMemberVO;
import com.house.team.admin.vo.MemberBookmarkVO;

@Mapper
public interface IAdminMemberDAO {
	
	// 가입 회원 리스트
	List<AdminMemberVO> selectMemberList(@Param("offset") int offset, @Param("size") int size,
								    	@Param("searchField") String searchField,
								    	@Param("keyword") String keyword,
								    	@Param("sort") String sort);
	 
	// 검색 결과 수 
	int getMemberCount(@Param("searchField") String searchField,@Param("keyword") String keyword);
	
	// 회원 상세 정보
	AdminMemberVO getMemNo(@Param("memNo") int memNo);
	
	// 회원 건물 즐겨찾기 정보
	List<MemberBookmarkVO> selectMemBM(int memNo);
	
}
