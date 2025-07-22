package com.house.team.map.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.map.vo.MapVo;
import com.house.team.stats.vo.APTInfoVO;

@Mapper
public interface IMapDAO {

    MapVo selectComplexSummaryByCd(String cmpxCd);

    // 단지 리스트 조회용 메서드 추가

    List<MapVo> selectComplexList();
    
    //면적 조회
    MapVo selectComparea(String cmpxCd);
    
    //
    List<MapVo> getAllPolygons();
    
    List<MapVo> getPolygonsByRegion(@Param("region") String region);
    
    List<MapVo> getPolygonsByDong(String dong);
    
    List<MapVo> searchBuildingsByKeyword(String keyword);
    
    List<APTInfoVO> searchKeyword(String keyword);
    
    
    List<MapVo> selectSimilarComplexes(Map<String, Object> params);

    MapVo getEnergyGradeBySimilarity(String cmpxCd);
    
    MapVo getEnergyGradeByName(String cmpxCd);


}
