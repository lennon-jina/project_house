package com.house.team.bookmark.dao;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.house.team.bookmark.vo.BookmarkVO;

@Mapper
public interface IBookmarkDAO {
	// 찜 여부 확인 (memNo, cmpxCd 조합으로)
    int countBookmark(@Param("memNo") Long memNo, @Param("cmpxCd") String cmpxCd);

    // 찜 추가
    int insertBookmark(BookmarkVO bookmark);

    // 찜 삭제
    int deleteBookmark(@Param("memNo") Long memNo, @Param("cmpxCd") String cmpxCd);
    // 찜 목록 조회
    List<BookmarkVO> selectBookmarksByUser(String memNo);
}