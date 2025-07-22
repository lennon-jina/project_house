package com.house.team.mypage.web;

import java.awt.datatransfer.Transferable;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model; // <- 이게 맞는 import
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.house.team.management.vo.IManVO;
import com.house.team.mypage.service.MypageService;
import com.house.team.mypage.vo.MypageVo;
import com.house.team.mypage.vo.RefundResponse;
import com.house.team.stats.service.IStatsService;
import com.house.team.stats.vo.APTInfoVO;
import com.house.team.user.service.UserService;
import com.house.team.user.vo.LoginVO;
import com.house.team.user.vo.MemberVO;
import java.util.Collections;
import jakarta.servlet.http.HttpSession;

@Controller
public class MypageController {
	
	@Autowired
    private MypageService mypageService;
	
	@Autowired
	private UserService userService;

	@GetMapping("/mypage")
	public String myPage(HttpSession session, Model model, RedirectAttributes redirectAttributes) {
	    MemberVO member = (MemberVO) session.getAttribute("loginMember");
	    LoginVO loginInfo = (LoginVO) session.getAttribute("loginInfo");
	    Long memNo = (Long) session.getAttribute("memNo");
	    
	    // 로그인 체크
	    if (member == null || loginInfo == null || memNo == null) {
	        redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
	        return "redirect:/login";
	    }

	    // 기본 회원정보 모델에 추가
	    model.addAttribute("memNick", member.getMemNick());
	    model.addAttribute("memEmail", member.getMemEmail());
	    model.addAttribute("aptName", member.getAptName());
	    model.addAttribute("dongNo", member.getDongNo());
	    model.addAttribute("roomNo", member.getRoomNo());
	    model.addAttribute("loginMember", member);
	    
	    // 찜한 단지 리스트 조회 (memNo 그대로 사용)
	    List<MypageVo> bookmarks = mypageService.getBookmarkedComplexList(memNo.intValue());
	    model.addAttribute("bookmarks", bookmarks);

	    String cmpxCd = member.getCmpxCd();
	    model.addAttribute("cmpxCd", cmpxCd);
	    System.out.println("💬 cmpxCd from session: " + cmpxCd);
	    List<IManVO> expenses = mypageService.selectwoExpenses(cmpxCd);

	    if (expenses != null && expenses.size() >= 2) {
	        IManVO recent = expenses.get(0);
	        IManVO previous = expenses.get(1);

	        Integer unitTot = recent.getUnitTot();

	        // 사용기간 표시 (null 체크 포함)
	        Date expDate = recent.getExpYearMonth();
	        if (expDate != null) {
	            LocalDate localDate = expDate.toLocalDate();
	            YearMonth yearMonth = YearMonth.from(localDate);
	            String usagePeriod = yearMonth.getYear() + "년 " + yearMonth.getMonthValue() + "월분";
	            model.addAttribute("usagePeriod", usagePeriod);
	        }

	        // 단위 총 세대 수가 유효한 경우에만 계산
	        if (unitTot != null && unitTot > 0) {
	            double recentFee = recent.getMgmtFeeTotal() != null ? recent.getMgmtFeeTotal() : 0;
	            double previousFee = previous.getMgmtFeeTotal() != null ? previous.getMgmtFeeTotal() : 0;
	            double diff = recentFee - previousFee;
	            double recentPerUnit = recentFee / unitTot;
	            double diffPerUnit = diff / unitTot;
	            String diffText = diffPerUnit > 0 ? "↑ " + String.format("%.0f원", diffPerUnit)
	                             : diffPerUnit < 0 ? "↓ " + String.format("%.0f원", Math.abs(diffPerUnit))
	                             : "-";

	            model.addAttribute("recentExpense", recent);
	            model.addAttribute("recentPerUnit", recentPerUnit);
	            model.addAttribute("diffText", diffText);
	            model.addAttribute("diffPerUnit", diffPerUnit);

	            // 항목별 세대당 관리비 계산 및 비교
	            Map<String, Object> detailPerUnit = new LinkedHashMap<>();
	            detailPerUnit.put("청소비", getPerUnitDiff("cleaningFee", recent, previous, unitTot));
	            detailPerUnit.put("경비비", getPerUnitDiff("securityFee", recent, previous, unitTot));
	            detailPerUnit.put("소독비", getPerUnitDiff("disinfectionFee", recent, previous, unitTot));
	            detailPerUnit.put("승강기 유지비", getPerUnitDiff("elevatorMaintFee", recent, previous, unitTot));
	            detailPerUnit.put("수선비", getPerUnitDiff("repairFee", recent, previous, unitTot));
	            detailPerUnit.put("공용 난방비", getPerUnitDiff("heatingFeePublic", recent, previous, unitTot));
	            detailPerUnit.put("세대 난방비", getPerUnitDiff("heatingFeePrivate", recent, previous, unitTot));
	            detailPerUnit.put("공용 가스", getPerUnitDiff("gasUsagePublic", recent, previous, unitTot));
	            detailPerUnit.put("세대 가스", getPerUnitDiff("gasUsagePrivate", recent, previous, unitTot));
	            detailPerUnit.put("공용 전기", getPerUnitDiff("elecUsagePublic", recent, previous, unitTot));
	            detailPerUnit.put("세대 전기", getPerUnitDiff("elecUsagePrivate", recent, previous, unitTot));
	            detailPerUnit.put("공용 수도", getPerUnitDiff("waterUsagePublic", recent, previous, unitTot));
	            detailPerUnit.put("세대 수도", getPerUnitDiff("waterUsagePrivate", recent, previous, unitTot));
	            detailPerUnit.put("인건비", getPerUnitDiff("laborCost", recent, previous, unitTot));
	            detailPerUnit.put("제사무비", getPerUnitDiff("officeCost", recent, previous, unitTot));
	            detailPerUnit.put("제세공과금", getPerUnitDiff("taxCost", recent, previous, unitTot));
	            detailPerUnit.put("피복비", getPerUnitDiff("uniformCost", recent, previous, unitTot));
	            detailPerUnit.put("교육훈련비", getPerUnitDiff("trainingCost", recent, previous, unitTot));
	            detailPerUnit.put("차량유지비", getPerUnitDiff("carMaintCost", recent, previous, unitTot));
	            detailPerUnit.put("그밖의부대비용", getPerUnitDiff("etcCost", recent, previous, unitTot));
	            detailPerUnit.put("지능형네트워크유지비", getPerUnitDiff("networkCost", recent, previous, unitTot));	            
	            detailPerUnit.put("시설유지비", getPerUnitDiff("facilityCost", recent, previous, unitTot));
	            detailPerUnit.put("안전점검비", getPerUnitDiff("safetyChkCost", recent, previous, unitTot));
	            detailPerUnit.put("재해예방비", getPerUnitDiff("disasterPrevCost", recent, previous, unitTot));
	            detailPerUnit.put("위탁관리수수료", getPerUnitDiff("mgmtFeeCost", recent, previous, unitTot));
	            System.out.println("📦 detailPerUnit = " + detailPerUnit);
	            model.addAttribute("detailPerUnit", detailPerUnit);
	        } else {
	            // 단위 총 세대수가 없으면 기본값 세팅
	            model.addAttribute("recentPerUnit", 0);
	            model.addAttribute("diffText", "-");
	            model.addAttribute("diffPerUnit", 0);
	            model.addAttribute("detailPerUnit", Collections.emptyMap());
	        }
	    } else {
	        // 관리비 데이터가 없거나 부족한 경우 기본값 세팅
	        model.addAttribute("recentPerUnit", 0);
	        model.addAttribute("diffText", "-");
	        model.addAttribute("diffPerUnit", 0);
	        model.addAttribute("detailPerUnit", Collections.emptyMap());
	    }

	    return "mypage/mypage";
	}

    private Map<String, Object> getPerUnitDiff(String fieldName, IManVO recent, IManVO previous, int unitTot) {
        try {
            Object recentObj = IManVO.class.getMethod("get" + capitalize(fieldName)).invoke(recent);
            Object prevObj = IManVO.class.getMethod("get" + capitalize(fieldName)).invoke(previous);

            double recentVal = 0;
            double prevVal = 0;

            if (recentObj instanceof Number) {
                recentVal = ((Number) recentObj).doubleValue();
            }
            if (prevObj instanceof Number) {
                prevVal = ((Number) prevObj).doubleValue();
            }

            double r = recentVal / unitTot;
            double p = prevVal / unitTot;
            double diff = r - p;

            String diffText = diff > 0 ? "↑ " + String.format("%.0f원", diff)
                             : diff < 0 ? "↓ " + String.format("%.0f원", Math.abs(diff))
                             : "-";

            Map<String, Object> result = new HashMap<>();
            result.put("perUnit", r);
            result.put("diffText", diffText);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("perUnit", 0, "diffText", "-");
        }
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }


	
	@GetMapping("/mypage_correction")
    public String correctionPage(HttpSession session, Model model) {
		MemberVO member = (MemberVO) session.getAttribute("loginMember");
		LoginVO loginInfo = (LoginVO) session.getAttribute("loginInfo");
		
		if (member == null || loginInfo == null) {
			return "redirect:/login";
		}
		
		model.addAttribute("member", member);
	    model.addAttribute("loginInfo", loginInfo);
	    return "mypage/mypage_correction";
    }
	
	@PostMapping("/mypage_correction")
	public String doCorrection(@RequestParam String nickname,
							   @RequestParam String currentPw,
							   @RequestParam String newPw,
							   @RequestParam String confirmPw,
							   HttpSession session,
							   Model model,
							   RedirectAttributes redirectAttributes) {
		Long memNo = (Long) session.getAttribute("memNo");
		if (memNo == null) {
			return "redirect:/login";
		}
		
		LoginVO loginInfo = (LoginVO) session.getAttribute("loginInfo");
		
		boolean isPasswordChange = (newPw != null && !newPw.isEmpty()) 
                               && (confirmPw != null && !confirmPw.isEmpty());
		
		if (isPasswordChange) { 
			if (!loginInfo.getMemPw().equals(currentPw)) {
				redirectAttributes.addAttribute("error", "currentPw");
		        return "redirect:/mypage_correction";
		    }
	
		    if (!newPw.equals(confirmPw)) {
		    	redirectAttributes.addAttribute("error", "notMatch");
		        return "redirect:/mypage_correction";
		    }
	
		    if (newPw.equals(currentPw)) {
		    	redirectAttributes.addAttribute("error", "samePw");
		        return "redirect:/mypage_correction";
		    }
		}
		
		//비밀번호 수정
		if (isPasswordChange) {
	        LoginVO login = new LoginVO();
	        login.setMemNo(memNo);
	        login.setMemPw(newPw);
	        userService.updatePassword(login);
	        
	        // 세션 무효화 (로그아웃)
	        session.invalidate();
	        
	        return "redirect:/login?passwordChanged=true";
	    }
		//닉네임 수정
		MemberVO member = new MemberVO();
		member.setMemNo(memNo);
		member.setMemNick(nickname);
		userService.updateNickname(member);
		
		MemberVO updatedMember = userService.getMemberByMemNo(memNo);
		session.setAttribute("loginMember", updatedMember);
		session.setAttribute("loginInfo", userService.getLoginInfoByMemNo(memNo));
		
		return "redirect:/mypage";
	}
	
	

	
	@GetMapping("/withdrawal")
    public String withdrawalPage(HttpSession session, RedirectAttributes redirectAttributes) {
		Long loggedInMemNo = (Long) session.getAttribute("memNo");
    	if (loggedInMemNo == null) {
    		redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
    		return "redirect:/login";
    	}
        return "mypage/withdrawal";
    }
	
	@GetMapping("/record")
	public String recordPage(HttpSession session, Model model, RedirectAttributes redirectAttributes) {
	    Long memNoLong = (Long) session.getAttribute("memNo"); // 세션에서 Long으로 받기
	    
	    if (memNoLong == null) {
    		redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
    		return "redirect:/login";
    	}
	    
	    if (memNoLong != null) {
	        Integer memNo = memNoLong.intValue(); // Integer로 변환
	        List<MypageVo> bookmarks = mypageService.getBookmarkedComplexList(memNo);
	        model.addAttribute("bookmarks", bookmarks);
	        System.out.println("세션 memNo 타입: " + session.getAttribute("memNo").getClass());
	    }

	    return "mypage/record";
	}
	// 환급액 계산
	@GetMapping("/api/refund")
	@ResponseBody
	public RefundResponse getRefundInfo(
			@RequestParam String cmpxCd,
			@RequestParam String startDate,
			@RequestParam String endDate
	) {
		System.out.println("cmpxCd = " + cmpxCd);
	    System.out.println("startDate = " + startDate);
	    System.out.println("endDate = " + endDate);
		return mypageService.calculateRefund(cmpxCd, startDate, endDate);
	}
	// 사진 업로드
	@PostMapping("/uploadProfile")
	@ResponseBody
	public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file,
												HttpSession session) {
		Long memNo = (Long) session.getAttribute("memNo");
		if (memNo == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
		}
		try {
			String uploadDir = "C:/uploads/profile/";
			File dir = new File(uploadDir);
			if (!dir.exists()) dir.mkdirs();
			
			String fileName = "profile_" + memNo + "_" + System.currentTimeMillis() + ".png";
			File dest = new File(uploadDir + fileName);
			file.transferTo(dest);
			
			String dbPath = "/uploads/profile/" + fileName;
			
			userService.updateProfileImage(memNo, dbPath);
			
			MemberVO member = (MemberVO) session.getAttribute("loginMember");
			if (member != null) {
				member.setProfileImg(dbPath);
				session.setAttribute("loginMember", member);
			}
			
			return ResponseEntity.ok(dbPath);
		}catch(IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("업로드 실패");
		}
	}
	
}