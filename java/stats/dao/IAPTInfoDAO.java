package com.house.team.stats.dao;

import java.util.List;
import java.util.Map;

import com.house.team.stats.vo.APTInfoVO;
import com.house.team.stats.vo.ElectricAreaVO;
import com.house.team.stats.vo.ElectricTrendVO;
import com.house.team.stats.vo.SeasonalElectricVO;

public interface IAPTInfoDAO {
	
	// 기준 아파트 정보 조회
    APTInfoVO getBaseApartmentInfo(String cmpxCd);
    
    // 유사한 아파트 목록 조회
    List<APTInfoVO> getSimilarApartments(String baseCmpxCd);
    
    // 전체 아파트 목록 조회
    List<APTInfoVO> getAllApartments();
    
    // 연도별 전기료 트렌드 분석 데이터 조회
    List<ElectricTrendVO> getYearlyElectricTrend();

    // 월별 전기료 데이터 조회
    List<Map<String, Object>> getMonthlyElectricData(String year);
    
    // 계절별 전기료 데이터 조회
    List<SeasonalElectricVO> getSeasonalElectricData();
    
    // 면적당 전기료 효율 데이터 조회
    List<ElectricAreaVO> getElectricAreaEfficiency();
    
    // 특정 연도 면적당 전기료 효율 데이터 조회
    List<ElectricAreaVO> getElectricAreaEfficiencyByYear(String year);
    
    // 전기료 test 페이지
    List<Map<String, Object>> getMonthlyElectricSummary(Map<String, Object> params);
    
}
