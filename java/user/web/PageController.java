package com.house.team.user.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.house.team.stats.service.IStatsService;
import com.house.team.stats.vo.APTInfoVO;
import com.house.team.user.service.PageService;
import com.house.team.user.service.UserService;
import com.house.team.user.vo.MemberVO;

import jakarta.servlet.http.HttpSession;

@Controller
public class PageController {
	@Autowired
	private IStatsService statsService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PageService pageService;
	
	@GetMapping("/registerApt")
    public String registerApt() {
    	return "main/registerApt";
    }
	
	@PostMapping("/registerApt")
	public String registerAptInfo(
			
	        HttpSession session,
	        @RequestParam String cmpxCd,
	        @RequestParam String aptName,
	        @RequestParam int unitDong,
	        @RequestParam int unitHo,
	        RedirectAttributes redirectAttributes) {

	    Long memNo = (Long) session.getAttribute("memNo");
	    if (memNo == null) {
	        redirectAttributes.addFlashAttribute("error", "로그인이 필요합니다.");
	        return "redirect:/login";
	    }

	    // DB 업데이트
	    userService.updateMemberAptInfo(memNo, cmpxCd, aptName, unitDong, unitHo);

	    // 세션 개별 항목 갱신
	    session.setAttribute("aptName", aptName);
	    session.setAttribute("dongNo", unitDong);
	    session.setAttribute("roomNo", unitHo);
	    session.setAttribute("cmpxCd", cmpxCd);  // ← 필요 시 개별 저장

	    // loginMember 갱신
	    MemberVO member = (MemberVO) session.getAttribute("loginMember");
	    if (member != null) {
	        member.setAptName(aptName);
	        member.setDongNo(unitDong);
	        member.setRoomNo(unitHo);
	        member.setCmpxCd(cmpxCd);  // ← ★ 이거 반드시 추가! (기존 누락 부분)

	        session.setAttribute("loginMember", member);  // 갱신 저장
	    }

	    redirectAttributes.addFlashAttribute("message", "아파트 정보가 등록되었습니다.");
	    return "redirect:/";
	}
	@GetMapping("/sigungu")
	@ResponseBody
	public List<String> getSigunguList(){
		List<String> result = pageService.getSigunguList();
	    System.out.println("SIGUNGU LIST: " + result);
	    return result;
	}
	
	@GetMapping("/dong")
	@ResponseBody
	public List<String> getDongList(@RequestParam String sigungu) {
		return pageService.getDongList(sigungu);
	}
	
	@GetMapping("/aptList")
	@ResponseBody
	public List<APTInfoVO> getAptList(@RequestParam String sigungu, @RequestParam String dong) {
		return pageService.getAptList(sigungu, dong);
	}
}
