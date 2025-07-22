package com.house.team.user.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.security.access.method.P;

import com.house.team.user.vo.LoginVO;
import com.house.team.user.vo.MemberVO;

@Mapper
public interface LoginMapper {
	LoginVO selectByProviderAndEmail(@Param("provider") String provider, @Param("email") String email);
	int insertLoginVO(LoginVO login);
	LoginVO selectLoginInfo(String email);
	void updatePassword(LoginVO login);
	LoginVO selectLoginInfoByMemNo(Long memNo);
	//중복 체크 부분
	int countByMemId(String memId);
	
	LoginVO selectLoginByEmail(@Param("email") String email);
    LoginVO selectLoginByUsername(@Param("username") String username);
    
}
