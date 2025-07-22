package com.house.team.map.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.map.dao.IMapDAO;
import com.house.team.map.vo.MapVo;
import com.house.team.stats.vo.APTInfoVO;

@Service
public class MapService {

    private final IMapDAO mapDAO;

    @Autowired
    public MapService(IMapDAO mapDAO) {
        this.mapDAO = mapDAO;
    }

    public MapVo getComplexSummary(String cmpxCd) {
        return mapDAO.selectComplexSummaryByCd(cmpxCd);
    }

    public List<MapVo> getComplexList() {
        return mapDAO.selectComplexList();
    }
    public MapVo getComparea(String cmpxCd) {
        return mapDAO.selectComparea(cmpxCd);
    }
    
    public List<MapVo> getAllPolygons() {
        return mapDAO.getAllPolygons();
    }
    
    public List<MapVo> getPolygonsByRegion(String region) {
        return mapDAO.getPolygonsByRegion(region);
    }
    
    public List<MapVo> getPolygonsByDong(String dong) {
    	return mapDAO.getPolygonsByDong(dong);
    }
    
    public List<MapVo> searchBuildings(String keyword) {
        return mapDAO.searchBuildingsByKeyword(keyword);
    }
    
    public List<APTInfoVO> searchKeyword(String keyword) {
    	return mapDAO.searchKeyword(keyword);
    }
    
    public List<MapVo> getSimilarComplexes(String cmpxCd) {
        // 1) 기준 단지 정보 조회
        MapVo baseVo = mapDAO.selectComparea(cmpxCd);

        if (baseVo == null || baseVo.getUnitTot() == null || baseVo.getAreaUnit() == null || baseVo.getApprDt() == null) {
            return null;
        }

        Integer unitTot = baseVo.getUnitTot();
        

        // 2) 기준 단지 연식 계산
        int baseAge = 0;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String datePart = baseVo.getApprDt().split(" ")[0];  // "yyyy-MM-dd"
            LocalDate apprDate = LocalDate.parse(datePart, formatter);
            baseAge = (int) ChronoUnit.YEARS.between(apprDate, LocalDate.now());
        } catch (Exception e) {
            baseAge = 0;
        }

        // 3) 허용 범위 설정
        int minUnitTot = unitTot - 30;
        int maxUnitTot = unitTot + 30;
        int minAge = baseAge - 5;
        int maxAge = baseAge + 5;

        // 4) 파라미터 구성
        Map<String, Object> params = new HashMap<>();
        params.put("cmpxCd", cmpxCd);
        params.put("baseUnitTot", unitTot);
        params.put("minUnitTot", minUnitTot);
        params.put("maxUnitTot", maxUnitTot);
        params.put("minAge", minAge);
        params.put("maxAge", maxAge);

        // 5) 유사 단지 조회
        List<MapVo> similarList = mapDAO.selectSimilarComplexes(params);

        // 6) 연식 계산해서 세팅
        if (similarList != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate now = LocalDate.now();

            for (MapVo vo : similarList) {
                try {
                    String apprDtStr = vo.getApprDt();
                    if (apprDtStr != null && apprDtStr.contains(" ")) {
                        String datePart = apprDtStr.split(" ")[0];
                        LocalDate apprDate = LocalDate.parse(datePart, formatter);
                        int age = (int) ChronoUnit.YEARS.between(apprDate, now);
                        vo.setAge(age);
                    } else {
                        vo.setAge(0);
                    }
                } catch (Exception e) {
                    vo.setAge(0);
                }
            }
        }

        return similarList;
    }
    
    public MapVo getEnergyGradeBySimilarity(String cmpxCd) {
        return mapDAO.getEnergyGradeBySimilarity(cmpxCd);
    }
    
    public MapVo getEnergyGradeByName(String cmpxCd) {
        return mapDAO.getEnergyGradeByName(cmpxCd);
    }

    
}
