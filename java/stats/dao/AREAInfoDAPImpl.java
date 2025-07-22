package com.house.team.stats.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.house.team.stats.vo.AREAInfoVO;

@Repository
public class AREAInfoDAPImpl implements IAREAInfoDAO {
	
	@Autowired
    private SqlSession sqlSession;
    
    private static final String NAMESPACE = "com.house.team.stats.dao.IAREAInfoDAO";
    
    @Override
    public List<AREAInfoVO> getAreaInfoByCmpxCd(String cmpxCd) {
        return sqlSession.selectList(NAMESPACE + ".getAreaInfoByCmpxCd", cmpxCd);
    }
    
    @Override
    public AREAInfoVO getMainAreaInfo(String cmpxCd) {
        return sqlSession.selectOne(NAMESPACE + ".getMainAreaInfo", cmpxCd);
    }

}
