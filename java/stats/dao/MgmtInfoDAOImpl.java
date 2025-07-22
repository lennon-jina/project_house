package com.house.team.stats.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.house.team.stats.vo.ElectricComparisonVO;
import com.house.team.stats.vo.IndividualFeeTrendVO;
import com.house.team.stats.vo.MgmtCompositionVO;
import com.house.team.stats.vo.MgmtCostComparisonVO;
import com.house.team.stats.vo.MgmtInfoVO;
import com.house.team.stats.vo.PublicMgmtFeeTrendVO;
import com.house.team.stats.vo.ReserveFundMonthlyVO;
import com.house.team.stats.vo.ReserveFundStatusVO;
import com.house.team.stats.vo.ReserveFundTrendVO;

@Repository
public class MgmtInfoDAOImpl implements IMgmtInfoDAO {
	    
    @Autowired
    private SqlSession sqlSession;
    
    private static final String NAMESPACE = "com.house.team.stats.dao.IMgmtInfoDAO";
    
    @Override
    public MgmtInfoVO getLatestMgmtInfo(String cmpxCd) {
        return sqlSession.selectOne(NAMESPACE + ".getLatestMgmtInfo", cmpxCd);
    }
    
    @Override
    public List<MgmtInfoVO> getCompareMgmtInfo(List<String> cmpxCdList) {
        return sqlSession.selectList(NAMESPACE + ".getCompareMgmtInfo", cmpxCdList);
    }
    
    @Override
    public List<MgmtInfoVO> getMgmtHistory(String cmpxCd) {
        return sqlSession.selectList(NAMESPACE + ".getMgmtHistory", cmpxCd);
    }
    
    @Override
    public List<IndividualFeeTrendVO> getIndividualFeeTrendByAgeGroup() {
        return sqlSession.selectList(NAMESPACE + ".getIndividualFeeTrendByAgeGroup");
    }
    
    @Override
    public List<PublicMgmtFeeTrendVO> getPublicMgmtFeeTrendByAgeGroup() {
        return sqlSession.selectList(NAMESPACE + ".getPublicMgmtFeeTrendByAgeGroup");
    }
	
    @Override
    public List<MgmtCompositionVO> getMgmtCompositionByAgeGroup() {
        return sqlSession.selectList(NAMESPACE + ".getMgmtCompositionByAgeGroup");
    }
    
    // 연식별 주요 관리비 항목 지출 비교 조회
    @Override
    public List<MgmtCostComparisonVO> getMgmtCostComparisonByAgeGroup() {
        return sqlSession.selectList(NAMESPACE + ".getMgmtCostComparisonByAgeGroup");
    }
    
    // 노후도 그룹별 10년간 연평균 장충금 현황 조회
    @Override
    public List<ReserveFundStatusVO> getReserveFundStatusByAgeGroup() {
        return sqlSession.selectList(NAMESPACE + ".getReserveFundStatusByAgeGroup");
    }
    
    // 노후도 그룹별 장충금 총적립금액 연도별 추이 조회 (2015~2024)
    @Override
    public List<ReserveFundTrendVO> getReserveFundTrendByAgeGroup() {
        return sqlSession.selectList(NAMESPACE + ".getReserveFundTrendByAgeGroup");
    }
    
    // 2024년 노후도 그룹별 월별 장충금 현황 조회
    @Override
    public List<ReserveFundMonthlyVO> getReserveFundMonthlyByAgeGroup() {
        return sqlSession.selectList(NAMESPACE + ".getReserveFundMonthlyByAgeGroup");
    }
    
    // 전기료 비교 전용 메서드 구현
    @Override
    public List<ElectricComparisonVO> getCompareElectricInfo(List<String> cmpxCdList) {
        return sqlSession.selectList(NAMESPACE + ".getCompareElectricInfo", cmpxCdList);
    }
    
    @Override
    public List<Map<String, Object>> getMonthlyMgmtSummary(Map<String, Object> params) {
    	return sqlSession.selectList(NAMESPACE + ".getMonthlyMgmtSummary", params);
    }
}
