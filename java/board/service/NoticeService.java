package com.house.team.board.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.board.dao.NoticeMapper;
import com.house.team.board.vo.NoticeVO;

@Service
public class NoticeService {
	
	@Autowired
	private NoticeMapper noticeMapper;
	
	public List<NoticeVO> getNoticesList(int page, int size, String searchField, String keyword, String sort) {
		int offset = (page - 1) * size;
		return noticeMapper.selectNoticeList(offset, size, searchField, keyword, sort);
	}
	
	public int getNoticeCount(String searchField, String keyword) {
		return noticeMapper.getNoticeCount(searchField, keyword);
	}
	
	public NoticeVO getNoticeById(int noticeNo) {
		return noticeMapper.getNoticeById(noticeNo);
	}
	
	public void incrementViewCnt(int noticeNo) {
		noticeMapper.incrementViewCnt(noticeNo);
	}
} 
