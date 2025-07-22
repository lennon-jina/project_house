package com.house.team.stats.dao;

import java.util.List;

import com.house.team.stats.vo.AREAInfoVO;

public interface IAREAInfoDAO {
	
	// 특정 아파트의 면적 정보 조회
    List<AREAInfoVO> getAreaInfoByCmpxCd(String cmpxCd);
    
    // 특정 아파트의 가장 많은 세대수를 가진 면적 정보 조회
    AREAInfoVO getMainAreaInfo(String cmpxCd);
    
}
