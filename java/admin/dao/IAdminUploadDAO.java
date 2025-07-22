package com.house.team.admin.dao;

import org.apache.ibatis.annotations.Mapper;

import com.house.team.admin.vo.AdminUploadVO;

@Mapper
public interface IAdminUploadDAO {
	
    // 단일 AdminUploadVO 객체를 DB에 MERGE (삽입 또는 업데이트)하는 메서드
	int mergeAdminUpload(AdminUploadVO uploadVO);

}
