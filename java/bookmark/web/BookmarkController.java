package com.house.team.bookmark.web;



import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.house.team.bookmark.service.Bookmarkservice;


import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/bookmark")
public class BookmarkController {

    private final Bookmarkservice bookmarkService;

    public BookmarkController(Bookmarkservice bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggleBookmark(@RequestBody Map<String, String> data, HttpSession session) {
        String cmpxCd = data.get("cmpxCd");
        Long memNo = (Long) session.getAttribute("memNo"); // 예시: 세션에서 회원번호 꺼내기

        Map<String, Object> result = new HashMap<>();

        if(memNo == null) {
            result.put("success", false);
            result.put("message", "로그인이 필요합니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        boolean bookmarked = bookmarkService.toggleBookmark(memNo, cmpxCd);

        result.put("success", true);
        result.put("bookmarked", bookmarked);

        return ResponseEntity.ok(result);
    }
}

