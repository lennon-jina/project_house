package com.house.team.admin.service;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.house.team.admin.dao.IViewCountDAO;
import com.house.team.admin.vo.AdminViewCountVO;

@Service
public class ViewCountService {
	
	@Autowired
	private IViewCountDAO viewCountDAO;
	
	// 게시글 조회 시, 로그 저장
	@Transactional
	public void logBoardView(String boardCategory, Integer memNo, long boardNo) { 
        int actualMemNo;
        if (memNo != null) {
            actualMemNo = memNo.intValue(); 
        } else {
            actualMemNo = 0; 
        }

		AdminViewCountVO newViewLog = new AdminViewCountVO(boardCategory, actualMemNo, boardNo);
		viewCountDAO.insertViewLog(newViewLog); 

        System.out.println("조회 로그가 성공적으로 기록되었습니다: " + newViewLog.toString());
	}
	// 월별 조회수
	public List<AdminViewCountVO> getMonthlyBoardViewCounts(){
		return viewCountDAO.getMonthlyBoardViewCounts();
	}
	
	// 요일별 조회수
	public List<Map<String, Object>> getWeeklyViewCounts(){
		return viewCountDAO.getWeeklyViewCounts();
	}
	
}
