package com.house.team.admin.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.house.team.admin.vo.AdminViewCountVO;

@Mapper
public interface IViewCountDAO {
	
	// 게시글 조회 시, 로그 저장
	void insertViewLog(AdminViewCountVO viewLog);
	
	// 월별 조회수
	List<AdminViewCountVO> getMonthlyBoardViewCounts();
	
	// 요일별 조회수
	List<Map<String, Object>> getWeeklyViewCounts();
}
