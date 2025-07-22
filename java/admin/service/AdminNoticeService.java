package com.house.team.admin.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.admin.dao.IAdminNoticeDAO;
import com.house.team.admin.vo.AdminNoticeVO;

@Service
public class AdminNoticeService {
	@Autowired
	private IAdminNoticeDAO IAdminNoticeDAO;
	
	// 공지글 리스트
	public List<AdminNoticeVO> selectNoticeList(int page, int size,
						 					String searchField, String keyword, String sortOrder){
		int offset = (page - 1) * size;
		
		return IAdminNoticeDAO.selectNoticeList(offset, size, searchField, keyword, sortOrder);
	}
	
	// 검색 조건에 따른 리스트 반환
	public int getNoticeCount(String searchField, String keyword, String sortOrder) {
		return IAdminNoticeDAO.getNoticeCount(searchField, keyword, sortOrder);
	}
	
	// 상세 공지글
	public AdminNoticeVO getNoticeById(int noticeNo) {
		return IAdminNoticeDAO.getNoticeById(noticeNo);
		
	}
	
	// 새 글 작성
	public int insertNotice(AdminNoticeVO notice) {
		Date now = new Date();
        notice.setCreateDt(now);
        notice.setUpdateDt(now);
		return IAdminNoticeDAO.insertNotice(notice);
	}
	
	// 글 수정
	public int updateNotice(AdminNoticeVO notice) {
		return IAdminNoticeDAO.updateNotice(notice);
	}
	
	// 글 삭제
	public int deleteNotice(List<Integer> noticeNos) {
		return IAdminNoticeDAO.deleteNotice(noticeNos);
	}
	

}
