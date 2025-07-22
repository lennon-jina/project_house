package com.house.team.admin.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.admin.dao.IAdminQnADAO;
import com.house.team.admin.vo.AdminQnAVO;

@Service
public class AdminQnAService {

	@Autowired
	private IAdminQnADAO adminQnADAO; 
	
	// 문의글 로드 및 페이징
	public List<AdminQnAVO> getQnaList(int page, int size, String searchField, String keyword, String sortOrder){
		int start = (page-1)*size+1;
		int end = page*size;
		return adminQnADAO.getQnaList(start, end, searchField, keyword,sortOrder);
	}
	
	// 키워드별 검색 결과
	public int getQnaCount(String searchField, String keyword, String sortOrder) {
		return adminQnADAO.getQnaCount(searchField, keyword, sortOrder);
	}
	
	// 문의글 넘버 조회
	public AdminQnAVO getQnaById(int boardNo) {
		return adminQnADAO.getQnaById(boardNo);
	}
	
	// 문의글 삭제
	 public void deleteQna(int boardNo) { 
        adminQnADAO.deleteQna(boardNo); 
    }
	
	// 체크박스 문의글 삭제
	public int checkDelete(@Param("boardNos") List<Integer> boardNos) {
		return adminQnADAO.checkDelete(boardNos);
	}
	 
	// ========= 답변 =========
	// 답변 작성 
    public void insertQnaComment(AdminQnAVO adminQnAVO) {
        adminQnADAO.updateQnaAnswer(adminQnAVO); 
    }

    // 답변 수정
    public void uploadQnaComment(AdminQnAVO adminQnAVO) {
        adminQnADAO.updateQnaAnswer(adminQnAVO);
    }

    // 답변 삭제 
    public void deleteQnaComment(int boardNo) {
        adminQnADAO.clearQnaAnswer(boardNo);
    }
    
    // 대기중인 문의글 목록	
    public List<AdminQnAVO> noCommList(int page, int size){
    	int start = (page-1)*size+1;
		int end = page*size;
		return adminQnADAO.noCommList(start, end);
    }
    public int getNoCommCount() {
    	return adminQnADAO.getNoCommCount();
    }
}
