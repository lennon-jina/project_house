package com.house.team.management.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.house.team.management.vo.IManVO;
@Mapper
public interface IManDAO  {
	IManVO selectExpenseByCmpxCd (String cmpxCd);
	
	
	List<IManVO> selectwoExpenses(String cmpxCd);
    
}
