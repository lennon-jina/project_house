package com.house.team.management.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.house.team.management.service.ManService;
import com.house.team.management.vo.IManVO;

@RestController
@RequestMapping("/management")
public class ManController {

    private final ManService manService;

    @Autowired
    public ManController(ManService manService) {
        this.manService = manService;
    }

    @GetMapping("/{cmpxCd}")
    public IManVO getManagementInfo(@PathVariable String cmpxCd) {
        return manService.getMan(cmpxCd);
    }
}
