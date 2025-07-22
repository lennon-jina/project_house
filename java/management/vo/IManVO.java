package com.house.team.management.vo;

import java.sql.Date;

public class IManVO {
	   private String cmpxCd;
	   private Integer unitTot;
	    
	    private Double mgmtFeeTotal;
	    private Double cleaningFee;
	    private Double securityFee;
	    private Double disinfectionFee;
	    private Double elevatorMaintFee;
	    private Double repairFee;

	    private Double heatingFeePublic;
	    private Double heatingFeePrivate;

	    private Double gasUsagePublic;
	    private Double gasUsagePrivate;

	    private Double elecUsagePublic;
	    private Double elecUsagePrivate;

	    private Double waterUsagePublic;
	    private Double waterUsagePrivate;
	    
	    private Date expYearMonth;
	    
		public String getCmpxCd() {
			return cmpxCd;
		}
		public void setCmpxCd(String cmpxCd) {
			this.cmpxCd = cmpxCd;
		}
		 public Integer getUnitTot() {
		        return unitTot;
		}

	
		public void setUnitTot(Integer unitTot) {
		      this.unitTot = unitTot;
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

	    // Getters and Setters
	    

}
