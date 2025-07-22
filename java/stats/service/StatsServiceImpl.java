package com.house.team.stats.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.stats.dao.IAPTInfoDAO;
import com.house.team.stats.dao.IAREAInfoDAO;
import com.house.team.stats.dao.IMgmtInfoDAO;
import com.house.team.stats.vo.APTInfoVO;
import com.house.team.stats.vo.AREAInfoVO;
import com.house.team.stats.vo.ElectricAreaVO;
import com.house.team.stats.vo.ElectricComparisonVO;
import com.house.team.stats.vo.ElectricTrendVO;
import com.house.team.stats.vo.IndividualFeeTrendVO;
import com.house.team.stats.vo.MgmtCompositionVO;
import com.house.team.stats.vo.MgmtCostComparisonVO;
import com.house.team.stats.vo.MgmtInfoVO;
import com.house.team.stats.vo.PublicMgmtFeeTrendVO;
import com.house.team.stats.vo.ReserveFundMonthlyVO;
import com.house.team.stats.vo.ReserveFundStatusVO;
import com.house.team.stats.vo.ReserveFundTrendVO;
import com.house.team.stats.vo.SeasonalElectricVO;

@Service
public class StatsServiceImpl implements IStatsService {

    @Autowired
    private IAPTInfoDAO aptInfoDAO;

    @Autowired
    private IMgmtInfoDAO mgmtInfoDAO;

    @Autowired
    private IAREAInfoDAO areaInfoDAO;
    
    // 🆕 아파트 노후도 분류 조회 (새로 추가)
    @Override
    public Map<String, Object> getApartmentClassification(String cmpxCd) {
        Map<String, Object> result = new HashMap<>();
        
        // 1. 아파트 정보 조회
        APTInfoVO aptInfo = aptInfoDAO.getBaseApartmentInfo(cmpxCd);
        
        if (aptInfo == null) {
            return result; // 빈 맵 반환
        }
        
        // 2. 노후도 분류 계산
        String ageCategory = calculateAgeCategory(aptInfo);
        
        // 3. 예측 타입 결정
        String predictType = getPredictTypeByAgeCategory(ageCategory);
        
        result.put("apartmentInfo", aptInfo);
        result.put("ageCategory", ageCategory);
        result.put("predictType", predictType);
        
        return result;
    }

    @Override
    public Map<String, Object> getApartmentComparison(String baseCmpxCd) {
        Map<String, Object> result = new HashMap<>();
        
        // 1. 기준 아파트 정보 조회
        APTInfoVO baseApt = aptInfoDAO.getBaseApartmentInfo(baseCmpxCd);
        
        // 2. 기준 아파트의 주요 면적 정보 조회
        AREAInfoVO baseArea = areaInfoDAO.getMainAreaInfo(baseCmpxCd);
        
        // 3. 기준 아파트의 연식 카테고리 계산
        String baseAgeCategory = calculateAgeCategory(baseApt);
        
        // 4. 유사한 아파트들 조회 (20개)
        List<APTInfoVO> allSimilarApts = aptInfoDAO.getSimilarApartments(baseCmpxCd);
        
        // 5. 3개 아파트 선택 (기준 + 다른 카테고리 2개)
        List<APTInfoVO> selectedApts = selectThreeApartments(baseApt, allSimilarApts, baseAgeCategory);
        
        result.put("baseApartment", baseApt);
        result.put("baseArea", baseArea);
        result.put("similarApartments", selectedApts);  // 3개만 반환
        result.put("baseAgeCategory", baseAgeCategory);
        
        return result;
    }

    // 연식 카테고리 계산 메소드 (기준 업데이트)
    private String calculateAgeCategory(APTInfoVO apt) {
        if (apt.getApprDt() == null) return "중견";
        
        long diffInMillies = System.currentTimeMillis() - apt.getApprDt().getTime();
        int years = (int) (diffInMillies / (365.25 * 24 * 60 * 60 * 1000));
        
        // 업데이트된 기준 적용
        if (years >= 20) return "노후";        // 2004년 이전 (20년 이상)
        else if (years >= 10) return "중견";   // 2005년~2014년 (10~20년)
        else return "신축";                   // 2015년 이후 (10년 이하)
    }
    
    // 🆕 노후도별 예측 타입 결정
    private String getPredictTypeByAgeCategory(String ageCategory) {
        switch (ageCategory) {
            case "노후":
                return "장기수선충당금";
            case "중견":
                return "수선비";
            case "신축":
                return "공용 전기료";
            default:
                return "공용 전기료";
        }
    }

    // 3개 아파트 선택 로직 (기존과 동일)
    private List<APTInfoVO> selectThreeApartments(APTInfoVO baseApt, List<APTInfoVO> similarApts, String baseAgeCategory) {
        List<APTInfoVO> result = new ArrayList<>();
        
        // 기준 아파트 먼저 추가
        result.add(baseApt);
        
        // 각 카테고리별로 분류
        Map<String, List<APTInfoVO>> categoryMap = new HashMap<>();
        categoryMap.put("신축", new ArrayList<>());
        categoryMap.put("중견", new ArrayList<>());
        categoryMap.put("노후", new ArrayList<>());
        
        // 유사 아파트들을 카테고리별로 분류
        for (APTInfoVO apt : similarApts) {
            String category = calculateAgeCategory(apt);
            categoryMap.get(category).add(apt);
        }
        
        // 기준과 다른 카테고리에서 선택
        List<String> otherCategories = new ArrayList<>();
        for (String category : Arrays.asList("신축", "중견", "노후")) {
            if (!category.equals(baseAgeCategory)) {
                otherCategories.add(category);
            }
        }
        
        // 다른 카테고리 2개에서 각각 1개씩 선택
        for (String category : otherCategories) {
            List<APTInfoVO> categoryApts = categoryMap.get(category);
            if (!categoryApts.isEmpty()) {
                result.add(categoryApts.get(0)); // 유사도 순으로 정렬되어 있으므로 첫번째 선택
            }
        }
        
        // 만약 3개가 안 되면 유사도 순으로 채우기
        if (result.size() < 3) {
            for (APTInfoVO apt : similarApts) {
                if (result.size() >= 3) break;
                
                // 이미 선택된 아파트인지 확인
                boolean alreadySelected = false;
                for (APTInfoVO selected : result) {
                    if (selected.getCmpxCd().equals(apt.getCmpxCd())) {
                        alreadySelected = true;
                        break;
                    }
                }
                
                if (!alreadySelected) {
                    result.add(apt);
                }
            }
        }
        
        return result;
    }

    @Override
    public Map<String, Object> getMgmtComparison(String baseCmpxCd, List<String> compareCmpxCdList) {
        Map<String, Object> result = new HashMap<>();

        // 관리비 비교 데이터 조회
        List<MgmtInfoVO> mgmtComparison = mgmtInfoDAO.getCompareMgmtInfo(compareCmpxCdList);

        result.put("mgmtComparison", mgmtComparison);

        return result;
    }

    @Override
    public Map<String, Object> getApartmentStats(String cmpxCd) {
        Map<String, Object> result = new HashMap<>();

        // 기본 아파트 정보
        APTInfoVO aptInfo = aptInfoDAO.getBaseApartmentInfo(cmpxCd);

        // 면적별 세대수 정보
        List<AREAInfoVO> areaInfoList = areaInfoDAO.getAreaInfoByCmpxCd(cmpxCd);

        // 관리비 히스토리
        List<MgmtInfoVO> mgmtHistory = mgmtInfoDAO.getMgmtHistory(cmpxCd);

        result.put("apartmentInfo", aptInfo);
        result.put("areaInfoList", areaInfoList);
        result.put("mgmtHistory", mgmtHistory);

        return result;
    }

    // 모든 아파트 조회
    @Override
    public List<APTInfoVO> getAllApartments() {
        return aptInfoDAO.getAllApartments();
    }
    
    @Override
    public List<ElectricTrendVO> getYearlyElectricTrend() {
        // ELECTRIC_TREND_ANALYSIS 테이블에서 연도별 데이터 조회
        return aptInfoDAO.getYearlyElectricTrend();
    }

    @Override
    public Map<String, Object> getMonthlyElectricData(String year) {
        Map<String, Object> result = new HashMap<>();
        
        // 선택된 연도의 월별 데이터 조회
        List<Map<String, Object>> monthlyData = aptInfoDAO.getMonthlyElectricData(year);
        
        result.put("year", year);
        result.put("monthlyData", monthlyData);
        
        return result;
    }
    
    // 계절별 전기료 데이터 조회
    @Override
    public List<SeasonalElectricVO> getSeasonalElectricData() {
        return aptInfoDAO.getSeasonalElectricData();
    }
    
    // 면적당 전기료 효율 데이터 조회
    @Override
    public List<ElectricAreaVO> getElectricAreaEfficiency() {
        return aptInfoDAO.getElectricAreaEfficiency();
    }
    
    // 특정 연도 면적당 전기료 효율 데이터 조회
    @Override
    public List<ElectricAreaVO> getElectricAreaEfficiencyByYear(String year) {
        return aptInfoDAO.getElectricAreaEfficiencyByYear(year);
    }
    
    // 연식별 총 관리비 1년 추이 (개별)
    @Override
    public List<IndividualFeeTrendVO> getIndividualFeeTrendByAgeGroup() {
        return mgmtInfoDAO.getIndividualFeeTrendByAgeGroup();
    }
    
    // 연식별 총 관리비 1년 추이 (공용)
    @Override
    public List<PublicMgmtFeeTrendVO> getPublicMgmtFeeTrendByAgeGroup() {
        return mgmtInfoDAO.getPublicMgmtFeeTrendByAgeGroup();
    }
    
    // 항목별 비중 비교
    @Override
    public List<MgmtCompositionVO> getMgmtCompositionByAgeGroup() {
        return mgmtInfoDAO.getMgmtCompositionByAgeGroup();
    }
    
    // 연식별 주요 관리비 항목 지출 비교
    @Override
    public List<MgmtCostComparisonVO> getMgmtCostComparisonByAgeGroup() {
        return mgmtInfoDAO.getMgmtCostComparisonByAgeGroup();
    }
    
    // 노후도 그룹별 10년간 연평균 장충금 현황 조회
    @Override
    public List<ReserveFundStatusVO> getReserveFundStatusByAgeGroup() {
        return mgmtInfoDAO.getReserveFundStatusByAgeGroup();
    }
    
    // 노후도 그룹별 장충금 총적립금액 연도별 추이 조회 (2015~2024)
    @Override
    public List<ReserveFundTrendVO> getReserveFundTrendByAgeGroup() {
        return mgmtInfoDAO.getReserveFundTrendByAgeGroup();
    }
    
    // 2024년 노후도 그룹별 월별 장충금 현황 조회
    @Override
    public List<ReserveFundMonthlyVO> getReserveFundMonthlyByAgeGroup() {
        return mgmtInfoDAO.getReserveFundMonthlyByAgeGroup();
    }
    
    // 전기료 비교 분석 메서드 추가
    @Override
    public Map<String, Object> getElectricComparison(String baseCmpxCd, List<String> compareCmpxCdList) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 전기료 비교 데이터 조회
            List<ElectricComparisonVO> electricComparison = mgmtInfoDAO.getCompareElectricInfo(compareCmpxCdList);
            
            if (electricComparison != null && !electricComparison.isEmpty()) {
                // 각 VO의 계산된 값들 재설정 (안전장치)
                for (ElectricComparisonVO electric : electricComparison) {
                    electric.calculateDerivedValues();
                }
                
                result.put("electricComparison", electricComparison);
                result.put("success", true);
                result.put("message", "전기료 비교 데이터 조회 성공");
                
                // 기준 아파트 정보 추가 (첫 번째 아파트가 기준)
                if (!electricComparison.isEmpty()) {
                    result.put("baseApartment", electricComparison.get(0));
                }
                
                // 통계 정보 추가
                result.put("totalCount", electricComparison.size());
                
            } else {
                result.put("electricComparison", new ArrayList<>());
                result.put("success", false);
                result.put("message", "전기료 데이터를 찾을 수 없습니다.");
            }
            
        } catch (Exception e) {
            // 로그 출력 (실제 환경에서는 Logger 사용 권장)
            e.printStackTrace();
            
            result.put("electricComparison", new ArrayList<>());
            result.put("success", false);
            result.put("message", "전기료 비교 데이터 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        return result;
    }
    
    // 전기료 test 페이지
    @Override
    public List<Map<String, Object>> getMonthlyElectricSummary(Map<String, Object> params) {
    	return aptInfoDAO.getMonthlyElectricSummary(params);
    }
    // 관리비 test 페이지
    @Override
    public List<Map<String, Object>> getMonthlyMgmtSummary(Map<String, Object> params) {
    	return mgmtInfoDAO.getMonthlyMgmtSummary(params);
    }
}