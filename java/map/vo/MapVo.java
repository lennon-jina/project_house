package com.house.team.map.vo;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class MapVo {
    private String cmpxCd;      // 단지 코드
    private String cmpxNm;      // 단지명
    private String cmpxTp;      // 단지분류
    private String apprDt;      // 사용승인일
    private String lglAddr;     // 주소
    private int bldgCnt;        // 동수
    private Integer unitTot;        // 세대수
    private int cctvCnt;        // CCTV 대수
    private int flrMax;         // 최고층수
    private int bsmntFlr;       // 지하층수
    private Double areaUnit;     // 세대수면적
    private String gudong;
    private String bunji;
    private String address;
    private String builtDate; // DATE -> String (yyyy-MM-dd)
    private String cords;     // GeoJSON CLOB 문자열
    private int age;
    // 에너지 효율
    private String energyGrade;     // 유사도 기반 에너지 등급
    private String certNo;          // 인증번호
    private String bldName;         // 유사 건물 이름
    private String energyReq;	    // 에너지 소비량
    
    

	public String getEnergyReq() {
		return energyReq;
	}

	public void setEnergyReq(String energyReq) {
		this.energyReq = energyReq;
	}

	public String getEnergyGrade() {
		return energyGrade;
	}

	public void setEnergyGrade(String energyGrade) {
		this.energyGrade = energyGrade;
	}

	public String getCertNo() {
		return certNo;
	}

	public void setCertNo(String certNo) {
		this.certNo = certNo;
	}

	public String getBldName() {
		return bldName;
	}

	public void setBldName(String bldName) {
		this.bldName = bldName;
	}

	public String getGudong() {
		return gudong;
	}

	public void setGudong(String gudong) {
		this.gudong = gudong;
	}

	public String getBunji() {
		return bunji;
	}

	public void setBunji(String bunji) {
		this.bunji = bunji;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getBuiltDate() {
		return builtDate;
	}

	public void setBuiltDate(String builtDate) {
		this.builtDate = builtDate;
	}

	public String getCords() {
		return cords;
	}

	public void setCords(String cords) {
		this.cords = cords;
	}

	// 파싱된 좌표 리턴
    public List<List<List<Double>>> getParsedCoordinates() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(this.cords);
            JsonNode coordNode = root.path("coordinates");
            return mapper.convertValue(coordNode, new TypeReference<>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    
    public String getCmpxCd() {
        return cmpxCd;
    }

    public void setCmpxCd(String cmpxCd) {
        this.cmpxCd = cmpxCd;
    }

    public String getCmpxNm() {
        return cmpxNm;
    }

    public void setCmpxNm(String cmpxNm) {
        this.cmpxNm = cmpxNm;
    }

    public String getCmpxTp() {
        return cmpxTp;
    }

    public void setCmpxTp(String cmpxTp) {
        this.cmpxTp = cmpxTp;
    }

    public String getApprDt() {
        return apprDt;
    }

    public void setApprDt(String apprDt) {
        this.apprDt = apprDt;
    }

    public String getLglAddr() {
        return lglAddr;
    }

    public void setLglAddr(String lglAddr) {
        this.lglAddr = lglAddr;
    }

    public int getBldgCnt() {
        return bldgCnt;
    }

    public void setBldgCnt(int bldgCnt) {
        this.bldgCnt = bldgCnt;
    }

    public  Integer  getUnitTot() {
        return unitTot;
    }

    public void setUnitTot(Integer  unitTot) {
        this.unitTot = unitTot;
    }

    public int getCctvCnt() {
        return cctvCnt;
    }

    public void setCctvCnt(int cctvCnt) {
        this.cctvCnt = cctvCnt;
    }

    public int getFlrMax() {
        return flrMax;
    }

    public void setFlrMax(int flrMax) {
        this.flrMax = flrMax;
    }

    public int getBsmntFlr() {
        return bsmntFlr;
    }

    public void setBsmntFlr(int bsmntFlr) {
        this.bsmntFlr = bsmntFlr;
    }
    
    public Double getAreaUnit() {
        return areaUnit;
    }

    public void setAreaUnit(Double areaUnit) {
        this.areaUnit = areaUnit;
    }
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

  
}
