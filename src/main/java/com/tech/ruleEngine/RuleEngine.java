package com.tech.ruleEngine;

import com.tech.knowledgeBase.KnowledgeBaseService;
import com.tech.knowledgeBase.models.Rule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class RuleEngine {

    @Autowired
    private KnowledgeBaseService knowledgeBaseService;

    public Object run(InferenceEngine inferenceEngine, Object inputData) {
        String namespace = inferenceEngine.getNamespace().toString();
        //TODO: Here for each call, we are fetching all rules from db. It should be cache.
        log.debug("name space "+namespace);
        List<Rule> allRulesByNamespace = knowledgeBaseService.getAllRuleByNamespace(namespace);
        Object result = inferenceEngine.run(allRulesByNamespace, inputData);
        return result;
    }

}
