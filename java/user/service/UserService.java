package com.house.team.user.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.user.dao.LoginMapper;
import com.house.team.user.dao.MemberMapper;
import com.house.team.user.vo.LoginRequest;
import com.house.team.user.vo.LoginVO;
import com.house.team.user.vo.MemberVO;
import com.house.team.user.vo.RegisterRequest;

import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private MemberMapper memberMapper;

    @Autowired
    private LoginMapper loginMapper;

    // ✅ 회원가입
    @Transactional
    public Long registerLocal(RegisterRequest request) {
        MemberVO member = new MemberVO();
        member.setMemEmail(request.getEmail());
        member.setMemNick(request.getNickname());
        member.setCreateDt(new Date());
        member.setUpdateDt(new Date());
        member.setUseYn("Y");
        memberMapper.insertMemberVO(member);

        LoginVO login = new LoginVO();
        login.setMemNo(member.getMemNo());
        login.setMemPw(request.getPassword());
        login.setProvider("local");
        login.setProvToken("local");
        login.setCreateDt(new Date());
        login.setUpdateDt(new Date());
        System.out.println("memId: " + request.getId());
        System.out.println("login.memId: " + login.getMemId());
        login.setMemId(request.getId());
        loginMapper.insertLoginVO(login);
        
        return member.getMemNo();
    }

    // ✅ 로그인 검증 로직
    public boolean loginLocal(LoginRequest request) {
        LoginVO login = getLoginInfo(request);
        if (login != null) {
            return request.getPassword().equals(login.getMemPw());
        }
        return false;
    }

    // ✅ [추가] 로그인 정보 조회용 메서드 (예: 세션 저장 시 활용)
    public LoginVO getLoginInfo(LoginRequest request) {
        return loginMapper.selectByProviderAndEmail("local", request.getUsername());
    }
   
 // UserService.java
    public void withdrawMember(Long memNo) {
        memberMapper.updateUseYnToN(memNo); // Mapper 호출
    }
    
    public MemberVO getMemberByMemNo(Long memNo) {
    	return memberMapper.selectMemberByMemNo(memNo);
    }
    
    public void updateNickname(MemberVO member) {
    	memberMapper.updateNickname(member);
    }
    
    public void updatePassword(LoginVO login) {
    	loginMapper.updatePassword(login);
    }
    
    public LoginVO getLoginInfoByMemNo(Long memNo) {
    	return loginMapper.selectLoginInfoByMemNo(memNo);
    }
    
    public UserService(MemberMapper memberMapper, LoginMapper loginMapper) {
    	this.memberMapper = memberMapper;
    	this.loginMapper = loginMapper;
    }
    
    public boolean isEmailDuplicate(String email) {
        return memberMapper.countByEmail(email) > 0;
    }

    public boolean isNicknameDuplicate(String nickname) {
        return memberMapper.countByNickname(nickname) > 0;
    }
    
    public boolean isMemIdDuplicate(String memId) {
    	return loginMapper.countByMemId(memId) > 0;
    }
    
    // 현재 년도의 월별 가입자 수를 조회
    public List<Map<String, Object>> getNewMembers(int year) {
        return memberMapper.getNewMembers(year);
    }
    // 하루(요일별) 가입자 수 조회
    public Map<String, Object> getWeeklyNewMembers() {
        return memberMapper.getWeeklyNewMembers();
    }
    
    public void updateUserType(Long memNo, String userType) {
    	 MemberVO member = memberMapper.selectById(memNo);
    	 if (member == null) {
    		 throw new RuntimeException("회원이 없습니다: " + memNo);
    	 }
    	 memberMapper.updateUserType(memNo, userType);
    }
    public void updateMemberAptInfo(Long memNo, String cmpxCd, String aptName, int dongNo, int roomNo) {
    	memberMapper.updateAptInfo(memNo, cmpxCd,aptName, dongNo, roomNo);
    }
    
    public LoginVO getLoginInfoByEmail(String email) {
    	return loginMapper.selectLoginByEmail(email);
    }
    
    public LoginVO getLoginInfoByUsername(String username) {
    	return loginMapper.selectLoginByUsername(username);
    }
    
    public void updateProfileImage(Long memNo, String profileImgpath) {
    	Map<String, Object> map = new HashMap<>();
    	map.put("memNo", memNo);
    	map.put("profileImg", profileImgpath);
    	memberMapper.updateProfileImage(memNo, profileImgpath);
    }
    
}
