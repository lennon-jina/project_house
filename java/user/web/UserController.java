package com.house.team.user.web;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.house.team.user.dao.LoginMapper;
import com.house.team.user.dao.MemberMapper;
import com.house.team.user.service.UserService;
import com.house.team.user.vo.LoginRequest;
import com.house.team.user.vo.LoginVO;
import com.house.team.user.vo.MemberVO;
import com.house.team.user.vo.RegisterRequest;
import com.house.team.user.vo.UserTypeRequest;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request, HttpSession session) {
        try {
            Long memNo = userService.registerLocal(request);
            session.setAttribute("memNo", memNo);  // 회원가입 후 세션에 저장
            return ResponseEntity.ok(Map.of("memNo", memNo));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("회원가입 실패: " + e.getMessage());
        }
    }
    @PostMapping("/type")
    public ResponseEntity<?> updateUserType(@RequestBody UserTypeRequest request) {
    	try {
    		userService.updateUserType(request.getMemNo(), request.getUserType());
    		return ResponseEntity.ok("사용자 유형 저장 성공");
    	} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("사용자 유형 저장 실패: " + e.getMessage());
		}
    }
    
    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        String username = request.getUsername();
        String password = request.getPassword();
        
        if (username == null || password == null) {
        	return ResponseEntity.badRequest().body("아이디 또는 비밀번호 누락");
        }
        boolean isEmail = username.contains("@");
        LoginVO loginVO = null;
        
        if(isEmail) {
        	loginVO = userService.getLoginInfoByEmail(username);
        } else {
        	loginVO = userService.getLoginInfoByUsername(username);
        }
        
        if (loginVO == null || !password.equals(loginVO.getMemPw())) {
            return ResponseEntity.status(401).body("로그인 실패");
        }
        MemberVO member = userService.getMemberByMemNo(loginVO.getMemNo());
        if (member == null) {
            return ResponseEntity.status(500).body("회원 정보 없음");
        }
        
        session.setAttribute("memNick", member.getMemNick());
        session.setAttribute("memEmail", member.getMemEmail());
        session.setAttribute("memNo", member.getMemNo());
        session.setAttribute("loginMember", member);
        session.setAttribute("loginInfo", loginVO);
        session.setAttribute("aptName", member.getAptName());
        session.setAttribute("dongNo", member.getDongNo());
        session.setAttribute("roomNo", member.getRoomNo());
        session.setAttribute("isAdmin", "admin@gmail.com".equalsIgnoreCase(member.getMemEmail()));
        
        return ResponseEntity.ok("/");
    }
    
    @PostMapping("/logout")
    public void logout(HttpSession session, HttpServletResponse response) throws IOException {
        session.invalidate(); // 세션 삭제
        response.sendRedirect("/"); // 수동 리다이렉트
    }
    
    // 로그인 상태 확인
    @GetMapping("/check-login")
    public ResponseEntity<String> checkLogin(HttpSession session) {
        Long memNo = (Long) session.getAttribute("memNo");
        if (memNo != null) {
            return ResponseEntity.ok("로그인 상태: memNo=" + memNo);
        } else {
            return ResponseEntity.status(401).body("로그인 안됨");
        }
    }
    @PostMapping("/withdraw")
    @ResponseBody
    public String withdraw(HttpSession session) {
        Long memNo = (Long) session.getAttribute("memNo");
        if (memNo != null) {
            userService.withdrawMember(memNo);
            session.invalidate(); // 세션 만료 (로그아웃 처리)
            return "success";
        }
        return "fail";
    }
    // 이메일 중복 체크
    @GetMapping("/check/email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = userService.isEmailDuplicate(email);
        return ResponseEntity.ok(exists);
    }

    // 닉네임 중복 체크
    @GetMapping("/check/nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        boolean exists = userService.isNicknameDuplicate(nickname);
        return ResponseEntity.ok(exists);
    }
    // 아이디 중복 체크
    @GetMapping("/check/memId")
    public ResponseEntity<Boolean> checkMemId(@RequestParam String memId) {
    	boolean exists = userService.isMemIdDuplicate(memId);
    	return ResponseEntity.ok(exists);
    }
}
