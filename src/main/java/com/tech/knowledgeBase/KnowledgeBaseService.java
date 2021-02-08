package com.tech.knowledgeBase;

import com.google.common.base.Enums;
import com.tech.knowledgeBase.db.RuleDbModel;
import com.tech.knowledgeBase.db.RulesRepository;
import com.tech.knowledgeBase.models.Rule;
import com.tech.restAPI.RuleNamespace;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class KnowledgeBaseService {
    private final RulesRepository rulesRepository;

    public KnowledgeBaseService(RulesRepository rulesRepository) {
        this.rulesRepository = rulesRepository;
    }

    public List<Rule> getAllRules(){
        return rulesRepository.findAll().stream()
                .map(
                        this::mapFromDbModel
                )
                .collect(Collectors.toList());
    }

    public long count(){
        return rulesRepository.count();
    }

    public List<Rule> findAll(int page, int size,String sort, String sortOrder){
        PageRequest pageRequest = PageRequest.of(page, size, "asc".equalsIgnoreCase(sortOrder)?Sort.by(sort).ascending():Sort.by(sort).descending());
        return rulesRepository.findAll(pageRequest).stream()
                .map(this::mapFromDbModel)
                .collect(Collectors.toList());
    }


    public List<Rule> getAllRuleByNamespace(String namespace){
        return rulesRepository.findByNamespace(namespace).stream()
                .map(
                        this::mapFromDbModel
                )
                .collect(Collectors.toList());
    }

    public void save(Rule rule){
        RuleDbModel rm = RuleDbModel.builder()
                .namespace(rule.getNamespace().toString()).id(rule.getId())
                .condition(rule.getCondition())
                .action(rule.getAction())
                .description(rule.getDescription())
                .priority(rule.getPriority())
                .build();
        rulesRepository.save(rm);
    }


    private Rule mapFromDbModel(RuleDbModel ruleDbModel){
        RuleNamespace namespace = Enums.getIfPresent(RuleNamespace.class, ruleDbModel.getNamespace().toUpperCase())
                .or(RuleNamespace.DEFAULT);
        return Rule.builder()
                .namespace(namespace)
                .id(ruleDbModel.getId())
                .condition(ruleDbModel.getCondition())
                .action(ruleDbModel.getAction())
                .description(ruleDbModel.getDescription())
                .priority(ruleDbModel.getPriority())
                .build();
    }


    public Rule findById( Long id) {
        return mapFromDbModel(rulesRepository.findById(id).get());
    }


    public boolean deleteRule(Long id) {
        rulesRepository.deleteById(id);
        return  true;
    }
}
