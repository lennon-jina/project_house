package com.house.team.mypage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.mypage.vo.RefundDetail;

@Mapper
public interface RefundMapper {
	
	List<RefundDetail> selectRsvChgBetween(
		@Param("cmpxCd") String cmpxCd,
		@Param("start") String start,
		@Param("end") String end
	);
}
