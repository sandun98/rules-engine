package com.tech.restAPI;

import com.google.common.base.Enums;
import com.tech.knowledgeBase.KnowledgeBaseService;
import com.tech.knowledgeBase.models.Rule;
import com.tech.ruleEngine.RuleEngine;
import com.tech.rulesImpl.insuranceRuleEngine.InsuranceDetails;
import com.tech.rulesImpl.insuranceRuleEngine.InsuranceInferenceEngine;
import com.tech.rulesImpl.insuranceRuleEngine.PolicyHolderDetails;
import com.tech.rulesImpl.loanRuleEngine.LoanDetails;
import com.tech.rulesImpl.loanRuleEngine.LoanInferenceEngine;
import com.tech.rulesImpl.loanRuleEngine.UserDetails;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
public class RuleEngineRestController {
    private final KnowledgeBaseService knowledgeBaseService;
    private final RuleEngine ruleEngine;
    private final LoanInferenceEngine loanInferenceEngine;
    private final InsuranceInferenceEngine insuranceInferenceEngine;

    public RuleEngineRestController(KnowledgeBaseService knowledgeBaseService, RuleEngine ruleEngine, LoanInferenceEngine loanInferenceEngine, InsuranceInferenceEngine insuranceInferenceEngine) {
        this.knowledgeBaseService = knowledgeBaseService;
        this.ruleEngine = ruleEngine;
        this.loanInferenceEngine = loanInferenceEngine;
        this.insuranceInferenceEngine = insuranceInferenceEngine;
    }

    @GetMapping(value = "/rules-by-nampspace/{namespace}")
    public ResponseEntity<?> getRulesByNamespace(@PathVariable("namespace") String namespace) {
        RuleNamespace ruleNamespace = Enums.getIfPresent(RuleNamespace.class, namespace.toUpperCase()).or(RuleNamespace.DEFAULT);
        List<Rule> allRules = knowledgeBaseService.getAllRuleByNamespace(ruleNamespace.toString());
        return ResponseEntity.ok(allRules);
    }

    @GetMapping(value = "/rules/all")
    public ResponseEntity<?> getAllRules() {
        List<Rule> allRules = knowledgeBaseService.getAllRules();
        return ResponseEntity.ok(allRules);
    }

    @GetMapping(value = "/rules/{page}/{pageSize}/{sort}/{sortOrder}")
    public ResponseEntity<?> findAll(@PathVariable int page, @PathVariable int pageSize,@PathVariable String sort, @PathVariable String sortOrder) {
        List<Rule> allRules = knowledgeBaseService.findAll(page,pageSize,sort,sortOrder);
        Map<String,Object>  res = new HashMap<>();
        res.put("rows", allRules);
        res.put("count", knowledgeBaseService.count());
        return ResponseEntity.ok(res);
    }



    @GetMapping(value = "/rules")
    public ResponseEntity<?> getAllRules(String orderBy, String orded, int page, int rowsPerPAge) {
        List<Rule> allRules = knowledgeBaseService.getAllRules();
        return ResponseEntity.ok(allRules);
    }

    @GetMapping(value = "/rules/{id}")
    public ResponseEntity<?> getAllRule(@PathVariable Long id) {
        Rule allRules = knowledgeBaseService.findById(id);
        return ResponseEntity.ok(allRules);
    }


    @DeleteMapping(value = "/rules/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        knowledgeBaseService.deleteRule(id);
        return ResponseEntity.ok(true);
    }
    @PostMapping(value = "/rules")
    public ResponseEntity<?> saveRule(@RequestBody Rule rule) {
        knowledgeBaseService.save(rule);
        return ResponseEntity.ok(true);
    }



    @PostMapping(value = "/loan")
    public ResponseEntity<?> postUserLoanDetails(@RequestBody UserDetails userDetails) {
        LoanDetails result = (LoanDetails) ruleEngine.run(loanInferenceEngine, userDetails);
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/insurance")
    public ResponseEntity<?> postCarLoanDetails(@RequestBody PolicyHolderDetails policyHolderDetails) {
        InsuranceDetails result = (InsuranceDetails) ruleEngine.run(insuranceInferenceEngine, policyHolderDetails);
        return ResponseEntity.ok(result);
    }
}
