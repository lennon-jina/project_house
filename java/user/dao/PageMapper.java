package com.house.team.user.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.stats.vo.APTInfoVO;

@Mapper
public interface PageMapper {

    List<String> selectSigunguList();

    List<String> selectDongList(@Param("sigungu") String sigungu);

    List<APTInfoVO> selectAptList(@Param("sigungu") String sigungu, @Param("dong") String dong);	
}
