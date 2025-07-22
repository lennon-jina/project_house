package com.house.team.stats.dao;

import java.util.List;
import java.util.Map;

import com.house.team.stats.vo.ElectricComparisonVO;
import com.house.team.stats.vo.IndividualFeeTrendVO;
import com.house.team.stats.vo.MgmtCompositionVO;
import com.house.team.stats.vo.MgmtCostComparisonVO;
import com.house.team.stats.vo.MgmtInfoVO;
import com.house.team.stats.vo.PublicMgmtFeeTrendVO;
import com.house.team.stats.vo.ReserveFundMonthlyVO;
import com.house.team.stats.vo.ReserveFundStatusVO;
import com.house.team.stats.vo.ReserveFundTrendVO;

public interface IMgmtInfoDAO {

	// 특정 아파트의 최신 관리비 정보 조회
    MgmtInfoVO getLatestMgmtInfo(String cmpxCd);
    
    // 여러 아파트의 관리비 비교 정보 조회
    List<MgmtInfoVO> getCompareMgmtInfo(List<String> cmpxCdList);
    
    // 특정 아파트의 관리비 히스토리 조회
    List<MgmtInfoVO> getMgmtHistory(String cmpxCd);
    
    // 노후도 그룹별 개별사용료계 월별 추이 조회
    List<IndividualFeeTrendVO> getIndividualFeeTrendByAgeGroup();
    
    // 노후도 그룹별 공용관리비계 월별 추이 조회
    List<PublicMgmtFeeTrendVO> getPublicMgmtFeeTrendByAgeGroup();
    
    // 노후도 그룹별 관리비 항목 비중 조회
    List<MgmtCompositionVO> getMgmtCompositionByAgeGroup();
    
    // 연식별 주요 관리비 항목 지출 비교 조회
    List<MgmtCostComparisonVO> getMgmtCostComparisonByAgeGroup();
    
    // 노후도 그룹별 10년간 연평균 장충금 현황 조회
    List<ReserveFundStatusVO> getReserveFundStatusByAgeGroup();
    
    // 노후도 그룹별 장충금 총적립금액 연도별 추이 조회 (2015~2024)
    List<ReserveFundTrendVO> getReserveFundTrendByAgeGroup();
    
    // 2024년 노후도 그룹별 월별 장충금 현황 조회  
    List<ReserveFundMonthlyVO> getReserveFundMonthlyByAgeGroup();
    
    // 전기료 비교 전용 메서드 추가
    List<ElectricComparisonVO> getCompareElectricInfo(List<String> cmpxCdList);
    
    // 관리비 test 페이지
    List<Map<String, Object>> getMonthlyMgmtSummary(Map<String, Object> params);
}
