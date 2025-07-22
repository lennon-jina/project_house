package com.house.team.stats.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.house.team.stats.dao.IAPTInfoDAO;
import com.house.team.stats.service.IStatsService;
import com.house.team.stats.vo.APTInfoVO;
import com.house.team.stats.vo.ElectricAreaVO;
import com.house.team.stats.vo.ElectricTrendVO;
import com.house.team.stats.vo.IndividualFeeTrendVO;
import com.house.team.stats.vo.MgmtCompositionVO;
import com.house.team.stats.vo.MgmtCostComparisonVO;
import com.house.team.stats.vo.PublicMgmtFeeTrendVO;
import com.house.team.stats.vo.ReserveFundMonthlyVO;
import com.house.team.stats.vo.ReserveFundStatusVO;
import com.house.team.stats.vo.ReserveFundTrendVO;
import com.house.team.stats.vo.SeasonalElectricVO;

import jakarta.servlet.http.HttpSession;

@Controller
public class StatsController {

    @Autowired
    private IStatsService statsService;
    
    @Autowired
    private IAPTInfoDAO aptInfoDAO;
    
    @GetMapping("/stats")
    public String statsPage() {
        return "stats/index";
    }
    
    @GetMapping("/test")
    public String testPage(HttpSession session, RedirectAttributes redirectAttributes) {
    	Long loggedInMemNo = (Long) session.getAttribute("memNo");
    	if (loggedInMemNo == null) {
    		redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
    		return "redirect:/login";
    	}
    	return "stats/test";
    }
    
    @GetMapping("/electric")
    public String electricPage(Model model, HttpSession session, RedirectAttributes redirectAttributes) {
    	Long loggedInMemNo = (Long) session.getAttribute("memNo");
    	if (loggedInMemNo == null) {
    		redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
    		return "redirect:/login";
    	}
    	List<APTInfoVO> apartmentList = aptInfoDAO.getAllApartments();
    	model.addAttribute("apartmentList", apartmentList);
        return "stats/electric";
    }
    
    @GetMapping("/management")
    public String managementPage(HttpSession session, RedirectAttributes redirectAttributes) {
    	Long loggedInMemNo = (Long) session.getAttribute("memNo");
    	if (loggedInMemNo == null) {
    		redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인 후 이용 가능합니다.");
    		return "redirect:/login";
    	}
        return "stats/management";
    }

    // 전체 아파트 목록 조회 API
    @GetMapping("/api/apartments")
    @ResponseBody
    public ResponseEntity<List<APTInfoVO>> getAllApartments() {
        try {
            List<APTInfoVO> apartments = statsService.getAllApartments();
            return ResponseEntity.ok(apartments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 🆕 아파트 노후도 분류 조회 API (새로 추가)
    @GetMapping("/api/apartment/classification/{cmpxCd}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getApartmentClassification(@PathVariable String cmpxCd) {
        try {
            Map<String, Object> result = statsService.getApartmentClassification(cmpxCd);
            if (result.get("apartmentInfo") == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 기존 아파트 비교 정보 조회 API
    @GetMapping("/api/apartment/comparison/{cmpxCd}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getApartmentComparison(@PathVariable String cmpxCd) {
        try {
            Map<String, Object> result = statsService.getApartmentComparison(cmpxCd);
            if (result.get("baseApartment") == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 🆕 전기량 API 호출용 아파트 비교 정보 조회 API (단지코드 포함)
    @GetMapping("/api/apartment/electricity-comparison/{cmpxCd}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getElectricityComparison(@PathVariable String cmpxCd) {
        try {
            // 기존 서비스 메서드 그대로 사용 (단지코드가 이미 포함되어 있음)
            Map<String, Object> result = statsService.getApartmentComparison(cmpxCd);
            
            if (result.get("baseApartment") == null) {
                return ResponseEntity.notFound().build();
            }
            
            // 응답 데이터 구조:
            // {
            //   "baseApartment": APTInfoVO (cmpxCd 포함),
            //   "similarApartments": List<APTInfoVO> (각각 cmpxCd 포함),
            //   "baseArea": AREAInfoVO,
            //   "baseAgeCategory": String
            // }
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 관리비 비교 API
    @PostMapping("/api/management/compare")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getMgmtComparison(@RequestBody List<String> cmpxCdList) {
        try {
            if (cmpxCdList == null || cmpxCdList.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            String baseCmpxCd = cmpxCdList.get(0); // 첫 번째를 기준으로 설정
            Map<String, Object> result = statsService.getMgmtComparison(baseCmpxCd, cmpxCdList);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 상세 통계 API
    @GetMapping("/api/apartment/stats/{cmpxCd}")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getApartmentStats(@PathVariable String cmpxCd) {
        try {
            Map<String, Object> result = statsService.getApartmentStats(cmpxCd);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
      
    // 전기료 연별 트렌드 분석 API
    @GetMapping("/api/electric/yearly-trend")
    @ResponseBody
    public ResponseEntity<List<ElectricTrendVO>> getYearlyElectricTrend() {
        try {
            List<ElectricTrendVO> result = statsService.getYearlyElectricTrend();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // 전기료 월별 데이터 API
    @GetMapping("/api/electric/monthly-data")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getMonthlyElectricData(@RequestParam String year) {
        try {
            Map<String, Object> result = statsService.getMonthlyElectricData(year);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 계절별 전기료 분석 API
    @GetMapping("/api/electric/seasonal-data")
    @ResponseBody
    public ResponseEntity<List<SeasonalElectricVO>> getSeasonalElectricData() {
        try {
            List<SeasonalElectricVO> result = statsService.getSeasonalElectricData();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 면적당 전기료 효율 분석 API
    @GetMapping("/api/electric/area-efficiency")
    @ResponseBody
    public ResponseEntity<List<ElectricAreaVO>> getElectricAreaEfficiency() {
        try {
            List<ElectricAreaVO> result = statsService.getElectricAreaEfficiency();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 특정 연도 면적당 전기료 효율 분석 API
    @GetMapping("/api/electric/area-efficiency/{year}")
    @ResponseBody
    public ResponseEntity<List<ElectricAreaVO>> getElectricAreaEfficiencyByYear(@PathVariable String year) {
        try {
            List<ElectricAreaVO> result = statsService.getElectricAreaEfficiencyByYear(year);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 노후도 그룹별 개별사용료계 월별 추이 API
    @GetMapping("/api/management/individual-fee-trend")
    @ResponseBody
    public ResponseEntity<List<IndividualFeeTrendVO>> getIndividualFeeTrend() {
        try {
            List<IndividualFeeTrendVO> result = statsService.getIndividualFeeTrendByAgeGroup();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 노후도 그룹별 공용관리비계 월별 추이 API
    @GetMapping("/api/management/public-mgmt-fee-trend")
    @ResponseBody
    public ResponseEntity<List<PublicMgmtFeeTrendVO>> getPublicMgmtFeeTrend() {
        try {
            List<PublicMgmtFeeTrendVO> result = statsService.getPublicMgmtFeeTrendByAgeGroup();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 노후도 그룹별 관리비 항목 비중 API
    @GetMapping("/api/management/composition")
    @ResponseBody
    public ResponseEntity<List<MgmtCompositionVO>> getMgmtComposition() {
        try {
            List<MgmtCompositionVO> result = statsService.getMgmtCompositionByAgeGroup();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 연식별 주요 관리비 항목 지출 비교 API
    @GetMapping("/api/management/cost-comparison")
    @ResponseBody
    public ResponseEntity<List<MgmtCostComparisonVO>> getMgmtCostComparison() {
        try {
            List<MgmtCostComparisonVO> result = statsService.getMgmtCostComparisonByAgeGroup();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 노후도 그룹별 10년간 연평균 장충금 현황 API
    @GetMapping("/api/management/reserve-fund-status")
    @ResponseBody
    public ResponseEntity<List<ReserveFundStatusVO>> getReserveFundStatus() {
        try {
            List<ReserveFundStatusVO> result = statsService.getReserveFundStatusByAgeGroup();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 노후도 그룹별 장충금 총적립금액 연도별 추이 API (2015~2024)
    @GetMapping("/api/management/reserve-fund-trend")
    @ResponseBody
    public ResponseEntity<List<ReserveFundTrendVO>> getReserveFundTrend() {
        try {
            List<ReserveFundTrendVO> result = statsService.getReserveFundTrendByAgeGroup();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 2024년 노후도 그룹별 월별 장충금 현황 API
    @GetMapping("/api/management/reserve-fund-monthly")
    @ResponseBody
    public ResponseEntity<List<ReserveFundMonthlyVO>> getReserveFundMonthly() {
        try {
            List<ReserveFundMonthlyVO> result = statsService.getReserveFundMonthlyByAgeGroup();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // 전기료 비교 API 추가
    @PostMapping("/api/electric/compare")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getElectricComparison(@RequestBody List<String> cmpxCdList) {
        try {
            if (cmpxCdList == null || cmpxCdList.isEmpty()) {
                Map<String, Object> errorResult = new HashMap<>();
                errorResult.put("success", false);
                errorResult.put("message", "비교할 아파트 코드 목록이 비어있습니다.");
                return ResponseEntity.badRequest().body(errorResult);
            }

            String baseCmpxCd = cmpxCdList.get(0); // 첫 번째를 기준으로 설정
            Map<String, Object> result = statsService.getElectricComparison(baseCmpxCd, cmpxCdList);
            
            // 결과 확인
            if (result.get("success") != null && (Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.internalServerError().body(result);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("success", false);
            errorResult.put("message", "전기료 비교 처리 중 오류가 발생했습니다: " + e.getMessage());
            errorResult.put("electricComparison", new ArrayList<>());
            
            return ResponseEntity.internalServerError().body(errorResult);
        }
    }
    // 전기료 test 페이지
    @GetMapping("/api/electric/summary/{year}")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> getElectricSummary(
            @PathVariable String year,
            @RequestParam(required = false) String complexCode // complexCode 파라미터 추가, 필수가 아님
        ) {
            try {
                Map<String, Object> params = new HashMap<>();
                params.put("year", year);
                if (complexCode != null && !complexCode.isEmpty()) {
                    params.put("complexCode", complexCode);
                }
                List<Map<String, Object>> data = statsService.getMonthlyElectricSummary(params);
                
                if (data == null) {
                    return ResponseEntity.ok(List.of());
                }
                return ResponseEntity.ok(data);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError().build();
            }
        }
    // 관리비 test 페이지
    @GetMapping("/api/mgmt/summary/{year}")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> getMgmtSummary(
    		@PathVariable String year,
    		@RequestParam(required = false) String complexCode) {
        try {
        	Map<String, Object> params = new HashMap<>();
        	params.put("year", year);
        	if (complexCode != null && !complexCode.isEmpty()) {
        		params.put("complexCode", complexCode);
        	}
            List<Map<String, Object>> data = statsService.getMonthlyMgmtSummary(params);
            
            if (data == null) {
            	return ResponseEntity.ok(List.of());
            }
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}