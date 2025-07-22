package com.house.team.mypage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.house.team.management.vo.IManVO;
import com.house.team.mypage.vo.MypageVo;

@Mapper
public interface IMypageDAO {
	//회원번호를 기준으로 즐겨찾기한 단지 목록 조회
	 List<MypageVo> selectbookmarker(int memNo);
	 
	 // 2. 최근 2개월 관리비 조회
	 List<MypageVo> selectM(String cmpxCd);
	 
	 
	 List<IManVO> selectwoExpenses(String cmpxCd);
}



