package com.house.team.admin.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.admin.dao.IAdminMemberDAO;
import com.house.team.admin.vo.AdminMemberVO;
import com.house.team.admin.vo.MemberBookmarkVO;

@Service
public class AdminMemberService {
	
	@Autowired
	private IAdminMemberDAO adminMemberDAO; 
	
	// 가입 회원 리스트
	public List<AdminMemberVO> selectMemberList(int page,int size, String searchField,
								    	 		String keyword, String sort){
		int offset = (page - 1) * size;
		return adminMemberDAO.selectMemberList(offset, size, searchField, keyword, sort);
	}
	 
	// 검색 결과 수 
	public int getMemberCount(String searchField, String keyword) {
		return adminMemberDAO.getMemberCount(searchField, keyword);
	}
	
	// 회원 상세 정보
	public AdminMemberVO getMemNo(int memNo) {
		AdminMemberVO member = adminMemberDAO.getMemNo(memNo);
		if (member != null) {
			List<MemberBookmarkVO> bmList = adminMemberDAO.selectMemBM(memNo);
			member.setBmList(bmList);
		}
		return member;
	}
	
}
