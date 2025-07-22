package com.house.team.user.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.user.vo.LoginVO;
import com.house.team.user.vo.MemberVO;


@Mapper
public interface MemberMapper {
	MemberVO selectByEmail(String email);
	int insertMemberVO(MemberVO member);
	MemberVO selectById(@Param("memNo") Long memNo);
	void updateUserType(@Param("memNo") Long memNo, @Param("userType") String userType);
	void updateAptInfo(@Param("memNo") Long memNo, @Param("cmpxCd") String cmpxCd,@Param("aptName") String aptName, @Param("dongNo") int dongNo, @Param("roomNo") int roomNo);
	int updateUseYnToN(Long memNo);  // 탈퇴 처리 메서드 추가
	MemberVO selectMemberByMemNo(@Param("memNo") Long memNo);
	void updateNickname(MemberVO member);
	// 중복 체크
	int countByEmail(String email);
	int countByNickname(String nickname);
	
	// 현재 년도의 월별 가입자 수를 조회
    List<Map<String, Object>> getNewMembers(@Param("year") int year);
    // 하루(요일별) 가입자 수 조회
    Map<String, Object> getWeeklyNewMembers();
    void updateProfileImage(@Param("memNo") Long memNo, @Param("profileImg") String profileImgpath);
    
}
