package com.house.team.agent.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpSession;

@Controller
public class AgentController {
	
	@GetMapping("/agent")
    public String agentPage(HttpSession session, RedirectAttributes redirectAttributes) {
		Long loggedInMemNo = (Long) session.getAttribute("memNo");
		if (loggedInMemNo == null) {
		    redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인이 필요합니다.");
		    return "redirect:/";
		}
		return "agent/agent";
    }
	
	@GetMapping("/agent_view")
    public String agentviewPage(HttpSession session, RedirectAttributes redirectAttributes) {
		Long loggedInMemNo = (Long) session.getAttribute("memNo");
    	if (loggedInMemNo == null) {
    		redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
    		return "redirect:/login";
    	}
        return "agent/agent_view";
    }

}