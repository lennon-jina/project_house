package com.house.team.board.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.board.dao.QnaMapper;
import com.house.team.board.vo.QnaVO;

@Service
public class QnaService {
	
	@Autowired
	private QnaMapper qnaMapper;
	
	public List<QnaVO> getQnaList(int page, int size, String searchField, String kewword) {
		int start = (page - 1) * size + 1;
		int end = page * size;
		return qnaMapper.getQnaList(start, end, searchField, kewword);
	}
	
	public int getQnaCount(String searchField, String keyword) {
		return qnaMapper.getQnaCount(searchField, keyword);
	}
	
	public void insertQna(QnaVO qnaVo) {
		qnaMapper.insertQna(qnaVo);
	}
	
	public QnaVO getQnaByBoardNo(int boardNo) {
		return qnaMapper.selectQnaByBoardNo(boardNo);
	}
	
	public void correctionQna(QnaVO qnaVo) {
		qnaMapper.correctionQna(qnaVo);
	}
	
	public void deleteQua(int boardNo) {
		qnaMapper.deleteQna(boardNo);
	}
	
	// 조회수 증가
	public void incrementRateCnt(int boardNo) {
		qnaMapper.incrementRateCnt(boardNo);
	}
}
