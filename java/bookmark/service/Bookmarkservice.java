package com.house.team.bookmark.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.house.team.bookmark.dao.IBookmarkDAO;
import com.house.team.bookmark.vo.BookmarkVO;

import jakarta.transaction.Transactional;

@Service
public class Bookmarkservice {

    private final IBookmarkDAO bookmarkDAO;

    public Bookmarkservice(IBookmarkDAO bookmarkDAO) {
        this.bookmarkDAO = bookmarkDAO;
    }

    @Transactional
    public boolean toggleBookmark(Long memNo, String cmpxCd) {
        int count = bookmarkDAO.countBookmark(memNo, cmpxCd);

        if(count > 0) {
            // 찜 되어 있으면 삭제
            bookmarkDAO.deleteBookmark(memNo, cmpxCd);
            return false; // 해제됨
        } else {
            // 찜 안되어 있으면 추가
            BookmarkVO bookmark = new BookmarkVO();
            bookmark.setMemNo(memNo);
            bookmark.setCmpxCd(cmpxCd);
            bookmarkDAO.insertBookmark(bookmark);
            return true;  // 찜됨
        }
    }
    
    public List<BookmarkVO> getBookmarksByUser(String memNo) {
        return bookmarkDAO.selectBookmarksByUser(memNo);
    }
}
