package com.house.team.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.stats.vo.APTInfoVO;
import com.house.team.user.dao.PageMapper;

@Service
public class PageService {
	
	@Autowired
	private PageMapper pageMapper;
	
    public List<String> getSigunguList() {
        return pageMapper.selectSigunguList();
    }

    public List<String> getDongList(String sigungu) {
        return pageMapper.selectDongList(sigungu);
    }

    public List<APTInfoVO> getAptList(String sigungu, String dong) {
        return pageMapper.selectAptList(sigungu, dong);
    }
}
