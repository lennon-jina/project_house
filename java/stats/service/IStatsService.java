package com.house.team.stats.service;

import java.util.List;
import java.util.Map;

import com.house.team.stats.vo.APTInfoVO;
import com.house.team.stats.vo.ElectricAreaVO;
import com.house.team.stats.vo.ElectricTrendVO;
import com.house.team.stats.vo.IndividualFeeTrendVO;
import com.house.team.stats.vo.MgmtCompositionVO;
import com.house.team.stats.vo.MgmtCostComparisonVO;
import com.house.team.stats.vo.PublicMgmtFeeTrendVO;
import com.house.team.stats.vo.ReserveFundMonthlyVO;
import com.house.team.stats.vo.ReserveFundStatusVO;
import com.house.team.stats.vo.ReserveFundTrendVO;
import com.house.team.stats.vo.SeasonalElectricVO;

public interface IStatsService {

    // 기준 아파트 정보와 유사한 아파트들 조회
    Map<String, Object> getApartmentComparison(String baseCmpxCd);
    
    // 🆕 아파트 노후도 분류 조회 (새로 추가)
    Map<String, Object> getApartmentClassification(String cmpxCd);
    
    // 관리비 비교 분석
    Map<String, Object> getMgmtComparison(String baseCmpxCd, List<String> compareCmpxCdList);
    
    // 아파트 통계 분석
    Map<String, Object> getApartmentStats(String cmpxCd);
    
    // 모든 아파트 목록 조회
    List<APTInfoVO> getAllApartments();
    
    // 전기료 연도별 트렌드 분석 데이터 조회
    List<ElectricTrendVO> getYearlyElectricTrend();
    
    // 전기료 월별 데이터 조회
    Map<String, Object> getMonthlyElectricData(String year);
    
    // 계절별 전기료 데이터 조회
    List<SeasonalElectricVO> getSeasonalElectricData();
    
    // 면적당 전기료 효율 데이터 조회
    List<ElectricAreaVO> getElectricAreaEfficiency();
    
    // 특정 연도 면적당 전기료 효율 데이터 조회
    List<ElectricAreaVO> getElectricAreaEfficiencyByYear(String year);
    
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
    
    // 전기료 비교 분석 (새로 추가)
    Map<String, Object> getElectricComparison(String baseCmpxCd, List<String> compareCmpxCdList);
    
    // 전기료 test 페이지
    List<Map<String, Object>> getMonthlyElectricSummary(Map<String, Object> params);
    
    // 관리비 test 페이지
    List<Map<String, Object>> getMonthlyMgmtSummary(Map<String, Object> params);
}