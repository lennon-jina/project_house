package com.house.team.stats.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.house.team.stats.vo.APTInfoVO;
import com.house.team.stats.vo.ElectricAreaVO;
import com.house.team.stats.vo.ElectricTrendVO;
import com.house.team.stats.vo.SeasonalElectricVO;

@Repository
public class APTInfoDAOImpl implements IAPTInfoDAO {

	@Autowired
    private SqlSession sqlSession;
    
    private static final String NAMESPACE = "com.house.team.stats.dao.IAPTInfoDAO";
    
    @Override
    public APTInfoVO getBaseApartmentInfo(String cmpxCd) {
        return sqlSession.selectOne(NAMESPACE + ".getBaseApartmentInfo", cmpxCd);
    }
    
    @Override
    public List<APTInfoVO> getSimilarApartments(String baseCmpxCd) {
        return sqlSession.selectList(NAMESPACE + ".getSimilarApartments", baseCmpxCd);
    }
    
    @Override
    public List<APTInfoVO> getAllApartments() {
        return sqlSession.selectList(NAMESPACE + ".getAllApartments");
    }
    
    @Override
    public List<ElectricTrendVO> getYearlyElectricTrend() {
        return sqlSession.selectList(NAMESPACE + ".getYearlyElectricTrend");
    }

    @Override
    public List<Map<String, Object>> getMonthlyElectricData(String year) {
        return sqlSession.selectList(NAMESPACE + ".getMonthlyElectricData", year);
    }
    
    @Override
    public List<SeasonalElectricVO> getSeasonalElectricData() {
        return sqlSession.selectList(NAMESPACE + ".getSeasonalElectricData");
    }
    
    // 면적당 전기료 효율 데이터 조회
    @Override
    public List<ElectricAreaVO> getElectricAreaEfficiency() {
        return sqlSession.selectList(NAMESPACE + ".getElectricAreaEfficiency");
    }
    
    // 특정 연도 면적당 전기료 효율 데이터 조회
    @Override
    public List<ElectricAreaVO> getElectricAreaEfficiencyByYear(String year) {
        return sqlSession.selectList(NAMESPACE + ".getElectricAreaEfficiencyByYear", year);
    }
    // 전기료 test 페이지
    @Override
    public List<Map<String, Object>> getMonthlyElectricSummary(Map<String, Object> params) {
    	return sqlSession.selectList(NAMESPACE + ".getMonthlyElectricSummary", params);
    }
}
