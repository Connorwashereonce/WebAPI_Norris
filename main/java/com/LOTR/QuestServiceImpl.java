package com.LOTR;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestServiceImpl implements QuestService {

    private final QuestRepository questRepository;

    public QuestServiceImpl(QuestRepository questRepository) {
        this.questRepository = questRepository;
    }

    @Override
    public Quest createQuest(Quest quest) {
        return questRepository.save(quest);
    }

    @Override
    public List<Quest> getAllQuests() {
        return questRepository.findAll();
    }

    @Override
    public Optional<Quest> getQuestById(int id) {
        return questRepository.findById(id);
    }

    @Override
    public Quest updateQuest(int id, Quest questDetails) {
        return questRepository.findById(id)
                .map(quest -> {
                    quest.setQuestName(questDetails.getQuestName());
                    quest.setQuestDescription(questDetails.getQuestDescription());
                    return questRepository.save(quest);
                })
                .orElseThrow(() -> new RuntimeException("Quest not found with ID: " + id));
    }

    @Override
    public void deleteQuest(int id) {
        questRepository.deleteById(id);
    }
}
