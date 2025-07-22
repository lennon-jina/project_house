package com.house.team.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.house.team.management.dao.IManDAO;
import com.house.team.management.vo.IManVO;

@Service
public class ManService {

    private final IManDAO manDAO;

    @Autowired
    public ManService(IManDAO manDAO) {
        this.manDAO = manDAO;
    }

    public IManVO getMan(String cmpxCd) {
        return manDAO.selectExpenseByCmpxCd(cmpxCd);
    }
}
