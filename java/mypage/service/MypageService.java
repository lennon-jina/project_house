package com.house.team.mypage.service;

import java.time.Year;
import java.time.YearMonth;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.management.dao.IManDAO;
import com.house.team.management.vo.IManVO;
import com.house.team.mypage.dao.IMypageDAO;
import com.house.team.mypage.dao.RefundMapper;
import com.house.team.mypage.vo.MypageVo;
import com.house.team.mypage.vo.RefundDetail;
import com.house.team.mypage.vo.RefundResponse;

@Service
public class MypageService {

    private final IMypageDAO mypageDAO;

    @Autowired
    public MypageService(IMypageDAO mypageDAO) {
        this.mypageDAO = mypageDAO;
    }
    
    @Autowired  // 또는 생성자 주입 가능
    private IManDAO managementMapper;
    
    @Autowired
    private RefundMapper refundMapper;
    
    // 로그인한 사용자의 찜한 단지 목록 조회
    public List<MypageVo> getBookmarkedComplexList(int memNo) {
        return mypageDAO.selectbookmarker(memNo);
    }
    
    // 단지코드(cmpxCd)로 최근 관리비 내역 조회
    public List<IManVO> selectwoExpenses(String cmpxCd) {
        return managementMapper.selectwoExpenses(cmpxCd);
    }
    
    public RefundResponse calculateRefund(String cmpxCd, String startDate, String endDate) {
    	YearMonth start = YearMonth.parse(startDate.substring(0, 7));
    	YearMonth end = YearMonth.parse(endDate.substring(0, 7));
    	
    	List<RefundDetail> details = refundMapper.selectRsvChgBetween(cmpxCd, startDate, endDate);
    	
    	int total = details.stream().mapToInt(RefundDetail::getAmount).sum();
    	
    	RefundResponse response = new RefundResponse();
    	response.setTotalAmount(total);
    	response.setDetails(details);
    	return response;
    }
    
    
}