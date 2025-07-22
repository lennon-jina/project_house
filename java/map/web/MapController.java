package com.house.team.map.web;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.house.team.management.service.ManService;
import com.house.team.management.vo.IManVO;
import com.house.team.map.service.MapService;
import com.house.team.map.vo.MapVo;
import com.house.team.stats.service.StatsServiceImpl;
import com.house.team.stats.vo.APTInfoVO;
import com.house.team.stats.vo.MgmtInfoVO;

import jakarta.servlet.http.HttpSession;

@Controller
public class MapController {

    @Autowired
    private MapService mapService;
    
    @Autowired
    private ManService manService;

    @GetMapping("/map")
    public String showMapPage(@RequestParam(required = false) String cmpxCd, Model model, 
    						  HttpSession session, RedirectAttributes redirectAttributes) {
    	Long loggedInMemNo = (Long) session.getAttribute("memNo");
    	if (loggedInMemNo == null) {
    	    redirectAttributes.addFlashAttribute("loginRequiredMessage", "로그인이 필요합니다.");
    	    return "redirect:/";
    	}

        // 1) 단지 리스트 조회
        List<MapVo> cmpxList = mapService.getComplexList();
        model.addAttribute("cmpxList", cmpxList);
        
        

        // 2) 단지 상세정보 조회
        if (cmpxCd != null && !cmpxCd.isEmpty()) {
            MapVo mapVo = mapService.getComplexSummary(cmpxCd);
            model.addAttribute("mapVo", mapVo);

            MapVo areaVo = mapService.getComparea(cmpxCd);
            model.addAttribute("areaVo", areaVo);

            IManVO manVO = manService.getMan(cmpxCd);
        
            
            // 👉 여기에 추가!
            List<MapVo> similarList = mapService.getSimilarComplexes(cmpxCd);

            System.out.println("similarList.size() = " + (similarList == null ? "null" : similarList.size()));
            if (similarList != null) {
                for (MapVo apt : similarList) {
                    System.out.println("apt.cmpxNm = " + apt.getCmpxNm());
                }
            }

            model.addAttribute("similarList", similarList);

            // manVO null 체크
            if (manVO != null) {
                model.addAttribute("manVO", manVO);

                // 세대당 관리비 계산
                Double unitFee = null;
                if (manVO.getMgmtFeeTotal() != null && mapVo != null && mapVo.getUnitTot() != null && mapVo.getUnitTot() > 0) {
                    unitFee = manVO.getMgmtFeeTotal() / mapVo.getUnitTot();
                    unitFee = (double) Math.round(unitFee);
                }
                model.addAttribute("unitFee", unitFee);

                // 공용 관리비 항목 합산 후 세대당으로 나눈 평균값 계산
                Double publicMgmtFeePerUnit = null;

                List<Double> fees = Arrays.asList(
                    manVO.getCleaningFee(),
                    manVO.getSecurityFee(),
                    manVO.getDisinfectionFee(),
                    manVO.getElevatorMaintFee(),
                    manVO.getRepairFee(),
                    manVO.getHeatingFeePublic(),
                    manVO.getGasUsagePublic(),
                    manVO.getElecUsagePublic(),
                    manVO.getWaterUsagePublic()
                );

                double sum = fees.stream()
                                 .filter(Objects::nonNull)
                                 .mapToDouble(Double::doubleValue)
                                 .sum();

                if (sum > 0 && mapVo.getUnitTot() != null && mapVo.getUnitTot() > 0) {
                    publicMgmtFeePerUnit = sum / mapVo.getUnitTot();
                    publicMgmtFeePerUnit = (double) Math.round(publicMgmtFeePerUnit);
                }

                model.addAttribute("publicMgmtFee", publicMgmtFeePerUnit);

            } else {
                // manVO가 없으면 기본값 세팅
                model.addAttribute("manVO", null);
                model.addAttribute("unitFee", null);
                model.addAttribute("publicMgmtFee", null);
            }
            
            // 개인 관리비도 세대수로 나누기
            Double personalMgmtFee = null;
            if (manVO != null && mapVo != null && mapVo.getUnitTot() != null && mapVo.getUnitTot() > 0) {
                List<Double> personalFees = Arrays.asList(
                    manVO.getHeatingFeePrivate(), // 개별 난방
                    manVO.getGasUsagePrivate(),   // 개별 가스
                    manVO.getElecUsagePrivate(),  // 개별 전기
                    manVO.getWaterUsagePrivate()  // 개별 수도
                );

                double personalSum = personalFees.stream()
                                                 .filter(Objects::nonNull)
                                                 .mapToDouble(Double::doubleValue)
                                                 .sum();

                if (personalSum > 0) {
                    personalMgmtFee = personalSum / mapVo.getUnitTot();
                    personalMgmtFee = (double) Math.round(personalMgmtFee);
                }
            }
            model.addAttribute("personalMgmtFee", personalMgmtFee);
         // 예시 - int로 변환
            if (manVO != null) {
                // 예: cleaningFee 정수 변환 후 모델에 추가
            	Integer mgmtFeeTotalInt = manVO.getMgmtFeeTotal() != null ? (int) Math.round(manVO.getMgmtFeeTotal()) : null;
            	model.addAttribute("mgmtFeeTotalInt", mgmtFeeTotalInt);
            	
                Integer cleaningFeeInt = manVO.getCleaningFee() != null ? (int) Math.round(manVO.getCleaningFee()) : null;
                model.addAttribute("cleaningFeeInt", cleaningFeeInt);

                // 다른 항목들도 동일하게
                Integer securityFeeInt = manVO.getSecurityFee() != null ? (int) Math.round(manVO.getSecurityFee()) : null;
                model.addAttribute("securityFeeInt", securityFeeInt);

                Integer disinfectionFeeInt = manVO.getDisinfectionFee() != null ? (int) Math.round(manVO.getDisinfectionFee()) : null;
                model.addAttribute("disinfectionFeeInt", disinfectionFeeInt);

                Integer elevatorMaintFeeInt = manVO.getElevatorMaintFee() != null ? (int) Math.round(manVO.getElevatorMaintFee()) : null;
                model.addAttribute("elevatorMaintFeeInt", elevatorMaintFeeInt);

                Integer repairFeeInt = manVO.getRepairFee() != null ? (int) Math.round(manVO.getRepairFee()) : null;
                model.addAttribute("repairFeeInt", repairFeeInt);

                
                // 필요시 다른 항목들도...
            }
         // 개별 관리비 각 항목 세대당 비용 계산
            Double heatingFeePrivatePerUnit = null;
            Double gasUsagePrivatePerUnit = null;
            Double elecUsagePrivatePerUnit = null;
            Double waterUsagePrivatePerUnit = null;

            if (manVO != null && mapVo != null && mapVo.getUnitTot() != null && mapVo.getUnitTot() > 0) {
                Integer unitTot = mapVo.getUnitTot();

                if (manVO.getHeatingFeePrivate() != null) {
                    heatingFeePrivatePerUnit = manVO.getHeatingFeePrivate() / unitTot;
                    heatingFeePrivatePerUnit = (double) Math.round(heatingFeePrivatePerUnit);
                }

                if (manVO.getGasUsagePrivate() != null) {
                    gasUsagePrivatePerUnit = manVO.getGasUsagePrivate() / unitTot;
                    gasUsagePrivatePerUnit = (double) Math.round(gasUsagePrivatePerUnit);
                }

                if (manVO.getElecUsagePrivate() != null) {
                    elecUsagePrivatePerUnit = manVO.getElecUsagePrivate() / unitTot;
                    elecUsagePrivatePerUnit = (double) Math.round(elecUsagePrivatePerUnit);
                }

                if (manVO.getWaterUsagePrivate() != null) {
                    waterUsagePrivatePerUnit = manVO.getWaterUsagePrivate() / unitTot;
                    waterUsagePrivatePerUnit = (double) Math.round(waterUsagePrivatePerUnit);
                }
            }

            // 모델에 추가
            model.addAttribute("heatingFeePrivatePerUnit", heatingFeePrivatePerUnit);
            model.addAttribute("gasUsagePrivatePerUnit", gasUsagePrivatePerUnit);
            model.addAttribute("elecUsagePrivatePerUnit", elecUsagePrivatePerUnit);
            model.addAttribute("waterUsagePrivatePerUnit", waterUsagePrivatePerUnit);
            
            
            if (manVO != null && manVO.getExpYearMonth() != null) {
                model.addAttribute("expYearMonth", manVO.getExpYearMonth());
            }

        }
        

        return "map/map";
    }
    //커스텀 유틸 클래스 등록 #numbers.formatInteger(...) 는 Thymeleaf 3.1+ 에서는 제공되지 않음.
    @Component("formatUtil")
    public class FormatUtil {
        public String money(Integer value) {
            if (value == null || value == 0) return "정보 없음";
            return String.format("%,d원", value);
        }
    }
    @GetMapping("/geojson")
    @ResponseBody
    public Map<String, Object> getGeoJson(String dong) {
        List<MapVo> polygons = mapService.getPolygonsByDong(dong);
        List<Map<String, Object>> features = new ArrayList<>();

        for (MapVo vo : polygons) {
            Map<String, Object> feature = new HashMap<>();
            feature.put("type", "Feature");

            Map<String, Object> geometry = new HashMap<>();
            geometry.put("type", "Polygon");
            geometry.put("coordinates", vo.getParsedCoordinates());

            Map<String, Object> properties = new HashMap<>();
            properties.put("A4", vo.getGudong());   // 예: 대전광역시 동구 효동
            properties.put("A5", vo.getBunji());
            properties.put("A13", vo.getBuiltDate());

            feature.put("geometry", geometry);
            feature.put("properties", properties);
            features.add(feature);
        }

        Map<String, Object> geoJson = new HashMap<>();
        geoJson.put("type", "FeatureCollection");
        geoJson.put("features", features);
        return geoJson;
    }
    
    @GetMapping("/buildings")
    public List<MapVo> searchBuildings(@RequestParam String keyword) {
        return mapService.searchBuildings(keyword);
    }
    
    @GetMapping("/searchKeyword")
    @ResponseBody
    public List<APTInfoVO> searchKeyword(String keyword) {
        return mapService.searchKeyword(keyword);
    }
    
    @GetMapping("/api/complexDetail")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getComplexDetail(@RequestParam String cmpxCd) {
    	System.out.println("🔥 /api/complexDetail 호출: cmpxCd = " + cmpxCd); // ✅ 로그
        Map<String, Object> response = new HashMap<>();

        // 1) 기본 단지 정보 조회
        MapVo mapVo = mapService.getComplexSummary(cmpxCd);
        MapVo areaVo = mapService.getComparea(cmpxCd);
        IManVO manVO = manService.getMan(cmpxCd);

        // 2) 유사 단지 리스트 조회
        List<MapVo> similarList = mapService.getSimilarComplexes(cmpxCd);
        response.put("similarList", similarList); // ✅ 반드시 이 줄 추가!

        // 3) 응답 맵에 데이터 담기
        response.put("mapVo", mapVo);
        response.put("areaVo", areaVo);
        response.put("manVO", manVO);
        response.put("similarList", similarList);

        // 4) 관리비 정수 변환 (manVO가 null이 아닐 때)
        if (manVO != null) {
            response.put("mgmtFeeTotalInt", manVO.getMgmtFeeTotal() != null ? (int) Math.round(manVO.getMgmtFeeTotal()) : null);
            response.put("cleaningFeeInt", manVO.getCleaningFee() != null ? (int) Math.round(manVO.getCleaningFee()) : null);
            response.put("securityFeeInt", manVO.getSecurityFee() != null ? (int) Math.round(manVO.getSecurityFee()) : null);
            response.put("disinfectionFeeInt", manVO.getDisinfectionFee() != null ? (int) Math.round(manVO.getDisinfectionFee()) : null);
            response.put("elevatorMaintFeeInt", manVO.getElevatorMaintFee() != null ? (int) Math.round(manVO.getElevatorMaintFee()) : null);
            response.put("repairFeeInt", manVO.getRepairFee() != null ? (int) Math.round(manVO.getRepairFee()) : null);
        }

        // 5) 개별 사용료 세대당 평균 계산
        Double heatingFeePrivatePerUnit = null;
        Double gasUsagePrivatePerUnit = null;
        Double elecUsagePrivatePerUnit = null;
        Double waterUsagePrivatePerUnit = null;

        if (manVO != null && mapVo != null && mapVo.getUnitTot() != null && mapVo.getUnitTot() > 0) {
            int unitTot = mapVo.getUnitTot();

            if (manVO.getHeatingFeePrivate() != null)
                heatingFeePrivatePerUnit = (double) Math.round(manVO.getHeatingFeePrivate() / unitTot);
            if (manVO.getGasUsagePrivate() != null)
                gasUsagePrivatePerUnit = (double) Math.round(manVO.getGasUsagePrivate() / unitTot);
            if (manVO.getElecUsagePrivate() != null)
                elecUsagePrivatePerUnit = (double) Math.round(manVO.getElecUsagePrivate() / unitTot);
            if (manVO.getWaterUsagePrivate() != null)
                waterUsagePrivatePerUnit = (double) Math.round(manVO.getWaterUsagePrivate() / unitTot);
        }

        response.put("heatingFeePrivatePerUnit", heatingFeePrivatePerUnit);
        response.put("gasUsagePrivatePerUnit", gasUsagePrivatePerUnit);
        response.put("elecUsagePrivatePerUnit", elecUsagePrivatePerUnit);
        response.put("waterUsagePrivatePerUnit", waterUsagePrivatePerUnit);

        // 6) 세대당 관리비 계산 (unitFee)
        Double unitFee = null;
        if (manVO != null && manVO.getMgmtFeeTotal() != null && mapVo != null && mapVo.getUnitTot() != null && mapVo.getUnitTot() > 0) {
            unitFee = (double) Math.round(manVO.getMgmtFeeTotal() / mapVo.getUnitTot());
        }

        // 7) 공용 관리비 계산 (publicMgmtFee)
        Double publicMgmtFee = null;
        if (manVO != null && mapVo != null && mapVo.getUnitTot() != null && mapVo.getUnitTot() > 0) {
            List<Double> publicFees = Arrays.asList(
                manVO.getCleaningFee(),
                manVO.getSecurityFee(),
                manVO.getDisinfectionFee(),
                manVO.getElevatorMaintFee(),
                manVO.getRepairFee(),
                manVO.getHeatingFeePublic(),
                manVO.getGasUsagePublic(),
                manVO.getElecUsagePublic(),
                manVO.getWaterUsagePublic()
            );

            double publicSum = publicFees.stream()
                                         .filter(Objects::nonNull)
                                         .mapToDouble(Double::doubleValue)
                                         .sum();

            if (publicSum > 0) {
                publicMgmtFee = (double) Math.round(publicSum / mapVo.getUnitTot());
            }
        }

        // 8) 개별 관리비 계산 (personalMgmtFee)
        Double personalMgmtFee = null;
        if (manVO != null && mapVo != null && mapVo.getUnitTot() != null && mapVo.getUnitTot() > 0) {
            List<Double> personalFees = Arrays.asList(
                manVO.getHeatingFeePrivate(),
                manVO.getGasUsagePrivate(),
                manVO.getElecUsagePrivate(),
                manVO.getWaterUsagePrivate()
            );

            double personalSum = personalFees.stream()
                                             .filter(Objects::nonNull)
                                             .mapToDouble(Double::doubleValue)
                                             .sum();

            if (personalSum > 0) {
                personalMgmtFee = (double) Math.round(personalSum / mapVo.getUnitTot());
            }
        }

        response.put("unitFee", unitFee);
        response.put("publicMgmtFee", publicMgmtFee);
        response.put("personalMgmtFee", personalMgmtFee);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api/energyScoreByName")
    @ResponseBody // AJAX 요청이므로 @ResponseBody 추가
    public ResponseEntity<Map<String, String>> getEnergyGradeByName(@RequestParam String cmpxCd) {
        MapVo vo = mapService.getEnergyGradeByName(cmpxCd); //
        System.out.println(vo);
        Map<String, String> result = new HashMap<>();
        if (vo != null) {
            result.put("energyGrade", Optional.ofNullable(vo.getEnergyGrade()).orElse("정보 없음"));
            result.put("energyReq", Optional.ofNullable(vo.getEnergyReq()).orElse("-"));
            result.put("bldName", Optional.ofNullable(vo.getBldName()).orElse("매칭된 인증 건물 없음"));
        } else {
            result.put("energyGrade", "정보 없음");
            result.put("energyReq", "-");
            result.put("bldName", "매칭된 인증 건물 없음");
        }
        return ResponseEntity.ok(result);
    }


}
