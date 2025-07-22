package com.house.team.admin.vo;

import java.sql.Date;

public class AdminUploadVO {
	private String cmpxCd;	//단지 코드
    
    private Double mgmtFeeTotal;   	  // 공용관리비계
    private Double cleaningFee;		  // 청소비
    private Double securityFee;		  // 경비비
    private Double disinfectionFee;	  // 소독비
    private Double elevatorMaintFee;  // 승강기 유지비
    private Double repairFee;  		  // 수선비

    private Double heatingFeePublic;	// 난방비(공용)
    private Double heatingFeePrivate;	// 난방비(전용)

    private Double gasUsagePublic;		// 가스비(공용)
    private Double gasUsagePrivate;		// 가스비(전용)

    private Double elecUsagePublic;		// 전기료(공용)
    private Double elecUsagePrivate;    // 전기료(전용)

    private Double waterUsagePublic;	// 수도료(공용)
    private Double waterUsagePrivate;   // 수도료(전용)
    
    private Date expYearMonth;			// 작성년월
    
    
    // Getter,Setter
	public String getCmpxCd() {
		return cmpxCd;
	}

	public void setCmpxCd(String cmpxCd) {
		this.cmpxCd = cmpxCd;
	}

	public Double getMgmtFeeTotal() {
		return mgmtFeeTotal;
	}

	public void setMgmtFeeTotal(Double mgmtFeeTotal) {
		this.mgmtFeeTotal = mgmtFeeTotal;
	}

	public Double getCleaningFee() {
		return cleaningFee;
	}

	public void setCleaningFee(Double cleaningFee) {
		this.cleaningFee = cleaningFee;
	}

	public Double getSecurityFee() {
		return securityFee;
	}

	public void setSecurityFee(Double securityFee) {
		this.securityFee = securityFee;
	}

	public Double getDisinfectionFee() {
		return disinfectionFee;
	}

	public void setDisinfectionFee(Double disinfectionFee) {
		this.disinfectionFee = disinfectionFee;
	}

	public Double getElevatorMaintFee() {
		return elevatorMaintFee;
	}

	public void setElevatorMaintFee(Double elevatorMaintFee) {
		this.elevatorMaintFee = elevatorMaintFee;
	}

	public Double getRepairFee() {
		return repairFee;
	}

	public void setRepairFee(Double repairFee) {
		this.repairFee = repairFee;
	}

	public Double getHeatingFeePublic() {
		return heatingFeePublic;
	}

	public void setHeatingFeePublic(Double heatingFeePublic) {
		this.heatingFeePublic = heatingFeePublic;
	}

	public Double getHeatingFeePrivate() {
		return heatingFeePrivate;
	}

	public void setHeatingFeePrivate(Double heatingFeePrivate) {
		this.heatingFeePrivate = heatingFeePrivate;
	}

	public Double getGasUsagePublic() {
		return gasUsagePublic;
	}

	public void setGasUsagePublic(Double gasUsagePublic) {
		this.gasUsagePublic = gasUsagePublic;
	}

	public Double getGasUsagePrivate() {
		return gasUsagePrivate;
	}

	public void setGasUsagePrivate(Double gasUsagePrivate) {
		this.gasUsagePrivate = gasUsagePrivate;
	}

	public Double getElecUsagePublic() {
		return elecUsagePublic;
	}

	public void setElecUsagePublic(Double elecUsagePublic) {
		this.elecUsagePublic = elecUsagePublic;
	}

	public Double getElecUsagePrivate() {
		return elecUsagePrivate;
	}

	public void setElecUsagePrivate(Double elecUsagePrivate) {
		this.elecUsagePrivate = elecUsagePrivate;
	}

	public Double getWaterUsagePublic() {
		return waterUsagePublic;
	}

	public void setWaterUsagePublic(Double waterUsagePublic) {
		this.waterUsagePublic = waterUsagePublic;
	}

	public Double getWaterUsagePrivate() {
		return waterUsagePrivate;
	}

	public void setWaterUsagePrivate(Double waterUsagePrivate) {
		this.waterUsagePrivate = waterUsagePrivate;
	}

	public Date getExpYearMonth() {
		return expYearMonth;
	}

	public void setExpYearMonth(Date expYearMonth) {
		this.expYearMonth = expYearMonth;
	}
    
    
}
